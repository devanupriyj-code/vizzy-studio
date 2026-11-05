import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const TEXT_MODELS = [
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-2.0-flash"
];

const IMAGE_MODELS = [
  "gemini-2.0-flash-preview-image-generation",
  "gemini-2.0-flash-exp-image-generation"
];

interface MaskRegion {
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
}

/**
 * Deterministic procedural SVG generator for common scene objects/effects when offline
 * or when fast vector layer injection is used.
 */
function buildProceduralSceneOverlaySvg(prompt: string, mask?: MaskRegion): string {
  const lower = prompt.toLowerCase();
  const cx = mask ? Math.round(((mask.xPercent + mask.widthPercent / 2) / 100) * 1280) : 640;
  const cy = mask ? Math.round(((mask.yPercent + mask.heightPercent / 2) / 100) * 720) : 320;
  const parts: string[] = [];

  if (lower.includes("portal") || lower.includes("rift") || lower.includes("vortex")) {
    parts.push(`
      <g transform="translate(${cx}, ${cy})">
        <ellipse cx="0" cy="0" rx="110" ry="165" fill="none" stroke="#a855f7" stroke-width="10" opacity="0.85"/>
        <ellipse cx="0" cy="0" rx="88" ry="140" fill="#3b0764" opacity="0.65" stroke="#38bdf8" stroke-width="5"/>
        <ellipse cx="0" cy="0" rx="55" ry="95" fill="#c084fc" opacity="0.45"/>
        <circle cx="0" cy="0" r="24" fill="#ffffff" opacity="0.8"/>
      </g>
    `);
  }
  if (lower.includes("dragon") || lower.includes("monster") || lower.includes("beast")) {
    parts.push(`
      <g transform="translate(${cx}, ${cy})">
        <path d="M-160,20 Q-90,-90 -20,-20 L0,-65 L25,-50 L45,-65 L30,-20 Q110,-90 170,20 Q90,0 35,35 L0,95 L-35,35 Q-90,0 -160,20 Z" fill="#1e1b4b" stroke="#f43f5e" stroke-width="4"/>
        <circle cx="-10" cy="-38" r="5" fill="#fbbf24"/>
        <circle cx="15" cy="-38" r="5" fill="#fbbf24"/>
        <path d="M0,-20 Q15,40 60,85" stroke="#f97316" stroke-width="8" fill="none" opacity="0.85"/>
      </g>
    `);
  }
  if (lower.includes("helicopter") || lower.includes("chopper") || lower.includes("gunship") || lower.includes("ship") || lower.includes("spaceship") || lower.includes("ufo")) {
    parts.push(`
      <g transform="translate(${cx}, ${cy})">
        <line x1="-140" y1="-38" x2="140" y2="-38" stroke="#94a3b8" stroke-width="5"/>
        <rect x="-8" y="-38" width="16" height="16" fill="#475569"/>
        <ellipse cx="0" cy="0" rx="78" ry="28" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
        <path d="M-40,-15 Q0,-26 48,-8 L48,10 L-35,10 Z" fill="#0284c7" opacity="0.65"/>
        <path d="M75,0 L155,-14 L165,-32 L175,-5 L75,12 Z" fill="#1e293b" stroke="#475569" stroke-width="2"/>
        <polygon points="-25,28 -95,240 95,240 25,28" fill="#fef08a" opacity="0.18"/>
      </g>
    `);
  }
  if (lower.includes("car") || lower.includes("vehicle") || lower.includes("motorcycle") || lower.includes("bike")) {
    parts.push(`
      <g transform="translate(${cx}, ${cy})">
        <path d="M-130,30 L-95,-20 L40,-25 L105,10 L135,30 L130,55 L-130,55 Z" fill="#dc2626" stroke="#09090b" stroke-width="4"/>
        <polygon points="-80,-14 30,-18 75,10 -85,10" fill="#38bdf8" opacity="0.7"/>
        <circle cx="-80" cy="55" r="26" fill="#09090b" stroke="#94a3b8" stroke-width="6"/>
        <circle cx="80" cy="55" r="26" fill="#09090b" stroke="#94a3b8" stroke-width="6"/>
        <ellipse cx="132" cy="36" rx="8" ry="5" fill="#fef08a"/>
      </g>
    `);
  }
  if (lower.includes("lightning") || lower.includes("thunder") || lower.includes("bolt")) {
    parts.push(`
      <g transform="translate(${cx}, ${cy})">
        <polyline points="0,-240 -35,-90 20,-75 -45,65 10,75 -30,240" fill="none" stroke="#38bdf8" stroke-width="10"/>
        <polyline points="0,-240 -35,-90 20,-75 -45,65 10,75 -30,240" fill="none" stroke="#ffffff" stroke-width="4"/>
      </g>
    `);
  }
  if (lower.includes("explosion") || lower.includes("fireball") || lower.includes("blast")) {
    parts.push(`
      <g transform="translate(${cx}, ${cy})">
        <circle cx="0" cy="0" r="120" fill="#f97316" opacity="0.55"/>
        <polygon points="0,-135 35,-45 130,-75 65,5 140,70 40,55 15,140 -30,55 -125,85 -65,0 -130,-70 -35,-45" fill="#fbbf24" opacity="0.85" stroke="#ef4444" stroke-width="5"/>
        <circle cx="0" cy="0" r="52" fill="#ffffff" opacity="0.9"/>
      </g>
    `);
  }
  if (lower.includes("moon") || lower.includes("sun") || lower.includes("planet") || lower.includes("eclipse")) {
    const isRed = lower.includes("red") || lower.includes("blood") || lower.includes("crimson");
    parts.push(`
      <g transform="translate(${cx}, ${cy})">
        <circle cx="0" cy="0" r="95" fill="${isRed ? "#ef4444" : "#fef08a"}" opacity="0.25"/>
        <circle cx="0" cy="0" r="70" fill="${isRed ? "#dc2626" : "#fde047"}" stroke="#ffffff" stroke-width="2" opacity="0.9"/>
      </g>
    `);
  }
  if (lower.includes("drone") || lower.includes("robot") || lower.includes("mech")) {
    parts.push(`
      <g transform="translate(${cx}, ${cy})">
        <circle cx="0" cy="0" r="36" fill="#1e293b" stroke="#38bdf8" stroke-width="4"/>
        <circle cx="0" cy="0" r="14" fill="#ef4444"/>
        <circle cx="-4" cy="-4" r="4" fill="#ffffff"/>
        <line x1="-55" y1="-20" x2="-32" y2="-10" stroke="#94a3b8" stroke-width="5"/>
        <line x1="55" y1="-20" x2="32" y2="-10" stroke="#94a3b8" stroke-width="5"/>
        <polygon points="0,14 -70,220 70,220" fill="#ef4444" opacity="0.2"/>
      </g>
    `);
  }
  if (lower.includes("magic") || lower.includes("aura") || lower.includes("energy") || lower.includes("circle")) {
    parts.push(`
      <g transform="translate(${cx}, ${cy})">
        <circle cx="0" cy="0" r="110" fill="none" stroke="#38bdf8" stroke-width="4" stroke-dasharray="14 8" opacity="0.85"/>
        <circle cx="0" cy="0" r="82" fill="none" stroke="#a855f7" stroke-width="3" opacity="0.8"/>
        <polygon points="0,-82 71,41 -71,41" fill="none" stroke="#38bdf8" stroke-width="2.5" opacity="0.75"/>
        <polygon points="0,82 71,-41 -71,-41" fill="none" stroke="#a855f7" stroke-width="2.5" opacity="0.75"/>
      </g>
    `);
  }

  return parts.join("\n");
}

/**
 * Injects an SVG snippet right before the closing `</svg>` tag of a `data:image/svg+xml;utf8,...` URI.
 */
function injectSvgOverlayIntoDataUri(currentDataUri: string, svgOverlay: string): string | null {
  if (!svgOverlay.trim()) return null;
  const prefix = "data:image/svg+xml;utf8,";
  if (!currentDataUri.startsWith(prefix)) return null;
  try {
    const rawSvg = decodeURIComponent(currentDataUri.slice(prefix.length));
    const closeIdx = rawSvg.lastIndexOf("</svg>");
    if (closeIdx === -1) return null;
    const updatedSvg =
      rawSvg.slice(0, closeIdx) +
      `\n<!-- AI Scene Edit Layer -->\n<g class="ai-scene-edit-layer">${svgOverlay}</g>\n</svg>`;
    return `${prefix}${encodeURIComponent(updatedSvg)}`;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      prompt,
      currentImageUrl,
      maskRegion,
      sceneTitle,
      sceneDescription,
      artStyle
    } = body as {
      prompt: string;
      currentImageUrl: string;
      maskRegion?: MaskRegion;
      sceneTitle?: string;
      sceneDescription?: string;
      artStyle?: string;
    };

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Missing edit prompt" }, { status: 400 });
    }

    const cx = maskRegion
      ? Math.round(((maskRegion.xPercent + maskRegion.widthPercent / 2) / 100) * 1280)
      : 640;
    const cy = maskRegion
      ? Math.round(((maskRegion.yPercent + maskRegion.heightPercent / 2) / 100) * 720)
      : 340;
    const boxW = maskRegion ? Math.round((maskRegion.widthPercent / 100) * 1280) : 420;
    const boxH = maskRegion ? Math.round((maskRegion.heightPercent / 100) * 720) : 320;

    const apiKey = process.env.GEMINI_API_KEY;
    const proceduralSvg = buildProceduralSceneOverlaySvg(prompt, maskRegion);

    if (apiKey && !apiKey.includes("your_gemini")) {
      const ai = new GoogleGenAI({ apiKey });

      // 1. If the current image is a raster PNG/JPEG data URI, try Gemini native multimodal image editing first
      if (currentImageUrl?.startsWith("data:image/png;base64,") || currentImageUrl?.startsWith("data:image/jpeg;base64,")) {
        const mimeMatch = currentImageUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (mimeMatch) {
          for (const model of IMAGE_MODELS) {
            try {
              const res = await ai.models.generateContent({
                model,
                contents: [
                  {
                    role: "user",
                    parts: [
                      {
                        inlineData: {
                          mimeType: mimeMatch[1],
                          data: mimeMatch[2]
                        }
                      },
                      {
                        text: `Edit this storyboard frame (${artStyle || "cinematic graphic novel"} style): ${prompt}. Keep existing characters and composition consistent.`
                      }
                    ]
                  }
                ],
                config: {
                  responseModalities: ["TEXT", "IMAGE"]
                }
              });
              const parts = res.candidates?.[0]?.content?.parts || [];
              for (const part of parts) {
                if (part.inlineData?.data && part.inlineData?.mimeType) {
                  return NextResponse.json({
                    editedImageUrl: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                    reply: `Edited frame with Gemini: "${prompt}".`,
                    source: "gemini-image"
                  });
                }
              }
            } catch {
              // Fall through to Gemini SVG vector synthesizer
            }
          }
        }
      }

      // 2. Ask Gemini to synthesize crisp custom SVG artwork for the requested edit at (cx, cy) plus any engine directives
      const svgSystemPrompt = `You are a graphic novel vector artist for a 1280x720 SVG storyboard canvas.
Scene: "${sceneTitle || "Scene"}" — "${sceneDescription || ""}"
Art Style: "${artStyle || "Graphic Novel"}"
User's Edit Request: "${prompt}"
Target Region Center on 1280x720 Canvas: x=${cx}, y=${cy} (bounding area approx ${boxW}x${boxH}px).

Return ONLY valid JSON with this structure:
{
  "sceneSvg": "Raw SVG elements (<g>, <path>, <polygon>, <circle>, <rect>, <ellipse>, <line>, <linearGradient>, <radialGradient>) drawn on the 1280x720 canvas centered around (${cx}, ${cy}) that visually depict the user's request ('${prompt}') with rich graphic-novel detail, clean strokes, and atmospheric glow. Do NOT include outer <svg> tags or <script> tags.",
  "engineDirective": "Optional keywords if the edit also changes weather/lighting/camera/pose (e.g. 'rain', 'heavy_rain', 'snow', 'fog', 'sparks', 'lasers', 'explosion', 'closeup', 'wide', 'low_angle', 'neon', 'noir', 'crimson')",
  "reply": "Short plain confirmation of what was drawn or updated."
}`;

      for (const model of TEXT_MODELS) {
        try {
          const res = await ai.models.generateContent({
            model,
            contents: svgSystemPrompt,
            config: { responseMimeType: "application/json" }
          });
          const parsed = JSON.parse(res.text || "{}");
          const combinedSvg = [proceduralSvg, parsed.sceneSvg].filter(Boolean).join("\n");
          const injectedUri = injectSvgOverlayIntoDataUri(currentImageUrl, combinedSvg);
          return NextResponse.json({
            editedImageUrl: injectedUri || currentImageUrl,
            sceneSvg: combinedSvg,
            engineDirective: parsed.engineDirective || "",
            reply: parsed.reply || `Applied edit: "${prompt}".`,
            source: "gemini-svg"
          });
        } catch {
          // Try next model
        }
      }
    }

    // 3. Offline procedural SVG injection fallback
    const fallbackInjected = injectSvgOverlayIntoDataUri(currentImageUrl, proceduralSvg);
    return NextResponse.json({
      editedImageUrl: fallbackInjected || currentImageUrl,
      sceneSvg: proceduralSvg,
      engineDirective: prompt,
      reply: `Applied edit: "${prompt}".`,
      source: "procedural"
    });
  } catch {
    return NextResponse.json({ error: "Failed to run AI image edit" }, { status: 500 });
  }
}
