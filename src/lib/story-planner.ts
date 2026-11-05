import { Project, StoryBeat, CharacterProfile, CaptionOverlay, StyleBible, CharacterCustomColors } from "@/types";
import { StylePreset } from "./style-presets";
import { composeLayeredSceneDataUri, renderCharacterPortraitDataUri } from "./layer-compositor";

export interface PlannedScene {
  title: string;
  description: string;
  narration: string;
  dialogue: { speaker: string; text: string }[];
}

export interface PlannedCharacter {
  name: string;
  role: string;
  age: string;
  facialFeatures: string;
  hairAndEyes: string;
  attire: string;
  portraitUrl?: string;
  customSvg?: string;
  customColors?: CharacterCustomColors;
}

export interface PlannedStory {
  scenes: PlannedScene[];
  characters: PlannedCharacter[];
  source: "gemini" | "local";
}

const STOP_WORDS = new Set([
  "The", "A", "An", "He", "She", "They", "It", "In", "On", "At", "When", "Then", "But", "And",
  "As", "After", "Before", "Suddenly", "His", "Her", "We", "I", "This", "That", "There", "Their",
  "Our", "You", "Its", "With", "From", "Into", "Of", "To", "For", "By", "One", "Once", "Meanwhile",
  "Finally", "Later", "Now", "Soon", "While", "If", "So", "Day", "Night", "Morning", "Chapter",
  "January", "February", "March", "April", "May", "June", "July", "August", "September",
  "October", "November", "December", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
  "Saturday", "Sunday"
]);

function shortTitle(text: string, idx: number): string {
  const words = text.replace(/[^\w\s'-]/g, "").split(/\s+/).filter(Boolean).slice(0, 5);
  return words.length ? words.join(" ") : `Scene ${idx + 1}`;
}

/** Offline fallback: split story text evenly into N scenes and guess character names. */
export function localPlanStory(title: string, story: string, numScenes: number): PlannedStory {
  const clean = story.replace(/\s+/g, " ").trim();
  const sentences = (clean.match(/[^.!?]+[.!?]*/g) || []).map((s) => s.trim()).filter(Boolean);
  if (sentences.length === 0) sentences.push(title || "An untold story begins.");

  const scenes: PlannedScene[] = [];
  for (let i = 0; i < numScenes; i++) {
    const start = Math.floor((i * sentences.length) / numScenes);
    const end = Math.floor(((i + 1) * sentences.length) / numScenes);
    let chunk = sentences.slice(start, Math.max(end, start + 1)).join(" ");
    if (!chunk) chunk = `${sentences[sentences.length - 1]} (moment ${i + 1})`;
    scenes.push({
      title: shortTitle(chunk, i),
      description: chunk,
      narration: chunk.length > 140 ? chunk.slice(0, 137) + "..." : chunk,
      dialogue: []
    });
  }

  // Guess character names: capitalized words that aren't stop-words
  const counts: Record<string, number> = {};
  (clean.match(/\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)?\b/g) || []).forEach((w) => {
    const first = w.split(" ")[0];
    if (STOP_WORDS.has(first)) return;
    counts[w] = (counts[w] || 0) + 1;
  });
  const names = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([n]) => n);

  const characters: PlannedCharacter[] = (names.length ? names : ["The Protagonist"]).map((name, i) => ({
    name,
    role: i === 0 ? "Main Lead" : "Supporting Character",
    age: "30s",
    facialFeatures: "Distinctive, expressive face with a determined look",
    hairAndEyes: "Dark hair, intense eyes",
    attire: "Outfit fitting the story's world and era"
  }));

  return { scenes, characters, source: "local" };
}

/** Convert the wizard output into a full Project. */
export function buildProjectFromPlan(
  title: string,
  story: string,
  preset: StylePreset,
  scenes: PlannedScene[],
  characters: PlannedCharacter[]
): Project {
  const now = Date.now();

  const styleBible: StyleBible = {
    artStyle: preset.name,
    visualTone: preset.visualTone,
    lightingStyle: preset.lighting,
    colorPalette: preset.colors,
    aspectRatio: "16:9"
  };

  const chars: CharacterProfile[] = characters.map((c, i) => {
    const baseChar: CharacterProfile = {
      id: `char-${now}-${i}`,
      name: c.name,
      role: c.role,
      isLocked: true,
      currentAttire: c.attire,
      identity: {
        age: c.age,
        facialFeatures: c.facialFeatures,
        hairAndEyes: c.hairAndEyes,
        bodyBuild: "Proportional build",
        anchorPortraitUrl: c.portraitUrl,
        customSvg: c.customSvg,
        customColors: c.customColors
      }
    };
    if (!baseChar.identity.anchorPortraitUrl) {
      baseChar.identity.anchorPortraitUrl = renderCharacterPortraitDataUri(baseChar, styleBible.artStyle);
    }
    return baseChar;
  });

  const beats: StoryBeat[] = scenes.map((s, i) => {
    const captions: CaptionOverlay[] = [];
    if (s.narration) {
      captions.push({ id: `cap-${now}-${i}-n`, type: "narration", text: s.narration, xPercent: 30, yPercent: 10 });
    }
    s.dialogue.slice(0, 2).forEach((d, j) => {
      captions.push({
        id: `cap-${now}-${i}-d${j}`,
        type: "speech",
        speaker: d.speaker,
        text: d.text,
        xPercent: j === 0 ? 30 : 68,
        yPercent: j === 0 ? 68 : 45
      });
    });
    const composed = composeLayeredSceneDataUri(s.description, styleBible, chars, undefined, i);
    return {
      id: `beat-${now}-${i}`,
      sequenceIndex: i + 1,
      title: s.title,
      userPromptDescription: s.description,
      synthesizedPrompt: composed.promptUsed,
      currentImageUrl: composed.imageUrl,
      versionHistory: [
        {
          id: `v-${now}-${i}-1`,
          imageUrl: composed.imageUrl,
          promptUsed: composed.promptUsed,
          createdAt: "Initial"
        }
      ],
      captions,
      subtitleText: s.narration,
      durationSeconds: 4,
      isLocked: false
    };
  });

  return {
    id: `proj-${now}`,
    title,
    synopsis: story,
    activeBeatIndex: 0,
    displayMode: "comic",
    styleBible,
    characters: chars,
    beats
  };
}
