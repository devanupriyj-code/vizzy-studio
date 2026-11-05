"use client";

import React, { useState, useEffect } from "react";
import { StoryBeat, Project } from "@/types";
import { X, Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { getSafetyMirrorImage } from "@/lib/image-gen";

interface SlideshowModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const SlideshowModal: React.FC<SlideshowModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const activeBeat = project.beats[currentIndex];
  const slideDurationMs = Math.max((activeBeat?.durationSeconds || 4) * 1000, 5000);

  // Voiceover synthesis (Clapper / Storyboarder TTS narration & dialogue)
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (!isOpen || !isPlaying || !voiceEnabled || !activeBeat) {
      window.speechSynthesis.cancel();
      return;
    }

    window.speechSynthesis.cancel();
    const lines: string[] = [];
    if (activeBeat.subtitleText) {
      lines.push(activeBeat.subtitleText);
    } else if (activeBeat.captions.length > 0) {
      activeBeat.captions.forEach((c) => {
        if (c.speaker && c.type === "speech") {
          lines.push(`${c.speaker} says: ${c.text}`);
        } else {
          lines.push(c.text);
        }
      });
    } else {
      lines.push(activeBeat.userPromptDescription);
    }

    const utterance = new SpeechSynthesisUtterance(lines.join(". "));
    utterance.rate = 1.02;
    utterance.pitch = 0.96;
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [isOpen, isPlaying, voiceEnabled, currentIndex, activeBeat]);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    setProgress(0);
    const intervalTime = 50;
    const step = (intervalTime / slideDurationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((curr) => (curr + 1) % project.beats.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, currentIndex, slideDurationMs, project.beats.length]);

  if (!isOpen || !activeBeat) return null;

  const nextSlide = () => {
    setCurrentIndex((curr) => (curr + 1) % project.beats.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentIndex((curr) => (curr - 1 + project.beats.length) % project.beats.length);
    setProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between text-white select-none animate-in fade-in duration-300">
      {/* Top Controls Bar */}
      <div className="absolute top-0 inset-x-0 p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 via-black/30 to-transparent">
        <div>
          <h3 className="text-sm font-extrabold tracking-wider uppercase text-amber-400">
            {project.title}
          </h3>
          <p className="text-xs text-zinc-400 font-medium">
            Scene {currentIndex + 1} of {project.beats.length} — {activeBeat.title}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setVoiceEnabled((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-bold transition-colors cursor-pointer ${
              voiceEnabled
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-black/60 text-zinc-400 hover:text-white"
            }`}
            title="Toggle AI Voiceover Narration"
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{voiceEnabled ? "Voiceover On" : "Voiceover Muted"}</span>
          </button>
          <button
            onClick={() => setCurrentIndex(0)}
            className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-zinc-300 hover:text-white backdrop-blur-md transition-colors cursor-pointer"
            title="Restart from Beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-zinc-300 hover:text-white backdrop-blur-md transition-colors cursor-pointer"
            title="Exit Slideshow (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slideshow Stage with Ken Burns Zoom Effect */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden bg-black">
        {project.beats.map((beat, idx) => {
          const isVisible = idx === currentIndex;
          const imgUrl = beat.currentImageUrl || getSafetyMirrorImage(project.styleBible.artStyle, idx);

          return (
            <div
              key={beat.id}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
                isVisible ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div
                className={`w-full h-full transform transition-transform duration-[6000ms] ease-out ${
                  isVisible ? "scale-105 translate-x-1 translate-y-0.5" : "scale-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={beat.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Comic Bubbles & Narration */}
              <div className="absolute inset-0 pointer-events-none">
                {beat.captions.map((cap) => (
                  <div
                    key={cap.id}
                    style={{
                      left: `${cap.xPercent}%`,
                      top: `${cap.yPercent}%`
                    }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl"
                  >
                    {cap.type === "narration" ? (
                      <div className="bg-amber-100 text-black font-black text-xs px-3.5 py-1.5 uppercase tracking-wide border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] max-w-sm">
                        {cap.text}
                      </div>
                    ) : cap.type === "sfx" ? (
                      <div className="font-black italic text-4xl tracking-tighter text-amber-400 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] uppercase">
                        {cap.text}
                      </div>
                    ) : (
                      <div className="bg-white text-black text-xs font-bold px-4 py-2.5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] max-w-xs">
                        {cap.speaker && (
                          <span className="block text-[10px] text-zinc-600 uppercase font-black tracking-wider mb-0.5">
                            {cap.speaker}:
                          </span>
                        )}
                        <p className="leading-snug">{cap.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Cinematic Subtitle Bar */}
              <div className="absolute bottom-16 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-4 px-12 text-center pointer-events-none">
                <p className="text-zinc-200 text-base font-serif italic max-w-3xl mx-auto drop-shadow-md">
                  &ldquo;{beat.subtitleText || beat.captions[0]?.text || beat.userPromptDescription}&rdquo;
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Transport Bar */}
      <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex flex-col gap-2">
        <div className="w-full bg-zinc-800/80 h-1 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={nextSlide}
              className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            {project.beats.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentIndex(i);
                  setProgress(0);
                }}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  i === currentIndex ? "w-6 bg-amber-500" : "bg-zinc-700 hover:bg-zinc-500"
                }`}
              />
            ))}
          </div>

          <div className="text-xs text-zinc-400 font-mono">
            {currentIndex + 1} / {project.beats.length}
          </div>
        </div>
      </div>
    </div>
  );
};
