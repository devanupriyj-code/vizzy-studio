import { Project, StyleBible, CharacterProfile } from "@/types";
import { composeLayeredSceneDataUri, renderCharacterPortraitDataUri } from "./layer-compositor";

const defaultStyle: StyleBible = {
  artStyle: "Gritty 1990s Graphic Novel, Ink & Wash",
  visualTone: "Desaturated olive-drab, ocean mist, heavy contrast shadows, rain and sea-spray droplets",
  lightingStyle: "Cold overcast dawn light, glowing orange artillery explosions in distance",
  colorPalette: ["#2b3a42", "#3f5e5a", "#8b9489", "#c85a17", "#1e2226"],
  aspectRatio: "16:9"
};

const defaultCharacters: CharacterProfile[] = [
  {
    id: "char-miller",
    name: "Captain Miller",
    role: "Company Commander, 2nd Rangers",
    isLocked: true,
    currentAttire: "M1941 olive-drab field jacket, wet wool trousers, M1 steel helmet with white captain bar",
    identity: {
      age: "Late 30s",
      facialFeatures: "Sharp weathered jawline, 3-day dark stubble, small diagonal scar across right cheekbone, determined weary eyes",
      hairAndEyes: "Short cropped dark hair, steely grey-hazel eyes, helmet",
      bodyBuild: "Broad-shouldered, 6ft, muscular military frame"
    }
  },
  {
    id: "char-jackson",
    name: "Private Jackson",
    role: "Squad Marksman / Scout",
    isLocked: true,
    currentAttire: "Field uniform with canvas rifle sling, scoped Springfield 1903",
    identity: {
      age: "Early 20s",
      facialFeatures: "Lean angular face, calm focused gaze, fair skin",
      hairAndEyes: "Blonde buzzed hair, blue eyes",
      bodyBuild: "Slender, agile build"
    }
  }
];

defaultCharacters.forEach((c) => {
  c.identity.anchorPortraitUrl = renderCharacterPortraitDataUri(c, defaultStyle.artStyle);
});

const b1 = composeLayeredSceneDataUri(
  "Inside the LCVP Higgins boat craft, sea foam spray splashing over the metal ramp, Captain Miller grips the handrail looking ahead.",
  defaultStyle,
  defaultCharacters,
  undefined,
  0
);

const b2 = composeLayeredSceneDataUri(
  "The steel ramp drops into violent ocean surf on the beach, heavy smoke and water splashing, Captain Miller and Private Jackson lunging forward.",
  defaultStyle,
  defaultCharacters,
  undefined,
  1
);

const b3 = composeLayeredSceneDataUri(
  "Captain Miller and Private Jackson crouching behind a steel hedgehog obstacle on the beach, artillery explosion in distance, aiming rifle toward the bluffs.",
  defaultStyle,
  defaultCharacters,
  undefined,
  2
);

export const initialProject: Project = {
  id: "proj-dday-1944",
  title: "Operation Overlord: Red Beach",
  synopsis: "A gritty, cinematic graphic novel following Captain Miller's squad as their Higgins landing craft approaches the Normandy coastline at dawn.",
  activeBeatIndex: 0,
  displayMode: "comic",
  styleBible: defaultStyle,
  characters: defaultCharacters,
  beats: [
    {
      id: "beat-1",
      sequenceIndex: 1,
      title: "Approaching the Shore",
      userPromptDescription: "Inside the LCVP Higgins boat craft, sea foam spray splashing over the metal ramp, Captain Miller grips the handrail looking ahead.",
      synthesizedPrompt: b1.promptUsed,
      currentImageUrl: b1.imageUrl,
      versionHistory: [
        {
          id: "v-1",
          imageUrl: b1.imageUrl,
          promptUsed: b1.promptUsed,
          createdAt: "Initial"
        }
      ],
      captions: [
        {
          id: "cap-1",
          type: "narration",
          text: "JUNE 6, 1944. 06:30 HOURS. 400 YARDS FROM DOG GREEN SECTOR.",
          xPercent: 28,
          yPercent: 12
        },
        {
          id: "cap-2",
          type: "speech",
          speaker: "Captain Miller",
          text: "Keep your heads down until that ramp hits the sand!",
          xPercent: 35,
          yPercent: 68
        }
      ],
      subtitleText: "Miller checks his watch as cold Atlantic seawater washes across the steel deck.",
      durationSeconds: 4.0,
      isLocked: true
    },
    {
      id: "beat-2",
      sequenceIndex: 2,
      title: "The Ramp Drops",
      userPromptDescription: "The steel ramp drops into violent ocean surf on the beach, heavy smoke and water splashing, Captain Miller and Private Jackson lunging forward.",
      synthesizedPrompt: b2.promptUsed,
      currentImageUrl: b2.imageUrl,
      versionHistory: [
        {
          id: "v-2",
          imageUrl: b2.imageUrl,
          promptUsed: b2.promptUsed,
          createdAt: "Initial"
        }
      ],
      captions: [
        {
          id: "cap-2-1",
          type: "sfx",
          text: "CLAAAANG!",
          xPercent: 20,
          yPercent: 20
        },
        {
          id: "cap-2-2",
          type: "speech",
          speaker: "Captain Miller",
          text: "MOVE! MOVE! GET OFF THE BEACH!",
          xPercent: 42,
          yPercent: 70
        }
      ],
      subtitleText: "The ramp hits with a deafening crash. The icy channel water swallows them waist-deep.",
      durationSeconds: 3.5,
      isLocked: true
    },
    {
      id: "beat-3",
      sequenceIndex: 3,
      title: "Shelter Behind the Hedgehog",
      userPromptDescription: "Captain Miller and Private Jackson crouching behind a steel hedgehog obstacle on the beach, artillery explosion in distance, aiming rifle toward the bluffs.",
      synthesizedPrompt: b3.promptUsed,
      currentImageUrl: b3.imageUrl,
      versionHistory: [
        {
          id: "v-3",
          imageUrl: b3.imageUrl,
          promptUsed: b3.promptUsed,
          createdAt: "Initial"
        }
      ],
      captions: [
        {
          id: "cap-3-1",
          type: "speech",
          speaker: "Jackson",
          text: "Captain! Gun placement at two o'clock on the bluff!",
          xPercent: 26,
          yPercent: 24
        },
        {
          id: "cap-3-2",
          type: "speech",
          speaker: "Captain Miller",
          text: "Jackson, suppress that nest! Squad, advance on my mark!",
          xPercent: 60,
          yPercent: 68
        }
      ],
      subtitleText: "Huddled behind steel obstacles, Miller analyzes the cliffside machine gun emplacements.",
      durationSeconds: 4.5,
      isLocked: true
    }
  ]
};
