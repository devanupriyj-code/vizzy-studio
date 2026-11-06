"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, Sparkles } from "lucide-react";

interface SweetBunnyProps {
  currentProjectTitle?: string;
  activeSceneTitle?: string;
  isModalOpen?: boolean;
}

interface BunnyMessage {
  id: string;
  sender: "user" | "bunny";
  text: string;
}

export const SweetBunny: React.FC<SweetBunnyProps> = ({
  currentProjectTitle,
  activeSceneTitle,
  isModalOpen = false,
}) => {
  // Screen wandering coordinates in percentages (0-100)
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 88, y: 80 });
  const [isHopping, setIsHopping] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);
  const [isWandering, setIsWandering] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [bubbleHint, setBubbleHint] = useState<string | null>("Hi! Tap me for help ~");

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; posX: number; posY: number; hasMoved: boolean }>({
    clientX: 0,
    clientY: 0,
    posX: 88,
    posY: 80,
    hasMoved: false,
  });

  const [messages, setMessages] = useState<BunnyMessage[]>([
    {
      id: "b-hello",
      sender: "bunny",
      text: "Hi there! I'm your studio bunny companion. Ask me anything about creating scenes, locking characters, writing dialogues, or editing panels!",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Freeze current coordinates when mouse moves close/over the bunny so it stays put
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    setIsHovered(false);
  };

  // Global proximity detector: if mouse comes within 90px of bunny, stop wandering so it won't glide away
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || isDraggingRef.current || isOpen) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      if (distance < 110) {
        if (!isHoveredRef.current) {
          isHoveredRef.current = true;
          setIsHovered(true);
        }
      } else if (distance > 160 && isHoveredRef.current) {
        isHoveredRef.current = false;
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [isOpen]);

  // Wandering loop when not opened in chat, not hovered, and not being dragged
  useEffect(() => {
    if (!isWandering || isOpen || isDragging || isHovered) return;

    const wanderStep = () => {
      if (isHoveredRef.current || isDraggingRef.current) return;

      // Pick next coordinate across the screen (12% to 88% width, 18% to 84% height)
      const nextX = Math.floor(Math.random() * 76) + 12;
      const nextY = Math.floor(Math.random() * 66) + 18;

      setFacingLeft(nextX < pos.x);
      setIsHopping(true);
      setPos({ x: nextX, y: nextY });

      // Occasional gentle tips
      const tips = [
        "Need help designing a character?",
        "Tap me if you get stuck!",
        "You can drag speech bubbles anywhere on the canvas!",
        "Double click a speech bubble to rewrite it ~",
        "Try 'Region AI Edit' in the top bar to paint with Gemini!",
      ];
      if (Math.random() > 0.65) {
        setBubbleHint(tips[Math.floor(Math.random() * tips.length)]);
      }

      setTimeout(() => {
        setIsHopping(false);
      }, 5000);
    };

    // Run first step after 2.5 seconds
    const initialTimer = setTimeout(wanderStep, 2500);
    // Then glide gently to new locations every 8 seconds
    const interval = setInterval(wanderStep, 8000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isWandering, isOpen, isDragging, isHovered, pos.x]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      posX: pos.x,
      posY: pos.y,
      hasMoved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragStartRef.current.hasMoved = true;
    }

    if (dragStartRef.current.hasMoved) {
      const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
      const windowHeight = typeof window !== "undefined" ? window.innerHeight : 800;

      const deltaXPercent = (dx / windowWidth) * 100;
      const deltaYPercent = (dy / windowHeight) * 100;

      const nextX = Math.max(5, Math.min(95, dragStartRef.current.posX + deltaXPercent));
      const nextY = Math.max(5, Math.min(95, dragStartRef.current.posY + deltaYPercent));

      setFacingLeft(dx < 0);
      setPos({ x: nextX, y: nextY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      isDraggingRef.current = false;
      setIsDragging(false);
      // If it was just a click (not a drag), toggle the chat
      if (!dragStartRef.current.hasMoved) {
        setIsOpen(!isOpen);
        setBubbleHint(null);
      }
    }
  };

  const handleAskBunny = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || isThinking) return;

    const userMsg: BunnyMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    try {
      // Quick intelligent helper rules + context-aware answers
      const lower = query.toLowerCase();
      let reply = "";

      if (lower.includes("character") || lower.includes("cast") || lower.includes("hair") || lower.includes("face")) {
        reply = "To customize characters, click 'Cast & Style' in the top header. You can pick hairstyles, edit scars and clothing, or click 'Generate New Look' to cycle presets. Once set, their traits lock across all scenes!";
      } else if (lower.includes("bubble") || lower.includes("dialogue") || lower.includes("text") || lower.includes("speech")) {
        reply = "In Comic mode, click '+ Add Speech Bubble' at the bottom right of the canvas. You can drag bubbles anywhere on the image, double-click to rewrite the text, or hover and click (x) to remove them.";
      } else if (lower.includes("edit") || lower.includes("region") || lower.includes("inpaint") || lower.includes("brush") || lower.includes("filter")) {
        reply = "Look at the top canvas bar! You have three instant tools:\n• Region AI Edit: Select any box on the image and describe what to add (e.g. /portal, /dragon)\n• Draw: Freehand brush and annotations\n• Filters: Color grading sliders (Noir, Neon, Sunset)";
      } else if (lower.includes("new storyboard") || lower.includes("create") || lower.includes("project")) {
        reply = "Click 'Projects' in the top bar, then click 'New Storyboard'. Paste your script or choose one of our sample scripts, pick how many scenes you want, and Vizzy will split and illustrate it scene by scene!";
      } else if (lower.includes("export") || lower.includes("pdf") || lower.includes("slideshow")) {
        reply = "Click 'Comic Page' in the top header to see full comic book layouts (Grid, Webtoon, Storyboard) with Print & PDF export. Or click 'Slideshow' to play through your scenes with auto voiceover!";
      } else {
        reply = `I'm here to help with your project! You're currently on "${currentProjectTitle || "Storyboard"}" ${activeSceneTitle ? `(${activeSceneTitle})` : ""}. You can ask me how to edit images, add characters, export PDF, or format dialogue bubbles!`;
      }

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `b-${Date.now()}`,
            sender: "bunny",
            text: reply,
          },
        ]);
        setIsThinking(false);
      }, 400);
    } catch {
      setIsThinking(false);
    }
  };

  return (
    <>
      {/* Floating Animated Bunny */}
      <div
        ref={containerRef}
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          transition: isDragging || isHovered ? "none" : "all 5.2s cubic-bezier(0.4, 0, 0.2, 1)",
          touchAction: "none",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`fixed select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"} group ${isModalOpen ? "z-[60]" : "z-40"}`}
        title="Drag me anywhere or click to chat!"
      >
        {/* Soft speech bubble hint floating above bunny (always unmirrored and clamped within viewport) */}
        {bubbleHint && !isOpen && (
          <div
            className={`absolute -top-10 whitespace-nowrap px-2.5 py-1 rounded-full bg-white text-zinc-900 border border-zinc-200 text-[11px] font-medium shadow-lg pointer-events-none animate-bounce ${
              pos.x > 80
                ? "right-0 translate-x-0"
                : pos.x < 20
                ? "left-0 translate-x-0"
                : "left-1/2 -translate-x-1/2"
            }`}
          >
            {bubbleHint}
            <div
              className={`absolute -bottom-1 w-2 h-2 bg-white rotate-45 border-r border-b border-zinc-200 ${
                pos.x > 80 ? "right-6" : pos.x < 20 ? "left-6" : "left-1/2 -translate-x-1/2"
              }`}
            />
          </div>
        )}

        {/* SVG Sweet Bunny Illustration (mirrored separately so speech bubble stays readable) */}
        <div
          style={{
            transform: `translate(-50%, -50%) ${facingLeft ? "scaleX(-1)" : "scaleX(1)"}`,
          }}
          className="relative w-14 h-14 filter drop-shadow-md transition-transform duration-700 group-hover:scale-110"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Left Ear */}
            <ellipse
              cx="38"
              cy="25"
              rx="9"
              ry="22"
              fill="#ffffff"
              stroke="#e4e4e7"
              strokeWidth="2.5"
              transform="rotate(-12 38 25)"
            />
            <ellipse
              cx="38"
              cy="25"
              rx="5"
              ry="16"
              fill="#fbcfe8"
              transform="rotate(-12 38 25)"
            />

            {/* Right Ear */}
            <ellipse
              cx="62"
              cy="25"
              rx="9"
              ry="22"
              fill="#ffffff"
              stroke="#e4e4e7"
              strokeWidth="2.5"
              transform="rotate(12 62 25)"
            />
            <ellipse
              cx="62"
              cy="25"
              rx="5"
              ry="16"
              fill="#fbcfe8"
              transform="rotate(12 62 25)"
            />

            {/* Body */}
            <ellipse cx="50" cy="72" rx="24" ry="20" fill="#ffffff" stroke="#e4e4e7" strokeWidth="2.5" />
            <circle cx="28" cy="78" r="6" fill="#ffffff" stroke="#e4e4e7" strokeWidth="2" /> {/* Fluffy tail */}

            {/* Head */}
            <circle cx="50" cy="50" r="22" fill="#ffffff" stroke="#e4e4e7" strokeWidth="2.5" />

            {/* Cheeks */}
            <circle cx="37" cy="56" r="4.5" fill="#fbcfe8" opacity="0.75" />
            <circle cx="63" cy="56" r="4.5" fill="#fbcfe8" opacity="0.75" />

            {/* Eyes */}
            <ellipse cx="42" cy="48" rx="2.5" ry="3.5" fill="#18181b" />
            <circle cx="43" cy="47" r="1" fill="#ffffff" />
            <ellipse cx="58" cy="48" rx="2.5" ry="3.5" fill="#18181b" />
            <circle cx="59" cy="47" r="1" fill="#ffffff" />

            {/* Nose & Mouth */}
            <polygon points="50,54 48,52 52,52" fill="#f472b6" />
            <path
              d="M48,55 Q50,57 52,55"
              fill="none"
              stroke="#71717a"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Little Hands */}
            <ellipse cx="44" cy="68" rx="4" ry="5" fill="#f4f4f5" />
            <ellipse cx="56" cy="68" rx="4" ry="5" fill="#f4f4f5" />
          </svg>
        </div>
      </div>

      {/* Small Chat Modal when Clicked */}
      {isOpen && (
        <div
          style={{
            right: "24px",
            bottom: "24px",
          }}
          className="fixed z-50 w-80 sm:w-96 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-xs">
                🐰
              </div>
              <div>
                <h3 className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                  Studio Bunny Guide
                  <Sparkles className="w-3 h-3 text-pink-400" />
                </h3>
                <p className="text-[10px] text-zinc-400">Ask how to use any tool or feature</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsWandering(!isWandering)}
                className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  isWandering
                    ? "bg-zinc-800 border-zinc-700 text-zinc-300"
                    : "bg-zinc-900 border-zinc-800 text-zinc-500"
                }`}
                title="Toggle screen roaming"
              >
                {isWandering ? "Roaming: ON" : "Roaming: OFF"}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick FAQ prompts */}
          <div className="px-3 py-2 border-b border-zinc-800/80 bg-zinc-900/30 flex gap-1.5 overflow-x-auto no-scrollbar">
            {[
              "How to edit images?",
              "Customize character",
              "Dialogue bubbles",
              "Export to PDF",
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setInput(chip);
                  handleAskBunny();
                }}
                className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 hover:text-white whitespace-nowrap cursor-pointer transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat message list */}
          <div className="p-3.5 overflow-y-auto max-h-72 min-h-48 space-y-2.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                    m.sender === "user"
                      ? "bg-zinc-100 text-zinc-950 font-medium"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-200"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
                  <span>Bunny is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleAskBunny}
            className="p-2.5 border-t border-zinc-800 bg-zinc-900/50 flex items-center gap-1.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the bunny anything about Vizzy..."
              className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="p-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 disabled:opacity-40 cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
