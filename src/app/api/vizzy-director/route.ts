import { NextResponse } from "next/server";
import { Project, ChatMessage } from "@/types";
import {
  cleanJsonExtract,
  isRateLimitError,
  sleep,
  GEMINI_FALLBACK_MODELS
} from "@/lib/api-resilience";

function buildOfflineDirectorResponse(userMessage: string, project: Project) {
  const clean = userMessage.trim().toLowerCase();

  if (clean.includes("character") || clean.includes("cast") || clean.includes("costume") || clean.includes("attire") || clean.includes("look")) {
    return {
      text: `I've opened our **Style & Characters** forge! Describe any character's role, face, outfit, or weapon in chat or customize them directly in Cast & Sets. All scenes you render will maintain their visual likeness.`,
      suggestedActions: ["Open Cast & Sets", "Add New Character", "Lock Current Cast"],
      characterAction: {
        type: "add" as const,
        name: "New Operative",
        role: "Allied Specialist",
        facialFeatures: "Sharp determined eyes, athletic build",
        currentAttire: "Dark trench coat with tactical webbing",
        age: "28"
      }
    };
  }

  if (clean.includes("light") || clean.includes("dark") || clean.includes("night") || clean.includes("neon")) {
    return {
      text: `Adjusting atmospheric lighting for **Scene ${project.activeBeatIndex + 1}**! We can bathe the frame in high-contrast rim light, deep shadows, or vibrant neon highlights.`,
      suggestedActions: ["Darker lighting", "Neon cyan highlights", "Bright daylight"]
    };
  }

  if (clean.includes("rain") || clean.includes("storm") || clean.includes("weather") || clean.includes("fog")) {
    return {
      text: `Atmospheric weather controls ready. I can layer cinematic rain streaks, rising ground fog, burning embers, or clear skies across this scene.`,
      suggestedActions: ["Add rain", "Remove rain", "Add smoke & fog"]
    };
  }

  return {
    text: `Understood! Working on **Scene ${project.activeBeatIndex + 1}: ${project.beats[project.activeBeatIndex]?.title || "Frame"}** matching our **${project.styleBible.artStyle}** vision. Describe any change to background, cast, camera angle, or lighting.`,
    suggestedActions: ["Next scene", "Close-up shot", "Darker lighting"]
  };
}

export async function POST(req: Request) {
  let userMessage = "";
  let project: Project | any = undefined;
  let history: ChatMessage[] = [];

  try {
    const body = await req.json().catch(() => ({}));
    userMessage = String(body?.userMessage || "").trim();
    project = body?.project;
    history = Array.isArray(body?.history) ? body.history : [];
  } catch {
    // Keep safe defaults
  }

  if (!project) {
    return NextResponse.json({
      text: "No active storyboard project detected.",
      suggestedActions: ["Create New Project"]
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes("your_gemini") || !userMessage) {
    return NextResponse.json(buildOfflineDirectorResponse(userMessage, project));
  }

  const systemInstruction = `You are Vizzy, an elite visual director, character designer, and graphic novel co-creator collaborating with the user.
Project Title: "${project.title || "Untitled"}"
Synopsis: "${project.synopsis || ""}"
Active Art Style: "${project.styleBible?.artStyle || "Graphic Novel"}"
Lighting & Tone: "${project.styleBible?.visualTone || "Atmospheric"}"
Color Palette: ${Array.isArray(project.styleBible?.colorPalette) ? project.styleBible.colorPalette.join(", ") : "Default"}
Locked Cast:
${(project.characters || [])
  .map(
    (c: any) =>
      `• ${c.name} (${c.role}): Age ${c.identity?.age || "30"}, ${c.identity?.facialFeatures || ""}. Attire: ${c.currentAttire || ""}. Locked: ${c.isLocked}`
  )
  .join("\n")}

Current Beat Index: Beat ${(project.activeBeatIndex || 0) + 1} of ${project.beats?.length || 1}
Current Beat Title: "${project.beats?.[project.activeBeatIndex]?.title || ""}"
Current Beat Visual Description: "${project.beats?.[project.activeBeatIndex]?.userPromptDescription || ""}"

Instructions for your response:
1. Act as a supportive, visionary creative co-director.
2. If the user wants to CREATE a new character, or EDIT/CHANGE an existing character's appearance, clothes, or role, acknowledge it enthusiastically and specify how they fit into the visual world.
3. If creating or editing a character, include a "characterAction" object in the JSON response.
4. Provide 3 short suggested action pills.
5. Return your answer as a JSON object matching this schema:
{
  "text": "Your message to the user in markdown formatting",
  "suggestedActions": ["Action 1", "Action 2", "Action 3"],
  "characterAction": {
    "type": "add" or "update",
    "name": "Character Name",
    "role": "Role / Rank",
    "facialFeatures": "Permanent facial features, scars, eyes, hair",
    "currentAttire": "Current clothes or uniform in the scene",
    "age": "20s/30s/40s"
  }
}`;

  const conversationContents = [
    {
      role: "user",
      parts: [
        { text: systemInstruction },
        { text: `User request: "${userMessage}"` }
      ]
    }
  ];

  for (const model of GEMINI_FALLBACK_MODELS) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 9500);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: conversationContents,
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json"
          }
        })
      }).finally(() => clearTimeout(timer));

      if (res.status === 429) {
        console.warn(`[vizzy-director] 429 Rate Limit on ${model}, auto-failing over...`);
        await sleep(150);
        continue;
      }

      if (res.ok) {
        const data = await res.json();
        const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
        const parsed = cleanJsonExtract<any>(rawContent);
        if (parsed?.text) {
          return NextResponse.json(parsed);
        }
      }
    } catch {
      // try next model
    }
  }

  // Guaranteed fallback: Never return 502/500 to user
  return NextResponse.json(buildOfflineDirectorResponse(userMessage, project));
}
