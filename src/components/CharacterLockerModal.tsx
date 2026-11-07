"use client";

import React, { useState } from "react";
import { CharacterProfile, StyleBible } from "@/types";
import { X, Lock, Unlock, Plus, Sparkles, User, Palette, Check, RefreshCw, ShieldCheck, Layers, Search } from "lucide-react";
import {
  renderCharacterPortraitDataUri,
  composeLayeredSceneDataUri,
  CHARACTER_STORAGE_PRESETS,
  registerCustomPresetInStorage,
  BACKGROUND_CATALOG,
  CATEGORIES,
  BgCategory
} from "@/lib/layer-compositor";
import { STYLE_PRESETS } from "@/lib/style-presets";

interface CharacterLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: CharacterProfile[];
  styleBible: StyleBible;
  onUpdateCharacters: (chars: CharacterProfile[]) => void;
  onUpdateStyleBible: (bible: StyleBible) => void;
  onApplyBackgroundId?: (bgId: string, bgName: string) => void;
}

export const CharacterLockerModal: React.FC<CharacterLockerModalProps> = ({
  isOpen,
  onClose,
  characters,
  styleBible,
  onUpdateCharacters,
  onUpdateStyleBible,
  onApplyBackgroundId
}) => {
  const [activeTab, setActiveTab] = useState<"characters" | "backgrounds" | "style">("characters");
  const [selectedCharId, setSelectedCharId] = useState<string>(characters[0]?.id || "");
  const [selectedBgCat, setSelectedBgCat] = useState<BgCategory | "all">("all");
  const [bgSearch, setBgSearch] = useState("");
  const [bgPage, setBgPage] = useState(0);
  
  // Character creation / editing fields
  const [charPrompt, setCharPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiCharLoading, setIsAiCharLoading] = useState(false);
  const [portraitCandidates, setPortraitCandidates] = useState<{ id: string; url: string; hairAndEyes?: string; attire?: string; facialFeatures?: string }[]>([]);
  const [variationOffset, setVariationOffset] = useState(0);

  if (!isOpen) return null;

  const activeChar = characters.find((c) => c.id === selectedCharId) || characters[0];

  const handleAiCharacterAction = async (mode: "create" | "modify") => {
    if (!charPrompt.trim() || isAiCharLoading) return;
    setIsAiCharLoading(true);
    try {
      const res = await fetch("/api/character-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: charPrompt.trim(),
          mode,
          artStyle: styleBible.artStyle,
          existingCharacter:
            mode === "modify" && activeChar
              ? {
                  name: activeChar.name,
                  role: activeChar.role,
                  age: activeChar.identity.age,
                  hairAndEyes: activeChar.identity.hairAndEyes,
                  facialFeatures: activeChar.identity.facialFeatures,
                  currentAttire: activeChar.currentAttire
                }
              : undefined
        })
      });
      if (!res.ok) return;
      const data = await res.json();
      const c = data.character;
      if (!c) return;

      registerCustomPresetInStorage({
        name: `${c.name || activeChar?.name || "Hero"} — ${c.role || activeChar?.role || "Operative"}`,
        role: c.role || activeChar?.role || "Operative",
        archetype: c.role || activeChar?.role || "Operative",
        age: c.age || activeChar?.identity.age || "28",
        hairAndEyes: c.hairAndEyes || activeChar?.identity.hairAndEyes || "",
        facialFeatures: c.facialFeatures || activeChar?.identity.facialFeatures || "",
        attire: c.currentAttire || activeChar?.currentAttire || "",
        customSvg: c.customSvg
      });

      if (mode === "create") {
        const newChar: CharacterProfile = {
          id: `char-${Date.now()}`,
          name: c.name || "New Character",
          role: c.role || "Story Operative",
          isLocked: true,
          currentAttire: c.currentAttire || "dark trench coat",
          identity: {
            age: c.age || "28",
            facialFeatures: c.facialFeatures || "sharp determined features",
            hairAndEyes: c.hairAndEyes || "spiky black hair, cyan eyes",
            bodyBuild: "Athletic frame",
            anchorPortraitUrl: "",
            customSvg: c.customSvg,
            customColors: c.customColors
          }
        };
        newChar.identity.anchorPortraitUrl = renderCharacterPortraitDataUri(newChar, styleBible.artStyle);
        onUpdateCharacters([...characters, newChar]);
        setSelectedCharId(newChar.id);
      } else if (activeChar) {
        const updated: CharacterProfile = {
          ...activeChar,
          name: c.name || activeChar.name,
          role: c.role || activeChar.role,
          currentAttire: c.currentAttire || activeChar.currentAttire,
          identity: {
            ...activeChar.identity,
            age: c.age || activeChar.identity.age,
            facialFeatures: c.facialFeatures || activeChar.identity.facialFeatures,
            hairAndEyes: c.hairAndEyes || activeChar.identity.hairAndEyes,
            customSvg: c.customSvg ?? activeChar.identity.customSvg,
            customColors: c.customColors ?? activeChar.identity.customColors
          }
        };
        updated.identity.anchorPortraitUrl = renderCharacterPortraitDataUri(updated, styleBible.artStyle);
        onUpdateCharacters(characters.map((ch) => (ch.id === activeChar.id ? updated : ch)));
      }

      if (Array.isArray(data.variants) && data.variants.length > 0) {
        const target = mode === "create" ? c : activeChar;
        const cands = data.variants.map((v: { hairAndEyes?: string; attire?: string; facialFeatures?: string }, idx: number) => {
          const tempChar: CharacterProfile = {
            id: `temp-${idx}`,
            name: target?.name || "Hero",
            role: target?.role || "Lead",
            isLocked: true,
            currentAttire: v.attire || c.currentAttire,
            identity: {
              age: c.age || "28",
              facialFeatures: v.facialFeatures || c.facialFeatures,
              hairAndEyes: v.hairAndEyes || c.hairAndEyes,
              bodyBuild: "Athletic"
            }
          };
          return {
            id: `ai-cand-${Date.now()}-${idx}`,
            url: renderCharacterPortraitDataUri(tempChar, styleBible.artStyle),
            hairAndEyes: tempChar.identity.hairAndEyes,
            attire: tempChar.currentAttire,
            facialFeatures: tempChar.identity.facialFeatures
          };
        });
        setPortraitCandidates(cands);
      }
      setCharPrompt("");
    } finally {
      setIsAiCharLoading(false);
    }
  };

  const handleSelectCharacter = (char: CharacterProfile) => {
    setSelectedCharId(char.id);
    setPortraitCandidates([]);
    setCharPrompt(`${char.name}: ${char.identity.facialFeatures}, ${char.identity.hairAndEyes}`);
  };

  const handleCreateNewBlankCharacter = () => {
    const newChar: CharacterProfile = {
      id: `char-${Date.now()}`,
      name: "New Recruit",
      role: "Squad Member",
      isLocked: false,
      currentAttire: "Standard issue uniform",
      identity: {
        age: "25",
        facialFeatures: "Sharp features, determined look",
        hairAndEyes: "Dark hair, dark eyes",
        bodyBuild: "Athletic frame",
        anchorPortraitUrl: ""
      }
    };

    onUpdateCharacters([...characters, newChar]);
    setSelectedCharId(newChar.id);
    setPortraitCandidates([]);
    setCharPrompt("New Recruit: 25 years old, athletic build, sharp features");
  };

  const toggleLock = (charId: string) => {
    onUpdateCharacters(
      characters.map((c) =>
        c.id === charId ? { ...c, isLocked: !c.isLocked } : c
      )
    );
  };

  // Cycle through the 160+ Stored Character Archetype Presets (8 per click)
  const handleGeneratePortraits = () => {
    if (!activeChar) return;
    setIsGenerating(true);

    const sliceStart = (variationOffset * 8) % CHARACTER_STORAGE_PRESETS.length;
    const batch = CHARACTER_STORAGE_PRESETS.slice(sliceStart, sliceStart + 8);

    const cands = batch.map((preset, idx) => {
      const tempChar: CharacterProfile = {
        ...activeChar,
        currentAttire: preset.attire,
        identity: {
          ...activeChar.identity,
          hairAndEyes: preset.hairAndEyes,
          facialFeatures: preset.facialFeatures
        }
      };
      return {
        id: `cand-${Date.now()}-${idx}`,
        url: renderCharacterPortraitDataUri(tempChar, styleBible.artStyle),
        hairAndEyes: preset.hairAndEyes,
        attire: preset.attire,
        facialFeatures: preset.facialFeatures
      };
    });

    setVariationOffset((prev) => prev + 1);
    setPortraitCandidates(cands);
    setIsGenerating(false);
  };

  // Set selected portrait candidate + its stored rig traits as the master anchor portrait
  const handlePickPortrait = (cand: { url: string; hairAndEyes?: string; attire?: string; facialFeatures?: string }) => {
    if (!activeChar) return;
    onUpdateCharacters(
      characters.map((c) =>
        c.id === activeChar.id
          ? {
              ...c,
              currentAttire: cand.attire || c.currentAttire,
              identity: {
                ...c.identity,
                hairAndEyes: cand.hairAndEyes || c.identity.hairAndEyes,
                facialFeatures: cand.facialFeatures || c.identity.facialFeatures,
                anchorPortraitUrl: cand.url
              },
              isLocked: true
            }
          : c
      )
    );
  };

  // Update specific character fields
  const handleUpdateActiveField = (field: string, value: string) => {
    if (!activeChar) return;
    onUpdateCharacters(
      characters.map((c) => {
        if (c.id !== activeChar.id) return c;
        if (field === "name") return { ...c, name: value };
        if (field === "role") return { ...c, role: value };
        if (field === "currentAttire") {
          return { ...c, currentAttire: value, identity: { ...c.identity, anchorPortraitUrl: "", customColors: undefined } };
        }
        if (field === "facialFeatures") {
          return { ...c, identity: { ...c.identity, facialFeatures: value, anchorPortraitUrl: "", customColors: undefined } };
        }
        if (field === "hairAndEyes") {
          return { ...c, identity: { ...c.identity, hairAndEyes: value, anchorPortraitUrl: "", customColors: undefined } };
        }
        if (field === "age") {
          return { ...c, identity: { ...c.identity, age: value } };
        }
        return c;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">
              Cast &amp; Style Settings
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Edit characters, browse backgrounds, or adjust the visual palette.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-800 bg-zinc-950 px-6 gap-6">
          <button
            onClick={() => setActiveTab("characters")}
            className={`py-2.5 text-xs font-medium flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "characters"
                ? "border-zinc-100 text-zinc-100"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Cast ({CHARACTER_STORAGE_PRESETS.length} presets)</span>
          </button>
          <button
            onClick={() => setActiveTab("backgrounds")}
            className={`py-2.5 text-xs font-medium flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "backgrounds"
                ? "border-zinc-100 text-zinc-100"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Backgrounds ({BACKGROUND_CATALOG.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("style")}
            className={`py-2.5 text-xs font-medium flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "style"
                ? "border-zinc-100 text-zinc-100"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Style Palette</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden p-6 flex flex-col">
          {activeTab === "characters" ? (
            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
              {/* Left Column: Character List (35% width) */}
              <div className="w-full lg:w-80 flex flex-col border-b lg:border-b-0 lg:border-r border-zinc-800/80 pb-4 lg:pb-0 lg:pr-6 overflow-y-auto space-y-3">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Story Cast
                  </span>
                  <button
                    onClick={handleCreateNewBlankCharacter}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Cast</span>
                  </button>
                </div>

                {characters.map((char) => {
                  const isSelected = char.id === activeChar?.id;
                  return (
                    <div
                      key={char.id}
                      onClick={() => handleSelectCharacter(char)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? "bg-zinc-800 border-amber-500 shadow-md ring-1 ring-amber-500/40"
                          : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      {/* Thumbnail Portrait */}
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-zinc-700 flex-shrink-0 bg-zinc-900 flex items-center justify-center">
                        {char.identity.anchorPortraitUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={char.identity.anchorPortraitUrl}
                            alt={char.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-zinc-500" />
                        )}
                        {char.isLocked && (
                          <div className="absolute top-0.5 right-0.5 p-0.5 rounded bg-emerald-500 text-black">
                            <Lock className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-zinc-100 truncate">
                            {char.name}
                          </h4>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLock(char.id);
                            }}
                            className={`p-1 rounded cursor-pointer ${
                              char.isLocked ? "text-emerald-400" : "text-zinc-500"
                            }`}
                          >
                            {char.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-400/90 truncate font-medium">
                          {char.role}
                        </p>
                        <p className="text-[10px] text-zinc-500 truncate">
                          {char.identity.facialFeatures}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Active Character Forge & Portrait Studio (65% width) */}
              {activeChar && (
                <div className="flex-1 flex flex-col overflow-y-auto space-y-4">
                  {/* Top Bar with Name & Lock */}
                  <div className="flex items-center justify-between bg-zinc-950/50 p-3 rounded-2xl border border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-emerald-500/50 flex-shrink-0 shadow-lg bg-zinc-900 flex items-center justify-center">
                        {activeChar.identity.anchorPortraitUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={activeChar.identity.anchorPortraitUrl}
                            alt={activeChar.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-7 h-7 text-zinc-500" />
                        )}
                        {activeChar.isLocked && (
                          <div className="absolute bottom-1 right-1 p-0.5 rounded bg-emerald-500 text-black">
                            <ShieldCheck className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">
                            {activeChar.name}
                          </h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                            {activeChar.isLocked ? "Identity Locked" : "Unlocked"}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">
                          {activeChar.role} • Age {activeChar.identity.age}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleLock(activeChar.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeChar.isLocked
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      }`}
                    >
                      {activeChar.isLocked ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Locked into Prompts</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Click to Lock</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Character Creator & Modifier Bar */}
                  <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-200">
                        Character Designer
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        Add a new character or update the selected one
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={charPrompt}
                        onChange={(e) => setCharPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAiCharacterAction("create")}
                        placeholder="e.g. 'Commander Vex with red visor, silver hair, and katana'..."
                        disabled={isAiCharLoading}
                        className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                      />
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAiCharacterAction("create")}
                          disabled={!charPrompt.trim() || isAiCharLoading}
                          className="px-3 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs whitespace-nowrap cursor-pointer disabled:opacity-40 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isAiCharLoading ? "Working..." : "Add Character"}</span>
                        </button>
                        <button
                          onClick={() => handleAiCharacterAction("modify")}
                          disabled={!charPrompt.trim() || isAiCharLoading}
                          className="px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-medium text-xs whitespace-nowrap cursor-pointer disabled:opacity-40"
                        >
                          Update {activeChar.name.split(" ")[0]}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Character Attributes Editor */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-900/40 p-4 rounded-lg border border-zinc-800">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={activeChar.name}
                        onChange={(e) => handleUpdateActiveField("name", e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        value={activeChar.role}
                        onChange={(e) => handleUpdateActiveField("role", e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        Facial features (face, scars, jaw, eyes)
                      </label>
                      <input
                        type="text"
                        value={activeChar.identity.facialFeatures}
                        onChange={(e) => handleUpdateActiveField("facialFeatures", e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        Attire / wardrobe
                      </label>
                      <input
                        type="text"
                        value={activeChar.currentAttire}
                        onChange={(e) => handleUpdateActiveField("currentAttire", e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                      />
                    </div>
                  </div>

                  {/* Character Portrait Variations */}
                  <div className="bg-zinc-900/40 p-4 rounded-lg border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-medium text-zinc-200">
                        Portrait Presets
                      </h4>
                      <button
                        onClick={handleGeneratePortraits}
                        disabled={isGenerating}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                        <span>Browse Presets</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-zinc-400">
                      Cycle through {CHARACTER_STORAGE_PRESETS.length} character presets eight at a time. Click any card to apply its hair, eyes, and outfit to {activeChar.name}.
                    </p>

                    {/* Portrait Candidates Grid */}
                    {portraitCandidates.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        {portraitCandidates.map((cand, idx) => {
                          const isMaster = activeChar.identity.anchorPortraitUrl === cand.url;
                          return (
                            <div
                              key={cand.id}
                              onClick={() => handlePickPortrait(cand)}
                              className={`group relative rounded-xl overflow-hidden border cursor-pointer aspect-square transition-all ${
                                isMaster
                                  ? "border-emerald-400 ring-2 ring-emerald-400/50"
                                  : "border-zinc-800 hover:border-amber-400/80"
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={cand.url}
                                alt={`Portrait ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[9px] font-bold text-white">
                                Take {idx + 1}
                              </div>
                              {isMaster ? (
                                <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                                  <span className="px-2 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-extrabold flex items-center gap-1 shadow-lg">
                                    <Check className="w-3 h-3 stroke-[3]" /> Master Face
                                  </span>
                                </div>
                              ) : (
                                <div className="absolute bottom-1 inset-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="block text-center py-1 rounded bg-black/80 text-[10px] font-bold text-amber-400 backdrop-blur-sm">
                                    Set as Face
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === "backgrounds" ? (
            /* Background Vault Tab (1,080 Stored Backgrounds) */
            <div className="flex-1 flex flex-col overflow-hidden space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    onClick={() => {
                      setSelectedBgCat("all");
                      setBgPage(0);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase cursor-pointer ${
                      selectedBgCat === "all"
                        ? "bg-amber-500 text-black"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    All ({BACKGROUND_CATALOG.length})
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedBgCat(cat);
                        setBgPage(0);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize cursor-pointer ${
                        selectedBgCat === cat
                          ? "bg-amber-500 text-black"
                          : "bg-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bgSearch}
                    onChange={(e) => {
                      setBgSearch(e.target.value);
                      setBgPage(0);
                    }}
                    placeholder="Search 1,080 backgrounds..."
                    className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {(() => {
                const filtered = BACKGROUND_CATALOG.filter((b) => {
                  if (selectedBgCat !== "all" && b.category !== selectedBgCat) return false;
                  if (bgSearch.trim()) {
                    const q = bgSearch.toLowerCase();
                    return b.name.toLowerCase().includes(q) || b.keywords.some((k) => k.includes(q));
                  }
                  return true;
                });
                const pageSize = 12;
                const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
                const pageItems = filtered.slice(bgPage * pageSize, (bgPage + 1) * pageSize);

                return (
                  <>
                    <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pr-1">
                      {pageItems.map((bg) => {
                        const previewUri = composeLayeredSceneDataUri(
                          bg.id,
                          styleBible,
                          [],
                          bg.id,
                          0,
                          bg.editionIndex
                        ).imageUrl;
                        return (
                          <div
                            key={bg.id}
                            onClick={() => {
                              if (onApplyBackgroundId) {
                                onApplyBackgroundId(bg.id, bg.name);
                                onClose();
                              }
                            }}
                            className="group relative rounded-xl overflow-hidden border border-zinc-800 hover:border-amber-400 bg-zinc-950 cursor-pointer flex flex-col transition-all"
                          >
                            <div className="aspect-video w-full overflow-hidden relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={previewUri}
                                alt={bg.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="px-2.5 py-1 rounded-full bg-amber-500 text-black text-[10px] font-extrabold">
                                  Apply to Active Scene
                                </span>
                              </div>
                            </div>
                            <div className="p-2">
                              <p className="text-[11px] font-bold text-zinc-200 truncate">{bg.name}</p>
                              <p className="text-[10px] text-zinc-500 uppercase font-mono">{bg.category} • {bg.variant}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs text-zinc-400">
                      <span>
                        Showing {pageItems.length} of <strong>{filtered.length}</strong> matching backgrounds
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={bgPage === 0}
                          onClick={() => setBgPage((p) => Math.max(0, p - 1))}
                          className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 cursor-pointer"
                        >
                          Prev
                        </button>
                        <span className="font-mono">
                          Page {bgPage + 1} / {totalPages}
                        </span>
                        <button
                          disabled={bgPage + 1 >= totalPages}
                          onClick={() => setBgPage((p) => Math.min(totalPages - 1, p + 1))}
                          className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            /* Style Bible Tab */
            <div className="space-y-4 max-w-2xl mx-auto py-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  1-Click Visual Style Presets (Instantly Re-Themes Storyboard & Characters)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-4">
                  {STYLE_PRESETS.map((preset) => {
                    const isSelected = styleBible.artStyle === preset.name;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() =>
                          onUpdateStyleBible({
                            ...styleBible,
                            artStyle: preset.name,
                            visualTone: preset.visualTone,
                            lightingStyle: preset.lighting,
                            colorPalette: preset.colors
                          })
                        }
                        className={`text-left p-2.5 rounded-lg border transition-all ${
                          isSelected
                            ? "bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/50 shadow-md"
                            : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-zinc-100 truncate">
                            {preset.name.split(" ")[0]} {preset.name.split(" ")[1]}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-zinc-400 line-clamp-2 mb-2 leading-relaxed">
                          {preset.visualTone}
                        </p>
                        <div className="flex items-center gap-1">
                          {preset.colors.slice(0, 5).map((c, ci) => (
                            <span
                              key={ci}
                              className="w-3.5 h-3.5 rounded-full border border-black/30"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Art Style Definition
                </label>
                <input
                  type="text"
                  value={styleBible.artStyle}
                  onChange={(e) =>
                    onUpdateStyleBible({ ...styleBible, artStyle: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Mood & Atmospheric Tone
                </label>
                <textarea
                  rows={2}
                  value={styleBible.visualTone}
                  onChange={(e) =>
                    onUpdateStyleBible({ ...styleBible, visualTone: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Lighting Style
                </label>
                <input
                  type="text"
                  value={styleBible.lightingStyle}
                  onChange={(e) =>
                    onUpdateStyleBible({ ...styleBible, lightingStyle: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Color Palette Swatches
                </label>
                <div className="flex items-center gap-3">
                  {styleBible.colorPalette.map((color, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div
                        className="w-10 h-10 rounded-lg border border-zinc-700 shadow-inner"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            {characters.filter((c) => c.isLocked).length} character(s) locked. All panels maintain their facial likeness.
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all cursor-pointer"
          >
            Done & Save Cast
          </button>
        </div>
      </div>
    </div>
  );
};
