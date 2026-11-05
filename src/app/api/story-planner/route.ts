import { NextResponse } from "next/server";
import { localPlanStory, PlannedStory, PlannedScene, PlannedCharacter } from "@/lib/story-planner";

const MODELS = ["gemini-3-flash-preview", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite-preview"];

async function callGemini(apiKey: string, model: string, prompt: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.6, responseMimeType: "application/json" }
        })
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: Request) {
  const { title, story, numScenes, artStyle } = (await req.json()) as {
    title: string;
    story: string;
    numScenes: number;
    artStyle: string;
  };

  const n = Math.max(1, Math.min(30, Number(numScenes) || 6));
  const fallback = localPlanStory(title, story, n);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json(fallback);

  const prompt = `You are a storyboard director. Split the story below into EXACTLY ${n} sequential visual scenes for a ${artStyle} graphic novel / storyboard, and identify the main characters (max 5).

Title: "${title}"
Story:
"""
${story}
"""

Return ONLY JSON with this schema:
{
  "scenes": [
    {
      "title": "short scene title (2-5 words)",
      "description": "vivid visual description of a single image: setting, characters present (by name), action, camera framing, lighting",
      "narration": "one short caption line for the panel",
      "dialogue": [{ "speaker": "Character name", "text": "short line" }]
    }
  ],
  "characters": [
    {
      "name": "Name",
      "role": "role in story",
      "age": "approximate age",
      "facialFeatures": "permanent face details: shape, scars, skin, expression",
      "hairAndEyes": "hair and eye description",
      "attire": "default clothing"
    }
  ]
}
The "scenes" array MUST contain exactly ${n} items. Dialogue may be an empty array.`;

  for (const model of MODELS) {
    const raw = await callGemini(apiKey, model, prompt);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw) as { scenes?: PlannedScene[]; characters?: PlannedCharacter[] };
      if (!Array.isArray(parsed.scenes) || parsed.scenes.length === 0) continue;

      let scenes = parsed.scenes
        .filter((s) => s && s.description)
        .map((s, i) => ({
          title: s.title || `Scene ${i + 1}`,
          description: s.description,
          narration: s.narration || "",
          dialogue: Array.isArray(s.dialogue) ? s.dialogue.filter((d) => d?.speaker && d?.text) : []
        }));
      // Normalize to exactly n scenes
      if (scenes.length > n) scenes = scenes.slice(0, n);
      while (scenes.length < n) scenes.push(fallback.scenes[scenes.length]);

      const characters =
        Array.isArray(parsed.characters) && parsed.characters.length > 0
          ? parsed.characters.slice(0, 5).map((c) => ({
              name: c.name || "Unnamed",
              role: c.role || "Character",
              age: c.age || "30s",
              facialFeatures: c.facialFeatures || "Distinctive features",
              hairAndEyes: c.hairAndEyes || "Dark hair, dark eyes",
              attire: c.attire || "Clothing fitting the story"
            }))
          : fallback.characters;

      const result: PlannedStory = { scenes, characters, source: "gemini" };
      return NextResponse.json(result);
    } catch {
      continue;
    }
  }

  return NextResponse.json(fallback);
}
