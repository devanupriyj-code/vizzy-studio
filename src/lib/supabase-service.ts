import { supabase, isSupabaseConfigured } from "./supabase";
import { Project, StoryBeat } from "@/types";

const IGNORED_PROJECT_IDS = new Set([
  "empty-project",
  "proj-dday-1944",
  "proj-overlord-1944"
]);

export function isPlaceholderProject(project?: Project | null): boolean {
  if (!project || !project.id) return true;
  if (IGNORED_PROJECT_IDS.has(project.id)) return true;
  if (project.title === "Operation Overlord: Red Beach") return true;
  if (!Array.isArray(project.beats) || project.beats.length === 0) return true;
  return false;
}

function getUserKey(baseKey: string, userEmail?: string | null): string {
  const email = (
    userEmail ||
    (typeof window !== "undefined" ? localStorage.getItem("vizzy_user_email") : "") ||
    "guest"
  )
    .trim()
    .toLowerCase();
  return `${baseKey}::${email}`;
}

function getLocalProjectsList(userEmail?: string | null): Project[] {
  if (typeof window === "undefined") return [];
  try {
    localStorage.removeItem("vizzy_active_project");
    localStorage.removeItem("vizzy_projects_list");

    const raw = localStorage.getItem(getUserKey("vizzy_projects_list", userEmail));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const filtered = parsed.filter((p) => !isPlaceholderProject(p));
    if (filtered.length !== parsed.length) {
      localStorage.setItem(getUserKey("vizzy_projects_list", userEmail), JSON.stringify(filtered));
    }
    return filtered;
  } catch {
    return [];
  }
}

function setLocalProjectsList(projects: Project[], userEmail?: string | null) {
  if (typeof window === "undefined") return;
  try {
    const clean = projects.filter((p) => !isPlaceholderProject(p));
    localStorage.setItem(getUserKey("vizzy_projects_list", userEmail), JSON.stringify(clean));
  } catch (e) {
    console.warn("Could not save projects list to localStorage:", e);
  }
}

/**
 * Saves a user-created project to localStorage and Supabase.
 * Never saves placeholder or empty projects.
 */
export async function saveProject(
  project: Project,
  userEmail?: string | null
): Promise<{ success: boolean; cloud: boolean; error?: string }> {
  if (isPlaceholderProject(project)) {
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
 * Returns all saved projects for the current user (excluding any legacy default demo).
 */
export async function listSavedProjects(userEmail?: string | null): Promise<Project[]> {
  const byId = new Map<string, Project>();

  if (typeof window !== "undefined") {
    for (const p of getLocalProjectsList(userEmail)) {
      if (!isPlaceholderProject(p)) byId.set(p.id, p);
    }
    try {
      const activeKey = getUserKey("vizzy_active_project", userEmail);
      const activeRaw = localStorage.getItem(activeKey);
      if (activeRaw) {
        const active = JSON.parse(activeRaw);
        if (!isPlaceholderProject(active)) {
          byId.set(active.id, active);
        } else {
          localStorage.removeItem(activeKey);
        }
      }
    } catch {
      // ignore
    }
  }

  if (supabase && isSupabaseConfigured) {
    try {
      for (const legacyId of IGNORED_PROJECT_IDS) {
        await supabase.from("story_beats").delete().eq("project_id", legacyId);
        await supabase.from("projects").delete().eq("id", legacyId);
      }
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
