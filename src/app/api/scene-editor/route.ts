import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const GEMINI_MODELS = [
  "gemini-3-flash-preview",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite-preview"
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userInstruction,
      currentSceneTitle,
      currentSceneDescription,
      currentEditDirective,
      characters
    } = body as {
      userInstruction: string;
      currentSceneTitle: string;
      currentSceneDescription: string;
      currentEditDirective?: string;
      characters: {
        id: string;
        name: string;
        hairAndEyes: string;
        facialFeatures: string;
        currentAttire: string;
      }[];
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.includes("your_gemini")) {
      return NextResponse.json({
        updatedDirective: [currentEditDirective, userInstruction].filter(Boolean).join("; "),
        reply: `Applied your edit to ${currentSceneTitle}: "${userInstruction}".`
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are Vizzy, an AI Storyboard & Graphic Novel Director that controls a Layered Character + Background Compositor Engine.

Current Scene: "${currentSceneTitle}"
Base Scene Description: "${currentSceneDescription}"
Previous Layer Edits: "${currentEditDirective || "None"}"
Characters in Project: ${JSON.stringify(characters)}

User's New Instruction: "${userInstruction}"

Available Engine Capabilities:
- Background Categories: cyberpunk, military, noir, fantasy, modern, space, wasteland, horror, historical
- Background Settings: rooftop, alley, power_grid (transformer/voltage), street, interior (lab/office/room), beach (ocean/shore/hedgehog), bunker (trench/bluff), vehicle (landing craft/boat/cockpit), forest, bridge, courtyard (castle/temple/arena), vault (underground/subway/crypt)
- Weather: none, rain, heavy_rain, fog, smoke, snow, ash
- VFX Overlays: sparks, lasers (drones/red sights), explosion, hologram, speed_lines
- Camera Shots: wide, medium, closeup, low_angle
- Lighting Moods: default, darker, brighter, neon, crimson, warm, noir
- Character Poses: standing, action, crouching, pointing, aiming, running
- Character Expressions: determined, angry, shocked, calm, focused
- Character Rig Traits: hair color (green, emerald, brown, orange, black, silver, white, blonde, golden, red, crimson, blue, cyan, teal, purple, violet, pink), hair style (spiky, long, short, ponytail, twin tails, braided, bob, undercut, messy, buzz, hooded, helmet, visor helm, crown, cowboy hat), eye color (cyan, emerald, green, blue, amber, gold, violet, purple, red, brown, silver), attire (dark trench coat, olive military uniform, crimson cyber jacket, gold samurai kimono, blue stealth suit, purple royal cloak, white lab coat, brown leather armor), props (rifle, holodrive, blade, katana, pistol, energy orb)

Return ONLY valid JSON matching this exact structure (no markdown fences):
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
        "hair": "optional #hex if hair color changed",
        "eye": "optional #hex if eye color changed",
        "skin": "optional #hex if skin color changed",
        "outfitPrimary": "optional #hex if outfit color changed"
      },
      "customSvg": "optional raw SVG shapes (<path>, <polygon>, <circle>, <rect>, <ellipse>) in character local coordinates ((0,0)=face center, (0,-65)=top of head, (0,100)=chest, (85,10)=hand) for any unique unstored trait"
    }
  ],
  "newCharacters": [
    {
      "name": "Name of brand-new character (ONLY include in newCharacters if the user asked to add/introduce a new character not already in Characters in Project)",
      "role": "Character's role",
      "age": "Age (e.g. 30s)",
      "hairAndEyes": "Hair style, hair color, and eye color using the engine keywords",
      "facialFeatures": "Skin tone, scar/stubble, and any accessory (visor, eyepatch, glasses, mask, headband)",
      "currentAttire": "Outfit style, color, and weapon/prop (rifle, holodrive, blade, katana, pistol, energy orb)",
      "customColors": {
        "hair": "#hex",
        "eye": "#hex",
        "skin": "#hex",
        "outfitPrimary": "#hex"
      },
      "customSvg": "optional raw SVG shapes in character local coordinates for any unique unstored trait"
    }
  ],
  "newBubble": {
    "speaker": "Speaker name (only include newBubble if user asked to add dialogue/speech)",
    "text": "Dialogue line"
  },
  "reply": "Short 1-sentence confirmation of what you modified on the scene"
}`;

    for (const model of GEMINI_MODELS) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });
        const parsed = JSON.parse(res.text || "{}");
        if (parsed.updatedDirective) {
          return NextResponse.json(parsed);
        }
      } catch {
        // try next model
      }
    }

    return NextResponse.json({
      updatedDirective: [currentEditDirective, userInstruction].filter(Boolean).join("; "),
      reply: `Applied your edit to ${currentSceneTitle}: "${userInstruction}".`
    });
  } catch {
    return NextResponse.json({ error: "Failed to process edit" }, { status: 500 });
  }
}
