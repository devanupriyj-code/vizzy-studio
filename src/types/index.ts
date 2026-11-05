export interface CharacterCustomColors {
  hair?: string;
  hairHighlight?: string;
  eye?: string;
  skin?: string;
  outfitPrimary?: string;
  outfitSecondary?: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  identity: {
    age: string;
    facialFeatures: string;
    hairAndEyes: string;
    bodyBuild: string;
    anchorPortraitUrl?: string;
    customSvg?: string;
    customColors?: CharacterCustomColors;
  };
  currentAttire: string;
  isLocked: boolean;
}

export interface StyleBible {
  artStyle: string;
  colorPalette: string[];
  visualTone: string;
  aspectRatio: "16:9" | "21:9" | "3:4" | "1:1";
  lightingStyle: string;
}

export interface CaptionOverlay {
  id: string;
  type: "speech" | "thought" | "narration" | "sfx";
  speaker?: string;
  text: string;
  xPercent: number;
  yPercent: number;
}

export interface SceneVersion {
  id: string;
  imageUrl: string;
  promptUsed: string;
  editRequest?: string;
  createdAt: string;
}

export interface StoryBeat {
  id: string;
  sequenceIndex: number;
  title: string;
  userPromptDescription: string;
  synthesizedPrompt: string;
  currentImageUrl: string;
  versionHistory: SceneVersion[];
  captions: CaptionOverlay[];
  subtitleText?: string;
  durationSeconds: number;
  isLocked: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "vizzy";
  text: string;
  timestamp: string;
  beatId?: string;
  sceneImagePreview?: string;
  suggestedActions?: string[];
}

export interface Project {
  id: string;
  title: string;
  synopsis: string;
  styleBible: StyleBible;
  characters: CharacterProfile[];
  beats: StoryBeat[];
  activeBeatIndex: number;
  displayMode: "comic" | "cinematic";
}
