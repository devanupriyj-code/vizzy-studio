import { StyleBible, CharacterProfile } from "@/types";
import { composeLayeredSceneDataUri } from "./layer-compositor";

export function buildImageUrl(
  prompt: string,
  options?: {
    seed?: number;
    width?: number;
    height?: number;
    aspectRatio?: string;
    model?: "flux" | "turbo";
    token?: string;
  }
): string {
  const seed = options?.seed ?? Math.floor(Math.random() * 800000);
  const model = options?.model ?? "turbo";

  let width = options?.width || 1024;
  let height = options?.height || 576;

  if (options?.aspectRatio === "3:4") {
    width = 768;
    height = 1024;
  } else if (options?.aspectRatio === "1:1") {
    width = 768;
    height = 768;
  } else if (options?.aspectRatio === "21:9") {
    width = 1280;
    height = 544;
  }

  const cleanPrompt = prompt.replace(/[^\w\s,.-]/g, " ").replace(/\s+/g, " ").trim();
  const params = new URLSearchParams({
    prompt: cleanPrompt,
    width: String(width),
    height: String(height),
    seed: String(seed),
    model
  });

  const token =
    options?.token ||
    (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN : undefined) ||
    (typeof window !== "undefined" ? localStorage.getItem("vizzy_image_token") : null);

  if (token) {
    params.set("token", token);
  }

  return `/api/image?${params.toString()}`;
}

export function getSafetyMirrorImage(genre: string, index: number = 0): string {
  return composeLayeredSceneDataUri(
    `Scene ${index + 1}`,
    {
      artStyle: genre || "Gritty Graphic Novel",
      visualTone: "Dramatic shadows",
      lightingStyle: "High contrast",
      colorPalette: ["#090d16", "#1e293b", "#334155", "#f59e0b"],
      aspectRatio: "16:9"
    },
    [],
    undefined,
    index
  ).imageUrl;
}

export function synthesizeScenePrompt(
  beatDescription: string,
  styleBible: StyleBible,
  characters: CharacterProfile[],
  editDirective?: string
): string {
  const haystack = `${beatDescription} ${editDirective || ""}`.toLowerCase();
  const activeCharDetails = characters
    .filter((c) => c.isLocked)
    .filter((c) =>
      c.name
        .toLowerCase()
        .split(/\s+/)
        .filter((part) => part.length > 2)
        .some((part) => haystack.includes(part))
    )
    .map(
      (c) =>
        `${c.name} (${c.identity.age}, ${c.identity.facialFeatures}, ${c.identity.hairAndEyes}, wearing ${c.currentAttire})`
    )
    .join(", ");

  const parts = [
    editDirective ? `${editDirective}: ${beatDescription}` : beatDescription,
    activeCharDetails ? `Characters in scene: ${activeCharDetails}` : "",
    `Art style: ${styleBible.artStyle}`,
    `Lighting & mood: ${styleBible.lightingStyle}, ${styleBible.visualTone}`,
    "cinematic graphic novel illustration, detailed composition, no text"
  ].filter(Boolean);

  return parts.join(". ");
}

/**
 * Default Instant Hybrid Studio Generator:
 * Assembles the scene immediately (0ms) from the 108-Background Catalog + Modular Character Rigs + Weather/VFX layers.
 */
export function generateSingleSceneImage(
  beatDescription: string,
  styleBible: StyleBible,
  characters: CharacterProfile[],
  editDirective?: string,
  sequenceIndex: number = 0,
  variationSeed: number = 0
) {
  return composeLayeredSceneDataUri(
    beatDescription,
    styleBible,
    characters,
    editDirective,
    sequenceIndex,
    variationSeed
  );
}

/**
 * Optional AI Diffusion Render for when the user clicks "✨ AI Render" or types "AI render" in chat.
 */
export function generateAiRasterSceneImage(
  beatDescription: string,
  styleBible: StyleBible,
  characters: CharacterProfile[],
  editDirective?: string
) {
  const promptUsed = synthesizeScenePrompt(
    beatDescription,
    styleBible,
    characters,
    editDirective
  );
  const seed = Math.floor(Math.random() * 900000) + 777;
  const imageUrl = buildImageUrl(promptUsed, {
    seed,
    aspectRatio: styleBible.aspectRatio,
    model: "turbo"
  });
  return { imageUrl, promptUsed };
}
