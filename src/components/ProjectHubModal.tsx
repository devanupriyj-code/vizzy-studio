"use client";

import React, { useState } from "react";
import { Project } from "@/types";
import { Plus, ArrowRight, BookOpen, Film, Palette, User, X, Trash2, Check, FolderOpen } from "lucide-react";

interface ProjectHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: Project;
  savedProjects: Project[];
  onResumeCurrent: () => void;
  onSelectProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onCreateNew: () => void;
  userEmail?: string;
  onLogout: () => void;
}

export const ProjectHubModal: React.FC<ProjectHubModalProps> = ({
  isOpen,
  onClose,
  currentProject,
  savedProjects,
  onResumeCurrent,
  onSelectProject,
  onDeleteProject,
  onCreateNew,
  userEmail,
  onLogout
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const hasActiveUserProject =
    Boolean(currentProject?.id) &&
    currentProject.id !== "empty-project" &&
    currentProject.id !== "proj-dday-1944" &&
    currentProject.id !== "proj-overlord-1944" &&
    currentProject.title !== "Operation Overlord: Red Beach" &&
    currentProject.beats.length > 0;
  const generated = currentProject.beats.filter((b) => b.currentImageUrl).length;
  const otherProjects = savedProjects.filter(
    (p) =>
      p.id !== currentProject.id &&
      p.id !== "empty-project" &&
      p.id !== "proj-dday-1944" &&
      p.id !== "proj-overlord-1944" &&
      p.title !== "Operation Overlord: Red Beach"
  );

  const handleDeleteClick = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (confirmDeleteId === projectId) {
      onDeleteProject(projectId);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(projectId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="w-full max-w-3xl max-h-[88vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">Projects</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Signed in as <span className="text-zinc-300">{userEmail || "Creator"}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs cursor-pointer"
            >
              Sign out
            </button>
            {hasActiveUserProject && (
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className={`grid grid-cols-1 ${hasActiveUserProject ? "md:grid-cols-2" : ""} gap-4 pt-5`}>
          {/* Create New Storyboard */}
          <div
            onClick={onCreateNew}
            className="group p-5 rounded-lg border border-zinc-800 hover:border-zinc-600 bg-zinc-900/40 hover:bg-zinc-900/80 transition-colors cursor-pointer flex flex-col justify-between min-h-[180px]"
          >
            <div>
              <div className="w-9 h-9 rounded-md bg-zinc-800 text-zinc-200 flex items-center justify-center mb-3">
                <Plus className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-100">New Storyboard</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Start from a script or notes, split into scenes, and set up your cast.
              </p>
            </div>
            <span className="text-xs font-medium text-zinc-300 group-hover:text-white mt-4">Create project →</span>
          </div>

          {/* Continue current (only shown if user actually created a project) */}
          {hasActiveUserProject && (
            <div
              onClick={onResumeCurrent}
              className="group p-5 rounded-lg border border-zinc-800 hover:border-zinc-600 bg-zinc-900/40 transition-colors cursor-pointer flex flex-col justify-between min-h-[180px]"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    Current
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {generated}/{currentProject.beats.length} scenes
                    </span>
                    <button
                      onClick={(e) => handleDeleteClick(e, currentProject.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        confirmDeleteId === currentProject.id
                          ? "bg-red-600 hover:bg-red-500 text-white"
                          : "bg-zinc-900 hover:bg-red-950/70 text-zinc-400 hover:text-red-300 border border-zinc-800"
                      }`}
                      title="Delete this project"
                    >
                      {confirmDeleteId === currentProject.id ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Confirm</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  {currentProject.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{currentProject.synopsis}</p>
                <div className="mt-3 flex items-center gap-4 text-[11px] text-zinc-500">
                  <span className="truncate max-w-[160px]">{currentProject.styleBible.artStyle}</span>
                  <span>{currentProject.characters.length} characters</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end gap-1.5 text-xs font-medium text-zinc-300 group-hover:text-white">
                Open <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )}
        </div>

        {/* Other Saved Projects List */}
        {otherProjects.length > 0 && (
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              Saved Projects ({otherProjects.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {otherProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj)}
                  className="group p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-amber-500/40 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 truncate">{proj.title}</h4>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {proj.beats?.length || 0} scenes • {proj.characters?.length || 0} characters • {proj.styleBible?.artStyle}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => handleDeleteClick(e, proj.id)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        confirmDeleteId === proj.id
                          ? "bg-red-600 hover:bg-red-500 text-white"
                          : "bg-zinc-900 hover:bg-red-950/80 text-zinc-400 hover:text-red-300 border border-zinc-800 hover:border-red-800/50"
                      }`}
                      title="Delete saved project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {confirmDeleteId === proj.id && <span>Confirm</span>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
