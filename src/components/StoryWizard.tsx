"use client";

import React, { useState } from "react";
import { Project } from "@/types";
import { STYLE_PRESETS } from "@/lib/style-presets";
import { PlannedScene, PlannedCharacter, PlannedStory, buildProjectFromPlan, localPlanStory } from "@/lib/story-planner";
import { buildImageUrl } from "@/lib/image-gen";
import { renderCharacterPortraitDataUri, registerCustomPresetInStorage } from "@/lib/layer-compositor";
import { X, Check, ArrowRight, ArrowLeft, Loader2, Sparkles, Plus, Trash2, RefreshCw, Film, User, BookOpen } from "lucide-react";

interface StoryWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (project: Project) => void;
}

const STEPS = [
  { label: "Story", icon: BookOpen },
  { label: "Scenes", icon: Film },
  { label: "Characters", icon: User }
];

export const StoryWizard: React.FC<StoryWizardProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [numSlides, setNumSlides] = useState(6);
  const [styleIdx, setStyleIdx] = useState(0);
  const [isPlanning, setIsPlanning] = useState(false);
  const [planSource, setPlanSource] = useState<"gemini" | "local" | null>(null);
  const [scenes, setScenes] = useState<PlannedScene[]>([]);
  const [characters, setCharacters] = useState<PlannedCharacter[]>([]);
  const [aiCharInput, setAiCharInput] = useState("");
  const [isAddingAiChar, setIsAddingAiChar] = useState(false);
  const [modifyInputs, setModifyInputs] = useState<Record<number, string>>({});
  const [modifyingIdx, setModifyingIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const preset = STYLE_PRESETS[styleIdx];

  const reset = () => {
    setStep(0);
    setTitle("");
    setStory("");
    setNumSlides(6);
    setStyleIdx(0);
    setScenes([]);
    setCharacters([]);
    setPlanSource(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Step 1 -> 2: split story into scenes
  const handleSplitStory = async () => {
    if (!title.trim() || !story.trim()) return;
    setIsPlanning(true);
    let plan: PlannedStory;
    try {
      const res = await fetch("/api/story-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, story, numScenes: numSlides, artStyle: preset.name })
      });
      plan = res.ok ? await res.json() : localPlanStory(title, story, numSlides);
    } catch {
      plan = localPlanStory(title, story, numSlides);
    }
    setScenes(plan.scenes);
    setCharacters(
      plan.characters.map((c, idx) => ({
        ...c,
        portraitUrl: renderCharacterPortraitDataUri(
          {
            id: `wiz-${idx}`,
            name: c.name,
            role: c.role,
            isLocked: true,
            currentAttire: c.attire,
            identity: {
              age: c.age,
              facialFeatures: c.facialFeatures,
              hairAndEyes: c.hairAndEyes,
              bodyBuild: "Athletic"
            }
          },
          preset.name
        )
      }))
    );
    setPlanSource(plan.source);
    setIsPlanning(false);
    setStep(1);
  };

  const updateScene = (i: number, field: keyof PlannedScene, value: string) => {
    setScenes((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  };

  const updateChar = (i: number, field: keyof PlannedCharacter, value: string) => {
    setCharacters((prev) =>
      prev.map((c, idx) => {
        if (idx !== i) return c;
        const updated: PlannedCharacter = { ...c, [field]: value };
        // Clear AI hex overrides if the user manually edits text traits so text keywords take effect immediately
        if (field === "hairAndEyes" || field === "facialFeatures" || field === "attire") {
          updated.customColors = undefined;
        }
        return updated;
      })
    );
  };

  const generatePortrait = (i: number) => {
    const c = characters[i];
    const url = buildImageUrl(
      `Single close-up portrait of one person only, head and shoulders facing camera: ${c.name}, ${c.role}, age ${c.age}, ${c.facialFeatures}, ${c.hairAndEyes}, wearing ${c.attire}. Style: ${preset.name}, ${preset.visualTone}. Detailed solo character portrait`,
      { seed: Math.floor(Math.random() * 900000), aspectRatio: "1:1" }
    );
    setCharacters((prev) => prev.map((ch, idx) => (idx === i ? { ...ch, portraitUrl: url } : ch)));
  };

  const addCharacterWithAi = async () => {
    if (!aiCharInput.trim() || isAddingAiChar) return;
    setIsAddingAiChar(true);
    try {
      const res = await fetch("/api/character-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiCharInput.trim(), mode: "create", artStyle: preset.name })
      });
      if (res.ok) {
        const data = await res.json();
        const c = data.character;
        if (c) {
          registerCustomPresetInStorage({
            name: `${c.name} — ${c.role}`,
            role: c.role,
            archetype: c.role,
            age: c.age,
            hairAndEyes: c.hairAndEyes,
            facialFeatures: c.facialFeatures,
            attire: c.currentAttire,
            customSvg: c.customSvg
          });
          const portraitUrl = renderCharacterPortraitDataUri(
            {
              id: `wiz-ai-${Date.now()}`,
              name: c.name,
              role: c.role,
              isLocked: true,
              currentAttire: c.currentAttire,
              identity: {
                age: c.age,
                facialFeatures: c.facialFeatures,
                hairAndEyes: c.hairAndEyes,
                bodyBuild: "Athletic",
                customSvg: c.customSvg,
                customColors: c.customColors
              }
            },
            preset.name
          );
          setCharacters((prev) => [
            ...prev,
            {
              name: c.name,
              role: c.role,
              age: c.age,
              hairAndEyes: c.hairAndEyes,
              facialFeatures: c.facialFeatures,
              attire: c.currentAttire,
              portraitUrl,
              customSvg: c.customSvg,
              customColors: c.customColors
            }
          ]);
          setAiCharInput("");
        }
      }
    } finally {
      setIsAddingAiChar(false);
    }
  };

  const modifyCharacterWithAi = async (i: number) => {
    const promptText = (modifyInputs[i] || "").trim();
    const target = characters[i];
    if (!promptText || !target || modifyingIdx !== null) return;
    setModifyingIdx(i);
    try {
      const res = await fetch("/api/character-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          mode: "modify",
          artStyle: preset.name,
          existingCharacter: {
            name: target.name,
            role: target.role,
            age: target.age,
            hairAndEyes: target.hairAndEyes,
            facialFeatures: target.facialFeatures,
            currentAttire: target.attire,
            customSvg: target.customSvg,
            customColors: target.customColors
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const c = data.character;
        if (c) {
          registerCustomPresetInStorage({
            name: `${c.name || target.name} — ${c.role || target.role}`,
            role: c.role || target.role,
            archetype: c.role || target.role,
            age: c.age || target.age,
            hairAndEyes: c.hairAndEyes || target.hairAndEyes,
            facialFeatures: c.facialFeatures || target.facialFeatures,
            attire: c.currentAttire || target.attire,
            customSvg: c.customSvg
          });
          const portraitUrl = renderCharacterPortraitDataUri(
            {
              id: `wiz-mod-${i}-${Date.now()}`,
              name: c.name || target.name,
              role: c.role || target.role,
              isLocked: true,
              currentAttire: c.currentAttire || target.attire,
              identity: {
                age: c.age || target.age,
                facialFeatures: c.facialFeatures || target.facialFeatures,
                hairAndEyes: c.hairAndEyes || target.hairAndEyes,
                bodyBuild: "Athletic",
                customSvg: c.customSvg,
                customColors: c.customColors
              }
            },
            preset.name
          );
          setCharacters((prev) =>
            prev.map((ch, idx) =>
              idx === i
                ? {
                    name: c.name || ch.name,
                    role: c.role || ch.role,
                    age: c.age || ch.age,
                    hairAndEyes: c.hairAndEyes || ch.hairAndEyes,
                    facialFeatures: c.facialFeatures || ch.facialFeatures,
                    attire: c.currentAttire || ch.attire,
                    portraitUrl,
                    customSvg: c.customSvg,
                    customColors: c.customColors
                  }
                : ch
            )
          );
          setModifyInputs((prev) => ({ ...prev, [i]: "" }));
        }
      }
    } finally {
      setModifyingIdx(null);
    }
  };

  const addCharacter = () => {
    setCharacters((prev) => [
      ...prev,
      {
        name: "New Character",
        role: "Supporting Character",
        age: "30s",
        facialFeatures: "Distinctive features",
        hairAndEyes: "Dark hair, dark eyes",
        attire: "Clothing fitting the story"
      }
    ]);
  };

  const handleLaunch = () => {
    const project = buildProjectFromPlan(title.trim(), story.trim(), preset, scenes, characters);
    onComplete(project);
    reset();
  };

  const inputCls =
    "w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header with stepper */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-100">New Storyboard</h2>

          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = i < step;
              const active = i === step;
              return (
                <React.Fragment key={s.label}>
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                      active
                        ? "bg-zinc-800 border-zinc-600 text-zinc-100"
                        : done
                        ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                        : "border-zinc-800/60 text-zinc-600"
                    }`}
                  >
                    {done ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                    <span>
                      {i + 1}. {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && <div className="w-4 h-px bg-zinc-800" />}
                </React.Fragment>
              );
            })}
          </div>

          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* STEP 1: Title, story, slides, style */}
          {step === 0 && (
            <div className="space-y-5">
              {/* Sample Script Loader */}
              <div className="p-3 rounded-lg bg-zinc-900/70 border border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-zinc-400">
                  Sample scripts
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    {
                      label: "Cyberpunk Heist",
                      title: "Protocol: Zero Hour",
                      slides: 6,
                      style: 0,
                      script:
                        "Ren, a silver-haired cyber-detective with a glowing cyan visor and a dark trench coat, stands on a rain-slicked Neo-Tokyo rooftop at midnight watching the corporate citadel.\nDown in the neon noodle alley, Ren meets Lyra, a rogue netrunner with twin violet braids, gold eyes, and a crimson tech jacket, who hands him a stolen quantum holodrive.\nSuddenly, Commander Vex—an armored syndicate enforcer with a scarred jaw, red cybernetic eyes, and a heavy plasma rifle—ambushes them in the steam-filled alley with red security lasers.\nLyra hacks the street's power grid while Ren draws his katana, deflecting a barrage of plasma fire as neon billboards explode in a shower of sparks overhead.\nRen and Lyra race across the skybridge in the pouring rain, cornering Vex at the edge of the broadcast tower spire.\nInside the high-altitude server core, Lyra uploads the quantum drive to free the city's AI network as dawn breaks over the cyberpunk skyline."
                    },
                    {
                      label: "Demon vs. Angel Duel",
                      title: "Eclipse of the Fallen Seraph",
                      slides: 5,
                      style: 1,
                      script:
                        "Dante, a crimson-haired demon warrior with curved horns, dark wings, golden eyes, and a flaming scythe, stands atop a shattered cathedral altar under a blood-red storm.\nSeraphina, a celestial valkyrie with long silver hair, a glowing golden halo, feathered angel wings, and a royal purple cloak with a magic staff, descends from the clouds to confront him.\nThey clash in the citadel courtyard as purple lightning and fiery embers swirl around their blades.\nDante smirks with crossed arms as he deflects Seraphina's arcane beam, revealing the stolen ancient amulet that can seal the underworld rift.\nTogether they combine their light and shadow magic to close the portal before the mountain sanctuary collapses."
                    },
                    {
                      label: "Space Outlaw Odyssey",
                      title: "Starlight Anomaly",
                      slides: 5,
                      style: 3,
                      script:
                        "Captain Orion, a space outlaw with messy green hair, emerald eyes, a cheek scar, and a crimson cyber jacket with a pistol, gazes out the starship bridge viewport at a purple nebula.\nBeside him, Doctor Nova, an astrophysicist with a blonde bob cut, glasses, and a white lab coat holding a holodrive, detects an ancient signal from a derelict orbital station.\nThey board the zero-gravity vault where Warden Kaelos—an alien guardian with blue skin, antennae, and gold plate armor with a battleaxe—awakens.\nOrion aims his plasma pistol while Nova unlocks the glowing star-core in a shower of electric sparks.\nThey sprint back to their dropship and blast out of the hangar bay just as the station explodes."
                    }
                  ].map((demo) => (
                    <button
                      key={demo.label}
                      type="button"
                      onClick={() => {
                        setTitle(demo.title);
                        setStory(demo.script);
                        setNumSlides(demo.slides);
                        setStyleIdx(demo.style);
                      }}
                      className="px-2.5 py-1 rounded-md bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 border border-zinc-800 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      {demo.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Storyboard Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Protocol: Zero Hour or The Shadow Key"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Story / Script / Notes *
                </label>
                <textarea
                  rows={8}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Paste your script or high-level outline. e.g. Ren, a cyber-detective, navigates the neon-soaked alleys of Neo-Tokyo searching for an encrypted holodrive..."
                  className={inputCls}
                />
                <p className="text-[10px] text-zinc-500 mt-1">{story.trim().split(/\s+/).filter(Boolean).length} words</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Number of Slides / Scenes</label>
                  <span className="text-sm font-black text-amber-400">{numSlides}</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={20}
                  value={numSlides}
                  onChange={(e) => setNumSlides(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-0.5">
                  <span>3</span>
                  <span>~{Math.round(numSlides * 4)}s slideshow</span>
                  <span>20</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">Visual Style & Palette</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STYLE_PRESETS.map((p, idx) => (
                    <div
                      key={p.name}
                      onClick={() => setStyleIdx(idx)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        styleIdx === idx
                          ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/40"
                          : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-zinc-200">{p.name}</span>
                        {styleIdx === idx && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">{p.visualTone}</p>
                      <div className="flex gap-1.5 mt-2">
                        {p.colors.map((c) => (
                          <div key={c} className="w-4 h-4 rounded-full border border-zinc-700" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Review & edit split scenes */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-400">
                  Your story was split into <strong className="text-amber-400">{scenes.length} scenes</strong>
                  {planSource === "gemini" ? " by Gemini" : " (offline splitter)"}. Edit anything before continuing.
                </p>
              </div>
              {scenes.map((s, i) => (
                <div key={i} className="p-3 rounded-2xl border border-zinc-800 bg-zinc-950/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 flex-shrink-0">
                      SCENE {i + 1}
                    </span>
                    <input
                      value={s.title}
                      onChange={(e) => updateScene(i, "title", e.target.value)}
                      className="flex-1 bg-transparent text-xs font-bold text-zinc-100 focus:outline-none border-b border-transparent focus:border-amber-500"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={s.description}
                    onChange={(e) => updateScene(i, "description", e.target.value)}
                    className={inputCls}
                  />
                  <input
                    value={s.narration}
                    onChange={(e) => updateScene(i, "narration", e.target.value)}
                    placeholder="Narration caption"
                    className={`${inputCls} italic`}
                  />
                  {s.dialogue.length > 0 && (
                    <div className="text-[11px] text-zinc-400 space-y-0.5">
                      {s.dialogue.map((d, j) => (
                        <p key={j}>
                          <strong className="text-zinc-300">{d.speaker}:</strong> &ldquo;{d.text}&rdquo;
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: Design main characters */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-400">
                  Design your main characters or add new ones with AI. You can also edit or add characters anytime later from{" "}
                  <strong className="text-zinc-200">Style &amp; Characters</strong> or via chat.
                </p>
                <button
                  onClick={addCharacter}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer flex-shrink-0 ml-3"
                >
                  <Plus className="w-3.5 h-3.5" /> Blank
                </button>
              </div>

              {/* Character Creator Bar in Step 3 */}
              <div className="flex gap-2 p-3 rounded-lg bg-zinc-900/70 border border-zinc-800">
                <input
                  type="text"
                  value={aiCharInput}
                  onChange={(e) => setAiCharInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCharacterWithAi()}
                  placeholder="Describe a character to add (e.g. 'Commander Vex, scarred enforcer with red visor and katana')..."
                  className={inputCls}
                />
                <button
                  onClick={addCharacterWithAi}
                  disabled={!aiCharInput.trim() || isAddingAiChar}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs whitespace-nowrap cursor-pointer disabled:opacity-40"
                >
                  {isAddingAiChar && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Add Character</span>
                </button>
              </div>

              {characters.map((c, i) => {
                const livePortraitUrl = renderCharacterPortraitDataUri(
                  {
                    id: `wiz-${i}`,
                    name: c.name,
                    role: c.role,
                    isLocked: true,
                    currentAttire: c.attire,
                    identity: {
                      age: c.age,
                      facialFeatures: c.facialFeatures,
                      hairAndEyes: c.hairAndEyes,
                      bodyBuild: "Athletic",
                      customSvg: c.customSvg,
                      customColors: c.customColors
                    }
                  },
                  preset.name
                );
                return (
                <div key={i} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/40 flex flex-col gap-3">
                  <div className="flex gap-4">
                    {/* Portrait */}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div className="w-28 h-28 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={livePortraitUrl} alt={c.name} className="w-full h-full object-cover" />
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input value={c.name} onChange={(e) => updateChar(i, "name", e.target.value)} placeholder="Name" className={inputCls} />
                      <input value={c.role} onChange={(e) => updateChar(i, "role", e.target.value)} placeholder="Role" className={inputCls} />
                      <input value={c.age} onChange={(e) => updateChar(i, "age", e.target.value)} placeholder="Age" className={inputCls} />
                      <input value={c.hairAndEyes} onChange={(e) => updateChar(i, "hairAndEyes", e.target.value)} placeholder="Hair & eyes" className={inputCls} />
                      <input
                        value={c.facialFeatures}
                        onChange={(e) => updateChar(i, "facialFeatures", e.target.value)}
                        placeholder="Facial features (scars, jaw, skin...)"
                        className={`${inputCls} col-span-2`}
                      />
                      <input
                        value={c.attire}
                        onChange={(e) => updateChar(i, "attire", e.target.value)}
                        placeholder="Clothing / attire"
                        className={`${inputCls} col-span-2`}
                      />
                    </div>

                    <button
                      onClick={() => setCharacters((prev) => prev.filter((_, idx) => idx !== i))}
                      className="self-start p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                      title="Remove character"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Per-Character Modify Bar */}
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
                    <input
                      type="text"
                      value={modifyInputs[i] || ""}
                      onChange={(e) => setModifyInputs((prev) => ({ ...prev, [i]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && modifyCharacterWithAi(i)}
                      placeholder={`Update ${c.name || "character"} (e.g. 'crimson spiky hair, eyepatch, gold armor')...`}
                      className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                    />
                    <button
                      onClick={() => modifyCharacterWithAi(i)}
                      disabled={!(modifyInputs[i] || "").trim() || modifyingIdx !== null}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-medium text-xs whitespace-nowrap transition-colors cursor-pointer disabled:opacity-40"
                    >
                      {modifyingIdx === i ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <span>Apply Changes</span>
                      )}
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <button
            onClick={() => (step === 0 ? handleClose() : setStep(step - 1))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {step === 0 ? "Cancel" : "Back"}
          </button>

          {step === 0 && (
            <button
              onClick={handleSplitStory}
              disabled={!title.trim() || !story.trim() || isPlanning}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs disabled:opacity-40 cursor-pointer"
            >
              {isPlanning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Splitting into {numSlides} scenes...
                </>
              ) : (
                <>
                  Split into {numSlides} Scenes <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs cursor-pointer"
            >
              Next: Characters <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          {step === 2 && (
            <button
              onClick={handleLaunch}
              disabled={characters.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs disabled:opacity-40 cursor-pointer"
            >
              Create Storyboard <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
