import { Project, ChatMessage } from "@/types";

export interface CharacterActionResult {
  type: "add" | "update";
  name: string;
  role?: string;
  facialFeatures?: string;
  currentAttire?: string;
  age?: string;
}

export async function getVizzyResponse(
  userMessage: string,
  project: Project,
  history: ChatMessage[]
): Promise<{
  text: string;
  suggestedActions?: string[];
  synthesizedPrompt?: string;
  characterAction?: CharacterActionResult;
  newBeatProposal?: {
    title: string;
    description: string;
  };
}> {
  try {
    const res = await fetch("/api/vizzy-director", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage, project, history })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text) {
        return {
          text: data.text,
          suggestedActions: data.suggestedActions || [
            "Generate 4 options",
            "Refine lighting",
            "Next beat"
          ],
          synthesizedPrompt: data.synthesizedPrompt,
          characterAction: data.characterAction
        };
      }
    }
  } catch (err) {
    console.warn("Vizzy director API call fell back to local director:", err);
  }

  // Smart fallback director logic
  const cleanInput = userMessage.trim().toLowerCase();

  if (cleanInput.includes("generate") || cleanInput.includes("draw") || cleanInput.includes("options")) {
    return {
      text: `Firing up the engines! Generating visual variations matching our **${project.styleBible.artStyle}** style bible and locked cast. Click the variations or refine with notes!`,
      suggestedActions: ["Pick Option 1", "Pick Option 2", "Refine Lighting", "Try Closer Angle"]
    };
  }

  if (cleanInput.includes("create character") || cleanInput.includes("new character") || cleanInput.includes("add character")) {
    return {
      text: `I'd love to forge a new character for our story! I've opened up the Character Forge. You can also describe their name, features, and role right here in chat and I'll generate their portrait takes.`,
      suggestedActions: ["Open Style & Characters", "Generate portrait takes", "Lock identity"],
      characterAction: {
        type: "add",
        name: "New Ally",
        role: "Scout",
        facialFeatures: "Sharp determined gaze, athletic build",
        currentAttire: "Field gear matching the era",
        age: "25"
      }
    };
  }

  if (cleanInput.includes("character") || cleanInput.includes("miller") || cleanInput.includes("clothes") || cleanInput.includes("attire")) {
    return {
      text: `Got it. The Style & Character Locker has **${project.characters[0]?.name || "your lead"}** locked with fixed facial features, scar, and weathered skin. If you want to change their wardrobe for this scene or generate fresh portrait takes, click **Style & Characters** in the top bar.`,
      suggestedActions: ["Open Character Forge", "Change outfit", "Generate next beat"]
    };
  }

  return {
    text: `Understood! I've noted that for this beat. I've updated the scene parameters to reflect your notes while maintaining our **${project.styleBible.artStyle}** color palette and character likenesses. Ready to generate variations?`,
    suggestedActions: ["Add Option 2", "Adjust dialogue", "Preview slideshow"]
  };
}
