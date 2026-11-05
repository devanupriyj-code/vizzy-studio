import { supabase, isSupabaseConfigured } from "./supabase";
import { Project, StoryBeat } from "@/types";

const DEFAULT_DEMO_ID = "proj-overlord-1944";

function getUserKey(baseKey: string, userEmail?: string | null): string {
  const email = (userEmail || (typeof window !== "undefined" ? localStorage.getItem("vizzy_user_email") : "") || "guest")
    .trim()
    .toLowerCase();
  return `${baseKey}::${email}`;
}

function getLocalProjectsList(userEmail?: string | null): Project[] {
  if (typeof window === "undefined") return [];
  try {
    // Clean up legacy shared keys that held the hardcoded default project
    localStorage.removeItem("vizzy_active_project");
    localStorage.removeItem("vizzy_projects_list");

    const raw = localStorage.getItem(getUserKey("vizzy_projects_list", userEmail));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((p) => p && p.id && p.id !== DEFAULT_DEMO_ID)
      : [];
  } catch {
    return [];
  }
}

function setLocalProjectsList(projects: Project[], userEmail?: string | null) {
  if (typeof window === "undefined") return;
  try {
    const clean = projects.filter((p) => p && p.id && p.id !== DEFAULT_DEMO_ID);
    localStorage.setItem(getUserKey("vizzy_projects_list", userEmail), JSON.stringify(clean));
  } catch (e) {
    console.warn("Could not save projects list to localStorage:", e);
  }
}

/**
 * Saves project either to Supabase (if tables exist) or local storage as fallback.
 * Never saves the internal fallback placeholder project ("proj-overlord-1944").
 */
export async function saveProject(
  project: Project,
  userEmail?: string | null
): Promise<{ success: boolean; cloud: boolean; error?: string }> {
  if (!project || !project.id || project.id === DEFAULT_DEMO_ID) {
    return { success: false, cloud: false };
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(getUserKey("vizzy_active_project", userEmail), JSON.stringify(project));
      const existing = getLocalProjectsList(userEmail).filter((p) => p.id !== project.id);
      setLocalProjectsList([project, ...existing].slice(0, 25), userEmail);
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }

  if (supabase && isSupabaseConfigured) {
    try {
      const { error: projError } = await supabase.from("projects").upsert(
        {
          id: project.id,
          title: project.title,
          synopsis: project.synopsis,
          style_bible: project.styleBible,
          characters: project.characters,
          display_mode: project.displayMode,
          active_beat_index: project.activeBeatIndex,
          updated_at: new Date().toISOString()
        },
        { onConflict: "id" }
      );

      if (projError) {
        return { success: true, cloud: false, error: projError.message };
      }

      for (const beat of project.beats) {
        await supabase.from("story_beats").upsert(
          {
            id: beat.id,
            project_id: project.id,
            sequence_index: beat.sequenceIndex,
            title: beat.title,
            user_prompt_description: beat.userPromptDescription,
            synthesized_prompt: beat.synthesizedPrompt,
            candidates: beat.versionHistory,
            selected_image_url: beat.currentImageUrl,
            captions: beat.captions,
            subtitle_text: beat.subtitleText,
            duration_seconds: beat.durationSeconds,
            is_locked: beat.isLocked
          },
          { onConflict: "id" }
        );
      }

      return { success: true, cloud: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: true, cloud: false, error: msg };
    }
  }

  return { success: true, cloud: false };
}

/**
 * Returns all saved projects for the current user.
 */
export async function listSavedProjects(userEmail?: string | null): Promise<Project[]> {
  const byId = new Map<string, Project>();

  if (typeof window !== "undefined") {
    for (const p of getLocalProjectsList(userEmail)) {
      if (p && p.id && p.id !== DEFAULT_DEMO_ID) byId.set(p.id, p);
    }
    try {
      const activeRaw = localStorage.getItem(getUserKey("vizzy_active_project", userEmail));
      if (activeRaw) {
        const active = JSON.parse(activeRaw);
        if (active && active.id && active.id !== DEFAULT_DEMO_ID) {
          byId.set(active.id, active);
        }
      }
    } catch {
      // ignore
    }
  }

  // Also purge any accidentally saved default demo from Supabase
  if (supabase && isSupabaseConfigured) {
    try {
      await supabase.from("story_beats").delete().eq("project_id", DEFAULT_DEMO_ID);
      await supabase.from("projects").delete().eq("id", DEFAULT_DEMO_ID);
    } catch {
      // ignore
    }
  }

  return Array.from(byId.values());
}

/**
 * Deletes a project by ID from both localStorage and Supabase.
 */
export async function deleteProject(
  projectId: string,
  userEmail?: string | null
): Promise<{ success: boolean; remainingProjects: Project[] }> {
  let remaining: Project[] = [];

  if (typeof window !== "undefined") {
    try {
      remaining = getLocalProjectsList(userEmail).filter((p) => p.id !== projectId);
      setLocalProjectsList(remaining, userEmail);

      const activeKey = getUserKey("vizzy_active_project", userEmail);
      const activeRaw = localStorage.getItem(activeKey);
      if (activeRaw) {
        const active = JSON.parse(activeRaw);
        if (active?.id === projectId) {
          if (remaining.length > 0) {
            localStorage.setItem(activeKey, JSON.stringify(remaining[0]));
          } else {
            localStorage.removeItem(activeKey);
          }
        }
      }
    } catch (e) {
      console.warn("Could not delete project from localStorage:", e);
    }
  }

  if (supabase && isSupabaseConfigured) {
    try {
      await supabase.from("story_beats").delete().eq("project_id", projectId);
      await supabase.from("projects").delete().eq("id", projectId);
    } catch (e) {
      console.warn("Could not delete project from Supabase:", e);
    }
  }

  return { success: true, remainingProjects: remaining };
}

/**
 * Loads the user's most recent saved project, or returns null if the user has no projects yet.
 */
export async function loadSavedProject(userEmail?: string | null): Promise<Project | null> {
  const saved = await listSavedProjects(userEmail);
  return saved.length > 0 ? saved[0] : null;
}
