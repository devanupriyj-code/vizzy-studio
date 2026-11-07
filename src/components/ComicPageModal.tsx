"use client";

import React, { useState } from "react";
import { Project } from "@/types";
import { X, LayoutGrid, BookOpen, ScrollText, Clapperboard, Printer, Download, Eye, EyeOff, ZoomIn, ZoomOut } from "lucide-react";

interface ComicPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSelectScene?: (idx: number) => void;
}

type ComicLayoutMode = "classic_grid" | "manga_dynamic" | "webtoon_strip" | "storyboard_sheet";

export const ComicPageModal: React.FC<ComicPageModalProps> = ({
  isOpen,
  onClose,
  project,
  onSelectScene
}) => {
  const [layout, setLayout] = useState<ComicLayoutMode>("manga_dynamic");
  const [showBubbles, setShowBubbles] = useState(true);
  const [zoom, setZoom] = useState<number>(100);
  const [paperTheme, setPaperTheme] = useState<"dark" | "paper">("dark");

  if (!isOpen) return null;

  const handlePrintPdf = () => {
    window.print();
  };

  const handleDownloadHtmlComic = () => {
    const panelsHtml = project.beats
      .map(
        (beat, i) => `
      <div class="panel ${i % 5 === 0 ? "hero-panel" : ""}">
        <img src="${beat.currentImageUrl}" alt="Scene ${i + 1}" />
        ${
          showBubbles
            ? beat.captions
                .map(
                  (c) => `
          <div class="bubble ${c.type}" style="${
                    c.type === "narration"
                      ? `left:${Math.max(22, Math.min(78, c.xPercent))}%;top:14px;transform:translateX(-50%);`
                      : `left:${Math.max(18, Math.min(82, c.xPercent))}%;top:${Math.max(24, Math.min(76, c.yPercent))}%;transform:translate(-50%,-50%);`
                  }">
            ${c.speaker && c.type !== "narration" && c.type !== "sfx" ? `<div class="speaker">${c.speaker}:</div>` : ""}
            <div>${c.text}</div>
          </div>`
                )
                .join("")
            : ""
        }
        <div class="panel-num">Panel #${i + 1} • ${beat.title}</div>
      </div>`
      )
      .join("\n");

    const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${project.title} — Graphic Novel</title>
<style>
  body { background: #09090b; color: #f4f4f5; font-family: system-ui, sans-serif; margin: 0; padding: 32px; }
  .page { max-width: 1100px; margin: 0 auto; background: #fff; padding: 24px; border: 4px solid #000; box-shadow: 0 25px 50px rgba(0,0,0,0.6); }
  .header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 4px solid #000; padding-bottom: 12px; margin-bottom: 20px; color: #000; }
  .header h1 { margin: 0; font-size: 28px; text-transform: uppercase; font-weight: 900; letter-spacing: -0.5px; }
  .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .panel { position: relative; border: 3.5px solid #000; aspect-ratio: 16/9; overflow: hidden; background: #000; box-shadow: 4px 4px 0 #000; }
  .hero-panel { grid-column: span 2; aspect-ratio: 21/9; }
  .panel img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .panel-num { position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.85); color: #fbbf24; border: 1px solid rgba(245,158,11,0.4); font-size: 10px; font-weight: 900; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; }
  .bubble { position: absolute; background: #fff; color: #000; border: 2px solid #000; padding: 6px 10px; border-radius: 12px; font-size: 10px; font-weight: 800; max-width: 220px; box-shadow: 2px 2px 0 #000; line-height: 1.3; }
  .bubble.narration { background: #fef3c7; border-radius: 0; text-transform: uppercase; font-size: 9px; box-shadow: 2px 2px 0 #000; }
  .bubble.sfx { background: transparent; border: none; box-shadow: none; color: #facc15; font-size: 22px; font-style: italic; font-weight: 900; text-shadow: 2px 2px 0 #000; }
  .speaker { font-size: 8px; color: #52525b; text-transform: uppercase; margin-bottom: 2px; font-weight: 900; }
</style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>${project.title}</h1>
      <span>${project.styleBible.artStyle} • ${project.beats.length} Panels</span>
    </div>
    <div class="grid">
      ${panelsHtml}
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-comic-page.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md animate-in fade-in duration-200 print:static print:inset-auto print:z-auto print:h-auto print:min-h-0 print:w-full print:bg-white print:overflow-visible print:block">
      {/* Top Studio Bar */}
      <div className="h-16 px-4 sm:px-6 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 truncate">
              <span className="truncate">{project.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-bold border border-zinc-700 flex-shrink-0">
                {project.beats.length} Panels
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400 truncate hidden sm:block">
              Switch comic layouts, toggle speech bubbles, or export to PDF &amp; HTML
            </p>
          </div>
        </div>

        {/* Layout Selector Pills */}
        <div className="hidden lg:flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 flex-shrink-0">
          <button
            onClick={() => setLayout("manga_dynamic")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              layout === "manga_dynamic" ? "bg-zinc-100 text-zinc-950 shadow-sm" : "text-zinc-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Dynamic Comic</span>
          </button>
          <button
            onClick={() => setLayout("classic_grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              layout === "classic_grid" ? "bg-zinc-100 text-zinc-950 shadow-sm" : "text-zinc-400 hover:text-white"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>2x2 Grid</span>
          </button>
          <button
            onClick={() => setLayout("webtoon_strip")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              layout === "webtoon_strip" ? "bg-zinc-100 text-zinc-950 shadow-sm" : "text-zinc-400 hover:text-white"
            }`}
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span>Webtoon Strip</span>
          </button>
          <button
            onClick={() => setLayout("storyboard_sheet")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              layout === "storyboard_sheet" ? "bg-zinc-100 text-zinc-950 shadow-sm" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5" />
            <span>Storyboard Sheet</span>
          </button>
        </div>

        {/* Right Controls: Paper Theme, Zoom, Bubbles Toggle, Print PDF, Export HTML */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Paper Theme Toggle */}
          <button
            onClick={() => setPaperTheme((t) => (t === "dark" ? "paper" : "dark"))}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 cursor-pointer transition-colors"
            title="Toggle between Dark Studio theme and Classic White Print Paper"
          >
            <span>{paperTheme === "dark" ? "🌙 Dark" : "📄 Paper"}</span>
          </button>

          <button
            onClick={() => setZoom((z) => Math.max(75, z - 15))}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-zinc-400 w-9 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(130, z + 15))}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowBubbles(!showBubbles)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 cursor-pointer"
          >
            {showBubbles ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-500" />}
            <span className="hidden sm:inline">Bubbles</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>

          <button
            onClick={handleDownloadHtmlComic}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold cursor-pointer transition-colors"
            title="Download full Comic Page file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Page</span>
          </button>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Comic Page Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-zinc-950 print:overflow-visible print:h-auto print:min-h-0 print:p-0 print:bg-white print:block">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
          className={`transition-transform duration-200 print:transform-none print:w-full print:max-w-none print:shadow-none print:border-none print:p-0 print:bg-white print:text-black ${
            layout === "webtoon_strip"
              ? "w-full max-w-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl"
              : layout === "storyboard_sheet"
              ? "w-full max-w-6xl bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl"
              : paperTheme === "dark"
              ? "w-full max-w-5xl bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-2xl p-6 shadow-2xl print:bg-white print:text-black print:border-black"
              : "w-full max-w-5xl bg-white text-black border-4 border-black p-6 shadow-[0_25px_70px_rgba(0,0,0,0.85)]"
          }`}
        >
          {/* Comic Page Header Banner */}
          <div
            className={`flex items-baseline justify-between pb-3 mb-5 ${
              layout === "storyboard_sheet" || layout === "webtoon_strip" || paperTheme === "dark"
                ? "border-b border-zinc-800 text-zinc-100"
                : "border-b-4 border-black text-black"
            }`}
          >
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight">{project.title}</h1>
              <p className="text-xs opacity-70 mt-0.5">{project.synopsis}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 border-2 border-current">
                {project.styleBible.artStyle}
              </span>
            </div>
          </div>

          {/* Panels Grid */}
          <div
            className={
              layout === "webtoon_strip"
                ? "flex flex-col gap-6"
                : layout === "storyboard_sheet"
                ? "grid grid-cols-1 md:grid-cols-3 gap-6"
                : layout === "classic_grid"
                ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                : "grid grid-cols-1 md:grid-cols-6 gap-3.5"
            }
          >
            {project.beats.map((beat, idx) => {
              // In manga_dynamic layout, panel 0 spans full width (hero banner), subsequent panels form balanced pairs
              const spanClass =
                layout === "manga_dynamic"
                  ? idx % 5 === 0
                    ? "md:col-span-6 aspect-[21/9]"
                    : "md:col-span-3 aspect-video"
                  : "aspect-video";

              return (
                <div
                  key={beat.id}
                  onClick={() => {
                    if (onSelectScene) {
                      onSelectScene(idx);
                      onClose();
                    }
                  }}
                  title="Click panel to jump to this scene in the Studio Editor"
                  className={`group relative overflow-hidden cursor-pointer print:break-inside-avoid print:page-break-inside-avoid print:shadow-none ${
                    layout === "storyboard_sheet"
                      ? "rounded-xl border border-zinc-700 bg-zinc-950 flex flex-col"
                      : paperTheme === "dark"
                      ? `${spanClass} rounded-xl border border-zinc-800 bg-black shadow-lg`
                      : `${spanClass} border-[3.5px] border-black bg-black shadow-[4px_4px_0px_rgba(0,0,0,1)]`
                  }`}
                >
                  <div className={layout === "storyboard_sheet" ? "relative aspect-video w-full overflow-hidden" : "relative w-full h-full"}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={beat.currentImageUrl}
                      alt={beat.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />

                    {/* Panel Number Badge (Positioned at bottom-left corner so it never collides with top narration) */}
                    <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 bg-black/85 backdrop-blur-sm text-amber-400 font-black text-[10px] uppercase border border-amber-500/40 rounded shadow-md pointer-events-none">
                      Panel #{idx + 1} • {beat.title}
                    </div>

                    {/* Speech Bubbles & Captions Overlay */}
                    {showBubbles && (
                      <div className="absolute inset-0 pointer-events-none">
                        {beat.captions.map((cap) => {
                          const isNarration = cap.type === "narration";
                          return (
                            <div
                              key={cap.id}
                              style={
                                isNarration
                                  ? {
                                      left: `${Math.max(22, Math.min(78, cap.xPercent))}%`,
                                      top: "14px",
                                    }
                                  : {
                                      left: `${Math.max(18, Math.min(82, cap.xPercent))}%`,
                                      top: `${Math.max(24, Math.min(76, cap.yPercent))}%`,
                                    }
                              }
                              className={`absolute transform -translate-x-1/2 ${
                                isNarration ? "translate-y-0" : "-translate-y-1/2"
                              }`}
                            >
                              {cap.type === "narration" ? (
                                <div className="bg-amber-100 text-black font-black text-[9px] sm:text-[10px] px-2.5 py-1 uppercase tracking-wide border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] max-w-[240px] leading-snug">
                                  {cap.text}
                                </div>
                              ) : cap.type === "sfx" ? (
                                <div className="font-black italic text-xl tracking-tighter text-amber-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase">
                                  {cap.text}
                                </div>
                              ) : cap.type === "thought" ? (
                                <div className="bg-sky-50 text-black text-[9px] sm:text-[10px] italic font-bold px-3 py-1.5 rounded-full border-2 border-dashed border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] max-w-[190px]">
                                  {cap.speaker && <span className="block text-[8px] uppercase text-zinc-500 not-italic">{cap.speaker} (thinks):</span>}
                                  {cap.text}
                                </div>
                              ) : (
                                <div className="bg-white text-black text-[9px] sm:text-[10px] font-bold px-2.5 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] max-w-[190px]">
                                  {cap.speaker && (
                                    <span className="block text-[8px] text-zinc-600 uppercase font-black">
                                      {cap.speaker}:
                                    </span>
                                  )}
                                  <p className="leading-tight">{cap.text}</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Storyboard Contact Sheet Metadata Footer (WonderUnit Storyboarder style) */}
                  {layout === "storyboard_sheet" && (
                    <div className="p-3 bg-zinc-950 text-zinc-300 space-y-1.5 border-t border-zinc-800">
                      <div className="flex items-center justify-between text-[11px] font-bold text-white">
                        <span>Scene {idx + 1}: {beat.title}</span>
                        <span className="font-mono text-amber-400">{beat.durationSeconds}s</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2">{beat.userPromptDescription}</p>
                      {beat.synthesizedPrompt && (
                        <p className="text-[9px] font-mono text-zinc-500 truncate">{beat.synthesizedPrompt}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
