import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
  cleanJsonExtract,
  isRateLimitError,
  sleep,
  GEMINI_FALLBACK_MODELS
} from "@/lib/api-resilience";

export async function POST(req: Request) {
  let userInstruction = "";
  let currentSceneTitle = "Scene";
  let currentSceneDescription = "";
  let currentEditDirective = "";
  let characters: any[] = [];

  try {
    const body = await req.json().catch(() => ({}));
    userInstruction = String(body?.userInstruction || "").trim();
    currentSceneTitle = String(body?.currentSceneTitle || "Scene").trim();
    currentSceneDescription = String(body?.currentSceneDescription || "").trim();
    currentEditDirective = String(body?.currentEditDirective || "").trim();
    characters = Array.isArray(body?.characters) ? body.characters : [];
  } catch {
    // Keep safe defaults
  }

  // Edge case: empty instruction
  if (!userInstruction) {
    return NextResponse.json({
      updatedDirective: currentEditDirective || "",
      updatedDescription: currentSceneDescription,
      reply: "No edit directive was provided."
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes("your_gemini")) {
    return NextResponse.json({
      updatedDirective: [currentEditDirective, userInstruction].filter(Boolean).join("; "),
      updatedDescription: currentSceneDescription,
      reply: `Applied your edit to ${currentSceneTitle}: "${userInstruction}".`
    });
  }

  const prompt = `You are Vizzy, an AI Storyboard & Graphic Novel Director that controls a Layered Character + Background Compositor Engine.

Current Scene: "${currentSceneTitle}"
Base Scene Description: "${currentSceneDescription}"
Previous Layer Edits: "${currentEditDirective || "None"}"
Characters in Project: ${JSON.stringify(characters)}

User's New Instruction: "${userInstruction}"

Available Engine Capabilities:
- Background: plain / solid color background (e.g. plain light green, solid white, flat dark gray, plain cyan, plain pink, plain black, plain yellow, plain blue, plain purple, plain red), OR standard environments: cyberpunk, military, noir, fantasy, modern, space, wasteland, horror, historical (rooftop, alley, power_grid, street, interior, beach, bunker, vehicle, forest, bridge, courtyard, vault)
- Weather: none (clear weather, remove rain, stop storm), rain, heavy_rain, fog, smoke, snow, ash
- VFX Overlays: sparks, lasers (drones/red sights), explosion, hologram, speed_lines
- Camera Shots: wide, medium, closeup, low_angle
- Lighting Moods: default, darker, brighter, neon, crimson, warm, noir
- Character Poses: standing, action, crouching, pointing, aiming, running, crossed_arms, blade_ready, thumbs_up, thinking
- Character Expressions: determined, angry, shocked, calm, focused, happy, sad, wink, worried, smirking
- Character Rig Traits: hair color (green, emerald, brown, orange, black, silver, white, blonde, golden, red, crimson, blue, cyan, teal, purple, violet, pink), hair style (spiky, long, short, ponytail, twin tails, braided, bob, undercut, messy, buzz, hooded, helmet, visor helm, crown, cowboy hat), eye color (cyan, emerald, green, blue, amber, gold, violet, purple, red, brown, silver), attire (dark trench coat, olive military uniform, crimson cyber jacket, gold samurai kimono, blue stealth suit, purple royal cloak, white lab coat, brown leather armor, demon armor, angel robes), props (rifle, holodrive, blade, katana, pistol, energy orb, scythe, staff)

CRITICAL INSTRUCTIONS:
- If the user asks for a plain / solid / flat color background (e.g. "make the background plain light green", "solid white", "flat black"), "updatedDirective" MUST include the exact phrase (e.g. "plain light green background; no rain; brighter lighting") and "weather" should be "none".
- If the user asks to remove weather (e.g. "remove rain", "no rain"), ensure "updatedDirective" includes "no rain".

Return ONLY valid JSON matching this exact structure:
{
  "updatedDirective": "A concise combined directive string containing the exact keywords needed from the engine capabilities above to fulfill the user's request",
  "updatedDescription": "Updated scene description incorporating the user's requested changes",
  "characterUpdates": [
    {
      "id": "character id if the user asked to change an existing character's hair, eyes, scar, or attire",
      "hairAndEyes": "updated hair & eyes string",
      "facialFeatures": "updated facial features string",
      "currentAttire": "updated attire string",
      "customColors": {
        "hair": "optional #hex",
        "eye": "optional #hex",
        "skin": "optional #hex",
        "outfitPrimary": "optional #hex"
      },
      "customSvg": "optional raw SVG shapes (<path>, <polygon>, <circle>, <rect>, <ellipse>) in character local coordinates ((0,0)=face center, (0,-65)=top of head, (0,100)=chest, (85,10)=hand) for any unique unstored trait"
    }
  ],
  "newCharacters": [
    {
      "name": "Name of brand-new character",
      "role": "Character's role",
      "age": "Age (e.g. 30s)",
      "hairAndEyes": "Hair style, hair color, and eye color using the engine keywords",
      "facialFeatures": "Skin tone, scar/stubble, and any accessory (visor, eyepatch, glasses, mask, headband)",
      "currentAttire": "Outfit style, color, and weapon/prop",
      "customColors": {
        "hair": "#hex",
        "eye": "#hex",
        "skin": "#hex",
        "outfitPrimary": "#hex"
      },
      "customSvg": "optional raw SVG shapes"
    }
  ],
  "newBubble": {
    "speaker": "Speaker name (only if user asked for dialogue)",
    "text": "Dialogue line"
  },
  "reply": "Short 1-sentence confirmation of what you modified on the scene"
}`;

  const ai = new GoogleGenAI({ apiKey });

  for (const model of GEMINI_FALLBACK_MODELS) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 9000);

      const res = await Promise.race([
        ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: "application/json" }
        }),
        new Promise<never>((_, reject) => {
          controller.signal.addEventListener("abort", () => reject(new Error("Timeout")));
        })
      ]).finally(() => clearTimeout(timer));

      const parsed = cleanJsonExtract<any>(res.text);
      if (parsed && (parsed.updatedDirective || parsed.reply)) {
        return NextResponse.json(parsed);
      }
    } catch (err: any) {
      if (isRateLimitError(err)) {
        console.warn(`[scene-editor] 429 Rate Limit on ${model}, auto-failing over...`);
        await sleep(180);
      }
      // Continue to next model in fallback tier
    }
  }

  // Deterministic engine fallback: guarantees instant, non-crashing response even when 429
  const lower = userInstruction.toLowerCase();
  const directiveParts = [currentEditDirective].filter(Boolean);

  if (lower.includes("plain") || lower.includes("solid") || lower.includes("flat") || lower.includes("background")) {
    directiveParts.push(userInstruction);
  }
  if (lower.includes("no rain") || lower.includes("remove rain") || lower.includes("stop rain")) {
    directiveParts.push("no rain");
  }
  if (lower.includes("darker") || lower.includes("night")) {
    directiveParts.push("darker lighting");
  } else if (lower.includes("bright") || lower.includes("daylight")) {
    directiveParts.push("brighter lighting");
  }
  if (lower.includes("close") || lower.includes("closer")) {
    directiveParts.push("closeup shot");
  } else if (lower.includes("wide") || lower.includes("wider")) {
    directiveParts.push("wide shot");
  }
  if (!directiveParts.includes(userInstruction)) {
    directiveParts.push(userInstruction);
  }

  return NextResponse.json({
    updatedDirective: directiveParts.join("; "),
    updatedDescription: `${currentSceneDescription} (${userInstruction})`.trim(),
    reply: `Applied your edit to ${currentSceneTitle}: "${userInstruction}".`
  });
}
