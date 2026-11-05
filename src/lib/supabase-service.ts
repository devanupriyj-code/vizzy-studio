import { supabase, isSupabaseConfigured } from "./supabase";
import { Project, StoryBeat } from "@/types";

const LOCAL_STORAGE_KEY = "vizzy_active_project";
const LOCAL_PROJECTS_LIST_KEY = "vizzy_projects_list";

function getLocalProjectsList(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_PROJECTS_LIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setLocalProjectsList(projects: Project[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_PROJECTS_LIST_KEY, JSON.stringify(projects));
  } catch (e) {
    console.warn("Could not save projects list to localStorage:", e);
  }
}

/**
 * Saves project either to Supabase (if tables exist) or local storage as fallback.
 */
export async function saveProject(project: Project): Promise<{ success: boolean; cloud: boolean; error?: string }> {
  // Always save locally first as instant backup
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(project));
      const existing = getLocalProjectsList().filter((p) => p.id !== project.id);
      setLocalProjectsList([project, ...existing].slice(0, 25));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }

  // Attempt Supabase cloud save if configured
  if (supabase && isSupabaseConfigured) {
    try {
      // 1. Upsert project
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
        // Table may not have been created in SQL editor yet
        return { success: true, cloud: false, error: projError.message };
      }

      // 2. Upsert beats
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
 * Returns all saved projects from localStorage and Supabase.
 */
export async function listSavedProjects(): Promise<Project[]> {
  const byId = new Map<string, Project>();

  if (typeof window !== "undefined") {
    for (const p of getLocalProjectsList()) {
      if (p && p.id) byId.set(p.id, p);
    }
    try {
      const activeRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (activeRaw) {
        const active = JSON.parse(activeRaw);
        if (active && active.id) byId.set(active.id, active);
      }
    } catch {
      // ignore
    }
  }

  if (supabase && isSupabaseConfigured) {
    try {
      const { data: projRows } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(20);

      if (Array.isArray(projRows)) {
        for (const row of projRows) {
          if (byId.has(row.id)) continue;
          const { data: beatsData } = await supabase
            .from("story_beats")
            .select("*")
            .eq("project_id", row.id)
            .order("sequence_index", { ascending: true });

          const mappedBeats: StoryBeat[] = (beatsData || []).map((b: any) => ({
            id: b.id,
            sequenceIndex: b.sequence_index,
            title: b.title,
            userPromptDescription: b.user_prompt_description,
            synthesizedPrompt: b.synthesized_prompt,
            currentImageUrl: b.selected_image_url || "",
            versionHistory: b.candidates || [],
            captions: b.captions || [],
            subtitleText: b.subtitle_text,
            durationSeconds: Number(b.duration_seconds) || 3.5,
            isLocked: Boolean(b.is_locked)
          }));

          byId.set(row.id, {
            id: row.id,
            title: row.title,
            synopsis: row.synopsis,
            styleBible: row.style_bible,
            characters: row.characters || [],
            beats: mappedBeats,
            activeBeatIndex: row.active_beat_index ?? 0,
            displayMode: row.display_mode || "comic"
          });
        }
      }
    } catch {
      // ignore cloud errors
    }
  }

  return Array.from(byId.values());
}

/**
 * Deletes a project by ID from both localStorage and Supabase.
 */
export async function deleteProject(projectId: string): Promise<{ success: boolean; remainingProjects: Project[] }> {
  let remaining: Project[] = [];

  if (typeof window !== "undefined") {
    try {
      remaining = getLocalProjectsList().filter((p) => p.id !== projectId);
      setLocalProjectsList(remaining);

      const activeRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (activeRaw) {
        const active = JSON.parse(activeRaw);
        if (active?.id === projectId) {
          if (remaining.length > 0) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remaining[0]));
          } else {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
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
 * Loads project from Supabase or localStorage.
 */
export async function loadSavedProject(fallback: Project): Promise<Project> {
  // Try Supabase first
  if (supabase && isSupabaseConfigured) {
    try {
      const { data: projData, error: projError } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (!projError && projData) {
        // Load beats for this project
        const { data: beatsData } = await supabase
          .from("story_beats")
          .select("*")
          .eq("project_id", projData.id)
          .order("sequence_index", { ascending: true });

        const mappedBeats: StoryBeat[] = (beatsData || []).map((b: any) => ({
          id: b.id,
          sequenceIndex: b.sequence_index,
          title: b.title,
          user_prompt_description: b.user_prompt_description,
          userPromptDescription: b.user_prompt_description,
          synthesizedPrompt: b.synthesized_prompt,
          currentImageUrl: b.selected_image_url || fallback.beats[0]?.currentImageUrl,
          versionHistory: b.candidates || [],
          captions: b.captions || [],
          subtitleText: b.subtitle_text,
          durationSeconds: Number(b.duration_seconds) || 3.5,
          isLocked: Boolean(b.is_locked)
        }));

        return {
          id: projData.id,
          title: projData.title,
          synopsis: projData.synopsis,
          styleBible: projData.style_bible,
          characters: projData.characters || [],
          beats: mappedBeats.length > 0 ? mappedBeats : fallback.beats,
          activeBeatIndex: projData.active_beat_index ?? 0,
          displayMode: projData.display_mode || "comic"
        };
      }
    } catch (e) {
      console.warn("Supabase load fell back to localStorage:", e);
    }
  }

  // Fallback to localStorage with migration safeguard
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && Array.isArray(parsed.beats)) {
          parsed.beats = parsed.beats.map((b: any, idx: number) => ({
            ...b,
            currentImageUrl: b.currentImageUrl || b.selectedImageUrl || fallback.beats[idx]?.currentImageUrl || fallback.beats[0]?.currentImageUrl,
            versionHistory: Array.isArray(b.versionHistory) && b.versionHistory.length > 0
              ? b.versionHistory
              : [
                  {
                    id: `v-init-${b.id || idx}`,
                    imageUrl: b.currentImageUrl || b.selectedImageUrl || fallback.beats[idx]?.currentImageUrl,
                    promptUsed: "Initial scene take",
                    createdAt: "Initial"
                  }
                ]
          }));
        }
        return parsed;
      }
    } catch (e) {
      console.warn("Could not read from localStorage:", e);
    }
  }

  return fallback;
}
