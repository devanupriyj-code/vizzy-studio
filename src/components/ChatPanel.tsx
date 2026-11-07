"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, StoryBeat } from "@/types";
import { ArrowUp, RotateCcw } from "lucide-react";

interface ChatPanelProps {
  messages: ChatMessage[];
  currentBeat: StoryBeat;
  onSendMessage: (text: string) => void;
  onRerollCurrent: () => void;
  onSelectVersion: (imageUrl: string) => void;
  isLoading: boolean;
}

function cleanText(raw: string): string {
  return raw.replace(/\*\*/g, "").replace(/(^|\s)_([^_]+)_(\s|$)/g, "$1$2$3");
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  currentBeat,
  onSendMessage,
  onRerollCurrent,
  isLoading
}) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentBeat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800/90 w-full lg:max-w-[360px] flex-shrink-0">
      {/* Scene Header */}
      <div className="h-10 px-4 border-b border-zinc-800/80 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-200 truncate pr-2">
          Scene {currentBeat.sequenceIndex}: {currentBeat.title}
        </span>

        <button
          onClick={onRerollCurrent}
          disabled={isLoading}
          className="flex items-center gap-1 px-2 py-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 text-[11px] transition-colors cursor-pointer disabled:opacity-50 flex-shrink-0"
          title="Redraw scene"
        >
          <RotateCcw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
          <span>Redraw</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`px-3 py-2.5 rounded-lg max-w-[94%] leading-relaxed ${
                msg.sender === "user"
                  ? "bg-zinc-800 text-zinc-100"
                  : "bg-zinc-900/60 text-zinc-300 border border-zinc-800/80"
              }`}
            >
              <p className="whitespace-pre-wrap">{cleanText(msg.text)}</p>

              {msg.sceneImagePreview && (
                <div className="mt-2.5 overflow-hidden rounded border border-zinc-800 aspect-video bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={msg.sceneImagePreview}
                    alt="Scene preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {msg.suggestedActions && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {msg.suggestedActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => onSendMessage(action)}
                    className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-[11px] transition-colors cursor-pointer"
                  >
                    {action.replace(/^[✅▶⬅]+\s*/, "")}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-zinc-800/80 bg-zinc-950">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe a change to this scene..."
            disabled={isLoading}
            className="w-full pl-3 pr-9 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="absolute right-1.5 p-1 rounded bg-zinc-200 hover:bg-white text-zinc-950 transition-colors disabled:opacity-25 cursor-pointer"
            title="Apply change"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
