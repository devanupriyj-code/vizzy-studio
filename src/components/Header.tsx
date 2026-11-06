"use client";

import React, { useState } from "react";
import { Project } from "@/types";
import { Play, FolderOpen, Settings, Trash2, Check, BookOpen, Users } from "lucide-react";

interface HeaderProps {
  project: Project;
  onOpenCharacterLocker: () => void;
  onStartSlideshow: () => void;
  onOpenComicPage?: () => void;
  onToggleDisplayMode: () => void;
  onManualSave: () => void;
  onOpenProjectHub: () => void;
  onDeleteCurrentProject: () => void;
  onOpenSettings: () => void;
  saveStatus: "idle" | "saving" | "saved_cloud" | "saved_local";
  userEmail?: string;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  onOpenCharacterLocker,
  onStartSlideshow,
  onOpenComicPage,
  onToggleDisplayMode,
  onManualSave,
  onOpenProjectHub,
  onDeleteCurrentProject,
  onOpenSettings,
  saveStatus
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <header className="h-13 border-b border-zinc-800/90 bg-zinc-950 px-4 flex items-center justify-between z-20 print:hidden">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenProjectHub}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-zinc-900 text-left transition-colors cursor-pointer"
          title="Switch or manage projects"
        >
          <span className="text-xs font-semibold tracking-tight text-zinc-100">Vizzy</span>
          <span className="text-zinc-700">/</span>
          <span className="text-xs font-medium text-zinc-300 truncate max-w-[220px]">{project.title}</span>
          <FolderOpen className="w-3.5 h-3.5 text-zinc-500 ml-0.5" />
        </button>

        <span className="hidden md:inline-block text-[11px] text-zinc-500 border-l border-zinc-800 pl-3 truncate max-w-[180px]">
          {project.styleBible.artStyle}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={onManualSave}
          className="px-2.5 py-1.5 rounded-md hover:bg-zinc-900 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          title="Save project"
        >
          {saveStatus === "saving" ? "Saving..." : saveStatus === "saved_cloud" ? "Saved" : "Save"}
        </button>

        <button
          onClick={() => {
            if (confirmDelete) {
              setConfirmDelete(false);
              onDeleteCurrentProject();
            } else {
              setConfirmDelete(true);
              setTimeout(() => setConfirmDelete(false), 3500);
            }
          }}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] transition-colors cursor-pointer ${
            confirmDelete
              ? "bg-red-600 text-white font-medium"
              : "text-zinc-400 hover:text-red-400 hover:bg-zinc-900"
          }`}
          title="Delete current project"
        >
          {confirmDelete ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Confirm delete</span>
            </>
          ) : (
            <>
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Delete</span>
            </>
          )}
        </button>

        <div className="h-4 w-px bg-zinc-800 mx-1" />

        <button
          onClick={onOpenCharacterLocker}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
        >
          <Users className="w-3.5 h-3.5 text-zinc-400" />
          <span>Cast &amp; Sets</span>
          <span className="text-[11px] text-zinc-500 ml-0.5">{project.characters.length}</span>
        </button>

        <button
          onClick={onToggleDisplayMode}
          className="hidden sm:flex items-center px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
        >
          {project.displayMode === "comic" ? "Bubbles" : "Subtitles"}
        </button>

        {onOpenComicPage && (
          <button
            onClick={onOpenComicPage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            <span>Page View</span>
          </button>
        )}

        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-md hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          title="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onStartSlideshow}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors cursor-pointer ml-1"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Preview</span>
        </button>
      </div>
    </header>
  );
};
