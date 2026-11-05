"use client";

import React, { useState, useEffect } from "react";
import { Project, ChatMessage, CaptionOverlay, SceneVersion, StoryBeat } from "@/types";
import { initialProject } from "@/lib/default-project";
import { Header } from "@/components/Header";
import { ChatPanel } from "@/components/ChatPanel";
import { CanvasStage } from "@/components/CanvasStage";
import { Filmstrip } from "@/components/Filmstrip";
import { CharacterLockerModal } from "@/components/CharacterLockerModal";
import { SlideshowModal } from "@/components/SlideshowModal";
import { ComicPageModal } from "@/components/ComicPageModal";
import { AuthModal } from "@/components/AuthModal";
import { ProjectHubModal } from "@/components/ProjectHubModal";
import { SettingsModal } from "@/components/SettingsModal";
import { StoryWizard } from "@/components/StoryWizard";
import { SweetBunny } from "@/components/SweetBunny";
import { generateSingleSceneImage } from "@/lib/image-gen";
import { renderCharacterPortraitDataUri } from "@/lib/layer-compositor";
import { saveProject, loadSavedProject, listSavedProjects, deleteProject, isPlaceholderProject } from "@/lib/supabase-service";

const EMPTY_BEAT: StoryBeat = {
  id: "beat-empty",
  sequenceIndex: 1,
  title: "Scene 1",
  userPromptDescription: "",
  synthesizedPrompt: "",
  currentImageUrl: "",
  versionHistory: [],
  captions: [],
  subtitleText: "",
  durationSeconds: 4,
  isLocked: false
};

const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/** Ensure older saved beats always have the fields the UI needs. */
function normalizeBeat(b: StoryBeat): StoryBeat {
  return {
    ...b,
    currentImageUrl: b.currentImageUrl || "",
    versionHistory: Array.isArray(b.versionHistory) ? b.versionHistory : [],
    captions: Array.isArray(b.captions) ? b.captions : []
  };
}

/** Collect all edit requests made so far on a scene, so edits accumulate. */
function accumulatedEdits(beat: StoryBeat, extra?: string): string | undefined {
  const edits = beat.versionHistory.map((v) => v.editRequest).filter(Boolean) as string[];
  if (extra) edits.push(extra);
  return edits.length ? edits.slice(-4).join("; ") : undefined;
}

function sceneActions(idx: number, total: number): string[] {
  return [
    idx < total - 1 ? "Next scene" : "Play slideshow",
    "Darker lighting",
    "Close-up shot",
    "Add rain"
  ];
}

export default function VizzyStudioPage() {
  const [project, setProject] = useState<Project>(initialProject);
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved_cloud" | "saved_local">("idle");

  const [isLockerOpen, setIsLockerOpen] = useState(false);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [isComicPageOpen, setIsComicPageOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProjectHubOpen, setIsProjectHubOpen] = useState(false);

  const hydrateProject = (raw: Project): Project => {
    const refreshedChars = (raw.characters || []).map((c) => ({
      ...c,
      identity: {
        ...c.identity,
        anchorPortraitUrl: renderCharacterPortraitDataUri(c, raw.styleBible.artStyle)
      }
    }));
    return {
      ...raw,
      characters: refreshedChars,
      beats: (raw.beats || []).map((rawBeat, bIdx) => {
        const b = normalizeBeat(rawBeat);
        const directive = accumulatedEdits(b);
        const gen = generateSingleSceneImage(b.userPromptDescription, raw.styleBible, refreshedChars, directive, bIdx);
        return {
          ...b,
          currentImageUrl: gen.imageUrl,
          synthesizedPrompt: gen.promptUsed,
          versionHistory:
            b.versionHistory.length > 0
              ? b.versionHistory.map((v, vIdx) =>
                  vIdx === b.versionHistory.length - 1 ? { ...v, imageUrl: gen.imageUrl } : v
                )
              : [{ id: `v-${Date.now()}-${bIdx}`, imageUrl: gen.imageUrl, promptUsed: gen.promptUsed, createdAt: now() }]
        };
      })
    };
  };

  const refreshSavedList = async (emailOverride?: string | null) => {
    const all = await listSavedProjects(emailOverride ?? userEmail);
    setSavedProjects(all);
    return all;
  };

  const pushVizzy = (text: string, sceneImagePreview?: string, suggestedActions?: string[]) => {
    setMessages((prev) => [
      ...prev,
      { id: `vizzy-${Date.now()}-${Math.random()}`, sender: "vizzy", text, timestamp: now(), sceneImagePreview, suggestedActions }
    ]);
  };

  /**
   * Open a scene. If it has no image yet, generate it. Then ask the user for edits.
   */
  const goToScene = (idx: number, base?: Project) => {
    const proj = base ?? project;
    if (idx < 0 || idx >= proj.beats.length) return;

    let beat = normalizeBeat(proj.beats[idx]);
    const isNew = !beat.currentImageUrl;
    if (isNew) {
      const gen = generateSingleSceneImage(beat.userPromptDescription, proj.styleBible, proj.characters, undefined, idx);
      beat = {
        ...beat,
        currentImageUrl: gen.imageUrl,
        synthesizedPrompt: gen.promptUsed,
        versionHistory: [{ id: `v-${Date.now()}`, imageUrl: gen.imageUrl, promptUsed: gen.promptUsed, createdAt: now() }]
      };
    }

    const beats = proj.beats.map(normalizeBeat);
    beats[idx] = beat;
    setProject({ ...proj, beats, activeBeatIndex: idx });

    pushVizzy(
      `Scene ${idx + 1} of ${beats.length}: ${beat.title}\n\n${beat.userPromptDescription}`,
      beat.currentImageUrl,
      sceneActions(idx, beats.length)
    );
  };

  // Restore session & last project on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("vizzy_user_email");
    if (savedUser) setUserEmail(savedUser);
    else setIsAuthOpen(true);

    (async () => {
      const saved = await loadSavedProject(savedUser);
      await refreshSavedList(savedUser);
      if (saved) {
        const proj = hydrateProject(saved);
        setProject(proj);
        const active = proj.beats[proj.activeBeatIndex] || proj.beats[0];
        setMessages([
          {
            id: "welcome",
            sender: "vizzy",
            text: `${proj.title} — Scene ${proj.activeBeatIndex + 1}: ${active?.title}\n\n${active?.userPromptDescription || ""}`,
            timestamp: now(),
            sceneImagePreview: active?.currentImageUrl || undefined,
            suggestedActions: sceneActions(proj.activeBeatIndex, proj.beats.length)
          }
        ]);
      } else {
        setProject(initialProject);
        setMessages([]);
        if (savedUser) {
          setIsProjectHubOpen(true);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced auto-save (only save real user projects, never the placeholder)
  useEffect(() => {
    if (isPlaceholderProject(project)) return;
    const timer = setTimeout(async () => {
      setSaveStatus("saving");
      const res = await saveProject(project, userEmail);
      setSaveStatus(res.cloud ? "saved_cloud" : "saved_local");
      await refreshSavedList(userEmail);
    }, 1500);
    return () => clearTimeout(timer);
  }, [project, userEmail]);

  const handleManualSave = async () => {
    if (isPlaceholderProject(project)) return;
    setSaveStatus("saving");
    const res = await saveProject(project, userEmail);
    setSaveStatus(res.cloud ? "saved_cloud" : "saved_local");
    await refreshSavedList(userEmail);
  };

  const handleSelectProject = (selected: Project) => {
    const proj = hydrateProject(selected);
    setProject(proj);
    setIsProjectHubOpen(false);
    const active = proj.beats[proj.activeBeatIndex] || proj.beats[0];
    setMessages([
      {
        id: `switch-${Date.now()}`,
        sender: "vizzy",
        text: `Opened ${proj.title} (Scene ${proj.activeBeatIndex + 1}: ${active?.title}).`,
        timestamp: now(),
        sceneImagePreview: active?.currentImageUrl || undefined,
        suggestedActions: sceneActions(proj.activeBeatIndex, proj.beats.length)
      }
    ]);
  };

  const handleDeleteProject = async (projectId: string) => {
    const deletedTitle =
      projectId === project.id
        ? project.title
        : savedProjects.find((p) => p.id === projectId)?.title || "Project";

    const { remainingProjects } = await deleteProject(projectId, userEmail);
    setSavedProjects(remainingProjects);

    if (projectId === project.id) {
      if (remainingProjects.length > 0) {
        const nextProj = hydrateProject(remainingProjects[0]);
        setProject(nextProj);
        const active = nextProj.beats[nextProj.activeBeatIndex] || nextProj.beats[0];
        setMessages([
          {
            id: `del-${Date.now()}`,
            sender: "vizzy",
            text: `Deleted ${deletedTitle}. Opened ${nextProj.title} (Scene ${nextProj.activeBeatIndex + 1}: ${active?.title}).`,
            timestamp: now(),
            sceneImagePreview: active?.currentImageUrl || undefined,
            suggestedActions: sceneActions(nextProj.activeBeatIndex, nextProj.beats.length)
          }
        ]);
      } else {
        setProject(initialProject);
        setIsProjectHubOpen(false);
        setIsWizardOpen(true);
        setMessages([]);
      }
    }
  };

  const handleLoginSuccess = async (email: string) => {
    setUserEmail(email);
    localStorage.setItem("vizzy_user_email", email);
    const list = await refreshSavedList(email);
    if (list.length > 0) {
      setProject(hydrateProject(list[0]));
    } else {
      setProject(initialProject);
      setMessages([]);
    }
    setIsAuthOpen(false);
    setIsProjectHubOpen(true);
  };

  const handleLogout = () => {
    setUserEmail(null);
    localStorage.removeItem("vizzy_user_email");
    setProject(initialProject);
    setSavedProjects([]);
    setMessages([]);
    setIsProjectHubOpen(false);
    setIsAuthOpen(true);
  };

  const currentBeat = normalizeBeat(project.beats[project.activeBeatIndex] || project.beats[0] || EMPTY_BEAT);
  const idx = project.activeBeatIndex;
  const total = project.beats.length;

  /** Create a new version of the current scene, applying accumulated edits via AI-directed Layered Compositor. */
  const renderEdit = async (editText?: string) => {
    let directive = accumulatedEdits(currentBeat, editText);
    let updatedDescription = currentBeat.userPromptDescription;
    let updatedCharacters = project.characters;
    let updatedCaptions = currentBeat.captions;
    let aiReply: string | undefined;

    if (editText) {
      try {
        const res = await fetch("/api/scene-editor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userInstruction: editText,
            currentSceneTitle: currentBeat.title,
            currentSceneDescription: currentBeat.userPromptDescription,
            currentEditDirective: accumulatedEdits(currentBeat),
            characters: project.characters.map((c) => ({
              id: c.id,
              name: c.name,
              hairAndEyes: c.identity.hairAndEyes,
              facialFeatures: c.identity.facialFeatures,
              currentAttire: c.currentAttire
            }))
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.updatedDirective) directive = data.updatedDirective;
          if (data.updatedDescription) updatedDescription = data.updatedDescription;
          if (data.reply) aiReply = data.reply;

          if (Array.isArray(data.characterUpdates) && data.characterUpdates.length > 0) {
            updatedCharacters = project.characters.map((c) => {
              const patch = data.characterUpdates.find((u: { id?: string }) => u.id === c.id);
              if (!patch) return c;
              const nextChar = {
                ...c,
                currentAttire: patch.currentAttire || c.currentAttire,
                identity: {
                  ...c.identity,
                  hairAndEyes: patch.hairAndEyes || c.identity.hairAndEyes,
                  facialFeatures: patch.facialFeatures || c.identity.facialFeatures,
                  customSvg: patch.customSvg ?? c.identity.customSvg,
                  customColors: patch.customColors ? { ...c.identity.customColors, ...patch.customColors } : c.identity.customColors
                }
              };
              nextChar.identity.anchorPortraitUrl = renderCharacterPortraitDataUri(nextChar, project.styleBible.artStyle);
              return nextChar;
            });
          }

          if (Array.isArray(data.newCharacters) && data.newCharacters.length > 0) {
            const createdChars = data.newCharacters
              .filter((nc: { name?: string }) => nc?.name)
              .map((nc: { name: string; role?: string; age?: string; hairAndEyes?: string; facialFeatures?: string; currentAttire?: string; customSvg?: string; customColors?: Record<string, string> }, cIdx: number) => {
                const newChar = {
                  id: `char-${Date.now()}-${cIdx}`,
                  name: nc.name,
                  role: nc.role || "Story Character",
                  isLocked: true,
                  currentAttire: nc.currentAttire || "dark trench coat",
                  identity: {
                    age: nc.age || "30s",
                    facialFeatures: nc.facialFeatures || "sharp determined features",
                    hairAndEyes: nc.hairAndEyes || "short dark hair, cyan eyes",
                    bodyBuild: "Proportional build",
                    anchorPortraitUrl: "",
                    customSvg: nc.customSvg,
                    customColors: nc.customColors
                  }
                };
                newChar.identity.anchorPortraitUrl = renderCharacterPortraitDataUri(newChar, project.styleBible.artStyle);
                return newChar;
              });
            if (createdChars.length > 0) {
              updatedCharacters = [...updatedCharacters, ...createdChars];
              // Ensure the new character's name is in updatedDescription so they appear in this scene
              const addedNames = createdChars.map((c: { name: string }) => c.name).join(" and ");
              if (!updatedDescription.toLowerCase().includes(createdChars[0].name.toLowerCase())) {
                updatedDescription = `${updatedDescription} ${addedNames} enters the scene.`;
              }
            }
          }

          if (data.newBubble?.text) {
            updatedCaptions = [
              ...currentBeat.captions,
              {
                id: `cap-${Date.now()}`,
                type: "speech",
                speaker: data.newBubble.speaker || updatedCharacters[0]?.name || "Speaker",
                text: data.newBubble.text,
                xPercent: 35 + Math.random() * 25,
                yPercent: 45 + Math.random() * 20
              }
            ];
          }
        }
      } catch {
        // Fallback to local keyword parser
      }
    }

    const variationSeed = editText ? 0 : currentBeat.versionHistory.length;
    const gen = generateSingleSceneImage(updatedDescription, project.styleBible, updatedCharacters, directive, idx, variationSeed);
    const version: SceneVersion = {
      id: `v-${Date.now()}`,
      imageUrl: gen.imageUrl,
      promptUsed: gen.promptUsed,
      editRequest: directive || editText || "Re-compose",
      createdAt: now()
    };
    setProject((prev) => {
      const beats = prev.beats.map(normalizeBeat);
      const b = beats[prev.activeBeatIndex];
      beats[prev.activeBeatIndex] = {
        ...b,
        userPromptDescription: updatedDescription,
        currentImageUrl: gen.imageUrl,
        synthesizedPrompt: gen.promptUsed,
        captions: updatedCaptions,
        isLocked: false,
        versionHistory: [...b.versionHistory, version]
      };
      return { ...prev, characters: updatedCharacters, beats };
    });
    pushVizzy(
      aiReply
        ? aiReply
        : editText
        ? `Updated Scene ${idx + 1} (${editText}).`
        : `Redrew Scene ${idx + 1}.`,
      gen.imageUrl,
      sceneActions(idx, total)
    );
  };

  const approveAndNext = () => {
    const beats = project.beats.map(normalizeBeat);
    beats[idx] = { ...beats[idx], isLocked: true };
    const approved = { ...project, beats };
    if (idx < total - 1) {
      goToScene(idx + 1, approved);
    } else {
      setProject(approved);
      pushVizzy(
        `All ${total} scenes are ready.`,
        undefined,
        ["Play slideshow", "Go to scene 1"]
      );
    }
  };

  const handleSendMessage = async (text: string) => {
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, sender: "user", text, timestamp: now() }]);
    const lower = text.toLowerCase();
    setIsLoading(true);

    try {
      // Navigation & control commands
      if (lower.includes("play slideshow") || lower.includes("▶")) {
        if (lower.includes("looks good")) {
          const beats = project.beats.map(normalizeBeat);
          beats[idx] = { ...beats[idx], isLocked: true };
          setProject({ ...project, beats });
        }
        setIsSlideshowOpen(true);
        return;
      }
      if (lower.includes("looks good") || lower.includes("next scene") || lower === "next" || lower.includes("approve")) {
        approveAndNext();
        return;
      }
      if (lower.includes("previous scene") || lower.includes("go back")) {
        if (idx > 0) goToScene(idx - 1);
        else pushVizzy("You're already on the first scene.");
        return;
      }
      const goTo = lower.match(/(?:go to|open|show|jump to)\s+scene\s+(\d+)/);
      if (goTo) {
        const target = Number(goTo[1]) - 1;
        if (target >= 0 && target < total) goToScene(target);
        else pushVizzy(`There are only ${total} scenes.`);
        return;
      }
      if (lower.includes("re-render") || lower.includes("rerender") || lower.includes("regenerate")) {
        await renderEdit();
        return;
      }
      if (/(edit|change|design|update).*character|character.*(edit|change|look)/.test(lower)) {
        setIsLockerOpen(true);
        pushVizzy(
          "Opened **Style & Characters** — edit any character's face, clothes, or generate a new look. Scenes you re-render afterwards will use the updated design."
        );
        return;
      }
      if (/(delete|remove|trash|clear)\s+(this\s+|current\s+)?project/.test(lower)) {
        await handleDeleteProject(project.id);
        return;
      }

      // Anything else is treated as an AI-directed edit request for the current scene
      await renderEdit(text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVersion = (imageUrl: string) => {
    setProject((prev) => {
      const beats = prev.beats.map(normalizeBeat);
      beats[prev.activeBeatIndex] = { ...beats[prev.activeBeatIndex], currentImageUrl: imageUrl };
      return { ...prev, beats };
    });
  };

  const handleAddNewBeat = () => {
    const n = project.beats.length + 1;
    const newBeat: StoryBeat = {
      id: `beat-${Date.now()}`,
      sequenceIndex: n,
      title: `Scene ${n}`,
      userPromptDescription: `A new moment continuing the story of ${project.title}.`,
      synthesizedPrompt: "",
      currentImageUrl: "",
      versionHistory: [],
      captions: [],
      subtitleText: "",
      durationSeconds: 4,
      isLocked: false
    };
    const proj = { ...project, beats: [...project.beats.map(normalizeBeat), newBeat] };
    goToScene(n - 1, proj);
  };

  const handleDeleteBeat = (delIdx: number) => {
    if (project.beats.length <= 1) return;
    setProject((prev) => {
      const remaining = prev.beats
        .filter((_, i) => i !== delIdx)
        .map((b, i) => ({ ...normalizeBeat(b), sequenceIndex: i + 1 }));
      const nextActive = Math.min(prev.activeBeatIndex, remaining.length - 1);
      return { ...prev, beats: remaining, activeBeatIndex: nextActive };
    });
  };

  const handleDuplicateBeat = (dupIdx: number) => {
    setProject((prev) => {
      const target = normalizeBeat(prev.beats[dupIdx]);
      const copy: StoryBeat = {
        ...target,
        id: `beat-${Date.now()}`,
        title: `${target.title} (Copy)`,
        isLocked: false
      };
      const nextBeats = [...prev.beats];
      nextBeats.splice(dupIdx + 1, 0, copy);
      const reindexed = nextBeats.map((b, i) => ({ ...normalizeBeat(b), sequenceIndex: i + 1 }));
      return { ...prev, beats: reindexed, activeBeatIndex: dupIdx + 1 };
    });
  };

  const handleMoveBeat = (fromIdx: number, direction: -1 | 1) => {
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx >= project.beats.length) return;
    setProject((prev) => {
      const nextBeats = [...prev.beats];
      const [moved] = nextBeats.splice(fromIdx, 1);
      nextBeats.splice(toIdx, 0, moved);
      const reindexed = nextBeats.map((b, i) => ({ ...normalizeBeat(b), sequenceIndex: i + 1 }));
      return { ...prev, beats: reindexed, activeBeatIndex: toIdx };
    });
  };

  /** Instant 0ms layer update when clicking any Comicgen / Storyboarder Director Dock pill. */
  const handleQuickDirectLayer = (directiveChip: string) => {
    const combinedDirective = accumulatedEdits(currentBeat, directiveChip);
    const gen = generateSingleSceneImage(
      currentBeat.userPromptDescription,
      project.styleBible,
      project.characters,
      combinedDirective,
      idx
    );
    const version: SceneVersion = {
      id: `v-${Date.now()}`,
      imageUrl: gen.imageUrl,
      promptUsed: gen.promptUsed,
      editRequest: directiveChip,
      createdAt: now()
    };
    setProject((prev) => {
      const beats = prev.beats.map(normalizeBeat);
      const b = beats[prev.activeBeatIndex];
      beats[prev.activeBeatIndex] = {
        ...b,
        currentImageUrl: gen.imageUrl,
        synthesizedPrompt: gen.promptUsed,
        isLocked: false,
        versionHistory: [...b.versionHistory, version]
      };
      return { ...prev, beats };
    });
  };

  const handleAddEditedVersion = (imageUrl: string, editLabel: string) => {
    const version: SceneVersion = {
      id: `v-${Date.now()}`,
      imageUrl,
      promptUsed: editLabel,
      editRequest: editLabel,
      createdAt: now()
    };
    setProject((prev) => {
      const beats = prev.beats.map(normalizeBeat);
      const b = beats[prev.activeBeatIndex];
      beats[prev.activeBeatIndex] = {
        ...b,
        currentImageUrl: imageUrl,
        synthesizedPrompt: editLabel,
        isLocked: false,
        versionHistory: [...b.versionHistory, version]
      };
      return { ...prev, beats };
    });
    pushVizzy(`Updated Scene ${idx + 1} (${editLabel}).`);
  };

  const updateCurrentBeat = (patch: Partial<StoryBeat>) => {
    setProject((prev) => {
      const beats = prev.beats.map(normalizeBeat);
      beats[prev.activeBeatIndex] = { ...beats[prev.activeBeatIndex], ...patch };
      return { ...prev, beats };
    });
  };

  const handleWizardComplete = (newProj: Project) => {
    setIsWizardOpen(false);
    setIsProjectHubOpen(false);
    setMessages([
      {
        id: `start-${Date.now()}`,
        sender: "vizzy",
        text: `${newProj.title} (${newProj.beats.length} scenes, ${newProj.characters.map((c) => c.name).join(", ")}).`,
        timestamp: now()
      }
    ]);
    goToScene(0, newProj);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      <Header
        project={project}
        onOpenCharacterLocker={() => setIsLockerOpen(true)}
        onStartSlideshow={() => setIsSlideshowOpen(true)}
        onOpenComicPage={() => setIsComicPageOpen(true)}
        onToggleDisplayMode={() =>
          setProject((prev) => ({ ...prev, displayMode: prev.displayMode === "comic" ? "cinematic" : "comic" }))
        }
        onManualSave={handleManualSave}
        onOpenProjectHub={() => {
          refreshSavedList();
          setIsProjectHubOpen(true);
        }}
        onDeleteCurrentProject={() => handleDeleteProject(project.id)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        saveStatus={saveStatus}
        userEmail={userEmail || undefined}
      />

      {!isPlaceholderProject(project) ? (
        <>
          <div className="flex-1 flex overflow-hidden">
            <ChatPanel
              messages={messages}
              currentBeat={currentBeat}
              onSendMessage={handleSendMessage}
              onRerollCurrent={() => handleSendMessage("Re-render")}
              onSelectVersion={handleSelectVersion}
              isLoading={isLoading}
            />
            <CanvasStage
              key={`${currentBeat.id}-${currentBeat.currentImageUrl}`}
              currentBeat={currentBeat}
              displayMode={project.displayMode}
              aspectRatio={project.styleBible.aspectRatio}
              artStyle={project.styleBible.artStyle}
              onUpdateCaptions={(captions: CaptionOverlay[]) => updateCurrentBeat({ captions })}
              onSelectVersionUrl={handleSelectVersion}
              onToggleLockBeat={() => updateCurrentBeat({ isLocked: !currentBeat.isLocked })}
              onQuickDirectLayer={handleQuickDirectLayer}
              onAddEditedVersion={handleAddEditedVersion}
            />
          </div>

          <Filmstrip
            beats={project.beats.map(normalizeBeat)}
            activeBeatIndex={project.activeBeatIndex}
            artStyle={project.styleBible.artStyle}
            onSelectBeat={(i) => goToScene(i)}
            onAddNewBeat={handleAddNewBeat}
            onDeleteBeat={handleDeleteBeat}
            onDuplicateBeat={handleDuplicateBeat}
            onMoveBeat={handleMoveBeat}
          />
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-6 text-center">
          <p className="text-sm font-medium text-zinc-300">No storyboard open</p>
          <p className="text-xs text-zinc-500 mt-1 mb-4">
            Create a new storyboard to start generating scenes.
          </p>
          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-4 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium cursor-pointer"
          >
            New Storyboard
          </button>
        </div>
      )}

      <CharacterLockerModal
        isOpen={isLockerOpen}
        onClose={() => setIsLockerOpen(false)}
        characters={project.characters}
        styleBible={project.styleBible}
        onUpdateCharacters={(chars) =>
          setProject((prev) => {
            const updatedChars = chars.map((c) => ({
              ...c,
              identity: {
                ...c.identity,
                anchorPortraitUrl:
                  !c.identity.anchorPortraitUrl || c.identity.anchorPortraitUrl.startsWith("data:image/svg")
                    ? renderCharacterPortraitDataUri(c, prev.styleBible.artStyle)
                    : c.identity.anchorPortraitUrl
              }
            }));
            // Automatically update layered scenes so character edits apply across the storyboard
            const updatedBeats = prev.beats.map((rawBeat, bIdx) => {
              const b = normalizeBeat(rawBeat);
              if (!b.currentImageUrl || b.currentImageUrl.startsWith("data:image/svg")) {
                const directive = accumulatedEdits(b);
                const gen = generateSingleSceneImage(b.userPromptDescription, prev.styleBible, updatedChars, directive, bIdx);
                return { ...b, currentImageUrl: gen.imageUrl, synthesizedPrompt: gen.promptUsed };
              }
              return b;
            });
            return { ...prev, characters: updatedChars, beats: updatedBeats };
          })
        }
        onUpdateStyleBible={(bible) => setProject((prev) => ({ ...prev, styleBible: bible }))}
        onApplyBackgroundId={(bgId, bgName) => {
          renderEdit(`Switch background to ${bgId} (${bgName})`);
        }}
      />

      <SlideshowModal isOpen={isSlideshowOpen} onClose={() => setIsSlideshowOpen(false)} project={project} />

      <ComicPageModal
        isOpen={isComicPageOpen}
        onClose={() => setIsComicPageOpen(false)}
        project={project}
        onSelectScene={(i) => goToScene(i)}
      />

      <AuthModal isOpen={isAuthOpen} onLoginSuccess={handleLoginSuccess} />

      <ProjectHubModal
        isOpen={isProjectHubOpen}
        onClose={() => setIsProjectHubOpen(false)}
        currentProject={project}
        savedProjects={savedProjects}
        onResumeCurrent={() => setIsProjectHubOpen(false)}
        onSelectProject={handleSelectProject}
        onDeleteProject={handleDeleteProject}
        onCreateNew={() => {
          setIsProjectHubOpen(false);
          setIsWizardOpen(true);
        }}
        userEmail={userEmail || undefined}
        onLogout={handleLogout}
      />

      <StoryWizard
        isOpen={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          setIsProjectHubOpen(true);
        }}
        onComplete={handleWizardComplete}
      />

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <SweetBunny
        currentProjectTitle={!isPlaceholderProject(project) ? project.title : undefined}
        activeSceneTitle={!isPlaceholderProject(project) ? currentBeat.title : undefined}
        isModalOpen={isProjectHubOpen || isWizardOpen || isLockerOpen || isSlideshowOpen || isComicPageOpen || isAuthOpen || isSettingsOpen}
      />
    </div>
  );
}
