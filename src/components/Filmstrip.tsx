"use client";

import React from "react";
import { StoryBeat } from "@/types";
import { Plus, Check, Clock, Film, Copy, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { getSafetyMirrorImage } from "@/lib/image-gen";

interface FilmstripProps {
  beats: StoryBeat[];
  activeBeatIndex: number;
  artStyle: string;
  onSelectBeat: (index: number) => void;
  onAddNewBeat: () => void;
  onDeleteBeat?: (index: number) => void;
  onDuplicateBeat?: (index: number) => void;
  onMoveBeat?: (index: number, direction: -1 | 1) => void;
}

export const Filmstrip: React.FC<FilmstripProps> = ({
  beats,
  activeBeatIndex,
  artStyle,
  onSelectBeat,
  onAddNewBeat,
  onDeleteBeat,
  onDuplicateBeat,
  onMoveBeat
}) => {
  return (
    <div className="h-28 border-t border-zinc-800 bg-zinc-950/90 px-6 py-2 flex items-center gap-3 z-10 overflow-x-auto select-none print:hidden">
      <div className="flex items-center gap-2 pr-2 border-r border-zinc-800/80 text-zinc-500 flex-shrink-0">
        <Film className="w-4 h-4 text-zinc-400" />
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
            Sequence
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            {beats.length} Scenes
          </span>
        </div>
      </div>

      {/* Beats thumbnails */}
      <div className="flex items-center gap-3 flex-1 overflow-x-auto py-1">
        {beats.map((beat, idx) => {
          const isActive = idx === activeBeatIndex;
          const thumbUrl = beat.currentImageUrl || getSafetyMirrorImage(artStyle, idx);

          return (
            <div
              key={beat.id}
              onClick={() => onSelectBeat(idx)}
              className={`group relative flex-shrink-0 w-36 h-20 rounded-lg overflow-hidden border cursor-pointer transition-all ${
                isActive
                  ? "border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-950/40"
                  : "border-zinc-800 hover:border-zinc-600 bg-zinc-900"
              }`}
            >
              {/* Thumbnail Image */}
              {beat.currentImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbUrl}
                  alt={beat.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-[9px] text-zinc-500 font-semibold">
                  Not generated yet
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-zinc-200">
                    Scene #{idx + 1}
                  </span>

                  {/* Storyboarder Hover Scene Controls (Move, Duplicate, Delete) */}
                  <div className="hidden group-hover:flex items-center gap-0.5 bg-black/85 rounded px-1 py-0.5 backdrop-blur-sm">
                    {onMoveBeat && idx > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveBeat(idx, -1);
                        }}
                        className="p-0.5 text-zinc-400 hover:text-white cursor-pointer"
                        title="Move scene left"
                      >
                        <ChevronLeft className="w-2.5 h-2.5" />
                      </button>
                    )}
                    {onMoveBeat && idx < beats.length - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveBeat(idx, 1);
                        }}
                        className="p-0.5 text-zinc-400 hover:text-white cursor-pointer"
                        title="Move scene right"
                      >
                        <ChevronRight className="w-2.5 h-2.5" />
                      </button>
                    )}
                    {onDuplicateBeat && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateBeat(idx);
                        }}
                        className="p-0.5 text-zinc-400 hover:text-amber-400 cursor-pointer"
                        title="Duplicate scene"
                      >
                        <Copy className="w-2.5 h-2.5" />
                      </button>
                    )}
                    {onDeleteBeat && beats.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteBeat(idx);
                        }}
                        className="p-0.5 text-zinc-400 hover:text-red-400 cursor-pointer"
                        title="Delete scene"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>

                  {beat.isLocked && (
                    <span className="p-0.5 rounded bg-emerald-500/90 text-black group-hover:hidden">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[9px] text-zinc-300">
                  <span className="truncate max-w-[85px] font-medium">
                    {beat.title}
                  </span>
                  <span className="flex items-center gap-0.5 font-mono text-[8px] text-zinc-400">
                    <Clock className="w-2.5 h-2.5" />
                    {beat.durationSeconds}s
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add New Beat Button */}
        <button
          onClick={onAddNewBeat}
          className="flex-shrink-0 w-28 h-20 rounded-lg border-2 border-dashed border-zinc-800 hover:border-amber-500/60 bg-zinc-900/30 hover:bg-zinc-900/60 flex flex-col items-center justify-center gap-1.5 text-zinc-400 hover:text-amber-400 transition-all cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-full bg-zinc-800 group-hover:bg-amber-500/20 flex items-center justify-center transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-semibold">Next Scene</span>
        </button>
      </div>
    </div>
  );
};
