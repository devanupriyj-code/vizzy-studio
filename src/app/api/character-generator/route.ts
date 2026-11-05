import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const GEMINI_MODELS = [
  "gemini-3-flash-preview",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite-preview"
];

export async function POST(req: Request) {
  try {
    const { prompt, mode, existingCharacter, artStyle } = (await req.json()) as {
      prompt: string;
      mode?: "create" | "modify";
      existingCharacter?: {
        name: string;
        role: string;
        age: string;
        hairAndEyes: string;
        facialFeatures: string;
        currentAttire: string;
        customSvg?: string;
        customColors?: {
          hair?: string;
          hairHighlight?: string;
          eye?: string;
          skin?: string;
          outfitPrimary?: string;
          outfitSecondary?: string;
        };
      };
      artStyle?: string;
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && !apiKey.includes("your_gemini")) {
      const ai = new GoogleGenAI({ apiKey });
      const sysPrompt = `You are Vizzy's AI Character Designer & Vector Rig Artist. ${
        mode === "modify" && existingCharacter
          ? `Modify this existing character (${JSON.stringify(existingCharacter)}) based on the user's instruction: "${prompt}". Keep all existing traits that the user did NOT ask to change, and apply the user's requested changes.`
          : `Create a new character based on the user's description: "${prompt}" in style "${artStyle || "Graphic Novel"}".`
      }

1. Built-in Rig Keywords (include matching keywords in hairAndEyes, facialFeatures, and currentAttire):
- Hair/Headgear: spiky, long, ponytail, twin tails, bob cut, undercut, braided, slicked back, messy, buzz cut, afro, mohawk, hooded, helmet, visor helm, crown, cowboy hat, wizard hat, top hat, pirate hat, baseball cap, headphones, horns, antlers, halo, cat ears, elf ears, antennae
- Hair/Eye/Outfit Colors: green, emerald, lime, brown, brunette, orange, ginger, black, silver, white, blonde, golden, yellow, red, crimson, blue, cyan, teal, pink, violet, purple
- Facial Features/Accessories: fair skin, olive skin, dark skin, green skin, blue skin, red skin, purple skin, grey skin, scar, stubble, full beard, long beard, mustache, cyber visor, eyepatch, glasses, sunglasses, monocle, tactical mask, headband, fangs, third eye, cigar, tattoo
- Outfits & Attachments: dark trench coat, crimson cyber jacket, gold samurai kimono, blue stealth suit, green military field jacket, royal purple cloak, white lab coat, wasteland plate armor, angel wings, demon wings, cyber wings, cape, jetpack, scarf, shoulder pads, necklace, tail, flaming aura
- Weapons/Props: holodrive, rifle, scoped rifle, pistol, katana, blade, energy orb, shield, magic staff, battleaxe, warhammer, scythe, bow, guitar

2. Custom Colors & Custom Vector SVG Generation (for ANY trait or item NOT in the built-in storage):
- Always provide exact hex codes in "customColors" matching the character's hair, eyes, skin, and outfit so ANY color (even neon chartreuse, rose gold, turquoise, etc.) renders with 100% precision.
- If the user asks for any custom accessory, emblem, pet, hat, weapon, or visual detail not fully covered above, write clean, valid SVG shapes (<path>, <polygon>, <circle>, <rect>, <ellipse>, <line>) in "customSvg" using the character rig's local coordinate system:
  * (0, 0) = center of face between the eyes
  * (-15, -3) and (15, -3) = left and right eyes
  * (0, -45) to (0, -95) = top of head / hats / crowns / floating items
  * (0, 18) = mouth, (0, 38) = chin
  * (0, 65) to (0, 160) = chest / torso / armor emblem / necklace
  * (85, -40) to (85, 80) = held item / weapon / prop on the right side
  * Do NOT include <svg> or <defs> tags inside customSvg—only raw shape elements (<g>, <path>, <polygon>, <circle>, <rect>, <ellipse>, <line>) with inline fill/stroke hex colors.

Return ONLY valid JSON matching this exact structure:
{
  "character": {
    "name": "Character Name",
    "role": "Role / Title",
    "age": "Age",
    "hairAndEyes": "Hair style, hair color, and eye color",
    "facialFeatures": "Skin tone, facial structure, facial hair, and accessories",
    "currentAttire": "Outfit style, color, wings/cape/attachments, and weapon/prop",
    "customColors": {
      "hair": "#hex",
      "hairHighlight": "#hex",
      "eye": "#hex",
      "skin": "#hex",
      "outfitPrimary": "#hex",
      "outfitSecondary": "#hex"
    },
    "customSvg": "<g>optional custom SVG elements for unique unstored traits</g>"
  },
  "variants": [
    {
      "label": "Look 1",
      "hairAndEyes": "...",
      "facialFeatures": "...",
      "attire": "..."
    },
    {
      "label": "Look 2",
      "hairAndEyes": "...",
      "facialFeatures": "...",
      "attire": "..."
    },
    {
      "label": "Look 3",
      "hairAndEyes": "...",
      "facialFeatures": "...",
      "attire": "..."
    },
    {
      "label": "Look 4",
      "hairAndEyes": "...",
      "facialFeatures": "...",
      "attire": "..."
    }
  ]
}`;

      for (const model of GEMINI_MODELS) {
        try {
          const res = await ai.models.generateContent({
            model,
            contents: sysPrompt,
            config: { responseMimeType: "application/json" }
          });
          const parsed = JSON.parse(res.text || "{}");
          if (parsed.character?.name) {
            return NextResponse.json(parsed);
          }
        } catch {
          // try next model
        }
      }
    }

    // Offline fallback parser (smart merge for modify mode)
    const nameMatch = prompt.match(/(?:named|called)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/i);
    const name = nameMatch?.[1] || existingCharacter?.name || "Vex";

    let nextHairAndEyes = existingCharacter?.hairAndEyes || prompt;
    let nextFacial = existingCharacter?.facialFeatures || prompt;
    let nextAttire = existingCharacter?.currentAttire || prompt;

    if (mode === "modify" && existingCharacter) {
      // Append the user's instruction across the relevant traits so deriveCharacterRig + buildProceduralUnstoredLayers picks up every keyword
      nextHairAndEyes = `${prompt}; ${existingCharacter.hairAndEyes}`;
      nextFacial = `${prompt}, ${existingCharacter.facialFeatures}`;
      nextAttire = `${prompt}, ${existingCharacter.currentAttire}`;
    }

    const base = {
      name,
      role: existingCharacter?.role || "Story Operative",
      age: existingCharacter?.age || "28",
      hairAndEyes: nextHairAndEyes,
      facialFeatures: nextFacial,
      currentAttire: nextAttire,
      customSvg: existingCharacter?.customSvg || ""
    };
    return NextResponse.json({
      character: base,
      variants: [
        { label: "Look 1", hairAndEyes: nextHairAndEyes, facialFeatures: nextFacial, attire: nextAttire },
        { label: "Look 2", hairAndEyes: `spiky ${nextHairAndEyes}`, facialFeatures: `scar, ${nextFacial}`, attire: `dark trench coat, ${nextAttire}` },
        { label: "Look 3", hairAndEyes: `long ${nextHairAndEyes}`, facialFeatures: `cyber visor, ${nextFacial}`, attire: `crimson cyber jacket, ${nextAttire}` },
        { label: "Look 4", hairAndEyes: `hooded ${nextHairAndEyes}`, facialFeatures: `tactical mask, ${nextFacial}`, attire: `black stealth suit, ${nextAttire}` }
      ]
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate character" }, { status: 500 });
  }
}
