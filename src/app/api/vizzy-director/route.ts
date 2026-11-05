import { NextResponse } from "next/server";
import { Project, ChatMessage } from "@/types";

export async function POST(req: Request) {
  try {
    const { userMessage, project, history } = (await req.json()) as {
      userMessage: string;
      project: Project;
      history: ChatMessage[];
    };

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured in .env.local" },
        { status: 400 }
      );
    }

    const systemInstruction = `You are Vizzy, an elite visual director, character designer, and graphic novel co-creator collaborating with the user.
Project Title: "${project.title}"
Synopsis: "${project.synopsis}"
Active Art Style: "${project.styleBible.artStyle}"
Lighting & Tone: "${project.styleBible.visualTone}"
Color Palette: ${project.styleBible.colorPalette.join(", ")}
Locked Cast:
${project.characters
  .map(
    (c) =>
      `• ${c.name} (${c.role}): Age ${c.identity.age}, ${c.identity.facialFeatures}. Attire: ${c.currentAttire}. Locked: ${c.isLocked}`
  )
  .join("\n")}

Current Beat Index: Beat ${project.activeBeatIndex + 1} of ${project.beats.length}
Current Beat Title: "${project.beats[project.activeBeatIndex]?.title || ""}"
Current Beat Visual Description: "${project.beats[project.activeBeatIndex]?.userPromptDescription || ""}"

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

    const candidateModels = [
      "gemini-3-flash-preview",
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite-preview"
    ];

    let lastError = "";

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: conversationContents,
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "application/json"
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
          let parsedResult;
          try {
            parsedResult = JSON.parse(rawContent);
          } catch {
            parsedResult = {
              text: rawContent || "Understood! Let's frame this panel.",
              suggestedActions: ["Generate 4 options", "Refine lighting", "Advance to next beat"]
            };
          }
          return NextResponse.json(parsedResult);
        } else {
          const errText = await res.text();
          lastError = `[${model}] ${res.status}: ${errText}`;
        }
      } catch (err) {
        lastError = String(err);
      }
    }

    return NextResponse.json(
      { error: `Could not reach Gemini models: ${lastError}` },
      { status: 502 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
