"use client";

import React, { useState, useRef, useEffect } from "react";
import { StoryBeat, CaptionOverlay } from "@/types";
import {
  MessageSquare,
  Plus,
  Check,
  Loader2,
  RefreshCw,
  Sliders,
  Brush,
  Crop,
  Upload,
  Undo2,
  Trash2,
  X
} from "lucide-react";
import { getSafetyMirrorImage } from "@/lib/image-gen";

interface CanvasStageProps {
  currentBeat: StoryBeat;
  displayMode: "comic" | "cinematic";
  aspectRatio: string;
  artStyle: string;
  defaultSpeaker?: string;
  onUpdateCaptions: (captions: CaptionOverlay[]) => void;
  onSelectVersionUrl: (url: string) => void;
  onToggleLockBeat: () => void;
  onQuickDirectLayer?: (directive: string) => void;
  onAddEditedVersion?: (imageUrl: string, editLabel: string) => void;
}

interface DrawStroke {
  color: string;
  size: number;
  points: { x: number; y: number }[];
}

interface MaskBox {
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
}

const SLASH_PRESETS = [
  { cmd: "/portal", prompt: "Add a glowing dimensional portal vortex with arcane energy" },
  { cmd: "/dragon", prompt: "Add a fierce winged dragon silhouette in the background sky" },
  { cmd: "/helicopter", prompt: "Add a tactical search helicopter with a spotlight beam overhead" },
  { cmd: "/drone", prompt: "Add a hovering security drone with a red scanning laser" },
  { cmd: "/explosion", prompt: "Add a fiery explosion blast with flying sparks" },
  { cmd: "/lightning", prompt: "Add a bright fork of electric lightning striking from the sky" },
  { cmd: "/magic-circle", prompt: "Add a glowing geometric magic circle aura" },
  { cmd: "/car", prompt: "Add a sleek red cyber sports car on the street" }
];

const FILTER_PRESETS = [
  { name: "Default", brightness: 100, contrast: 100, saturate: 100, sepia: 0, hue: 0, blur: 0 },
  { name: "Noir B&W", brightness: 105, contrast: 135, saturate: 0, sepia: 10, hue: 0, blur: 0 },
  { name: "Cyber Neon", brightness: 105, contrast: 120, saturate: 155, sepia: 0, hue: -15, blur: 0 },
  { name: "Warm Sunset", brightness: 105, contrast: 110, saturate: 125, sepia: 35, hue: -10, blur: 0 },
  { name: "Cold Blueprint", brightness: 100, contrast: 115, saturate: 120, sepia: 0, hue: 185, blur: 0 },
  { name: "Vintage Film", brightness: 95, contrast: 110, saturate: 80, sepia: 50, hue: 0, blur: 0 }
];

const DIRECTOR_GROUPS = [
  {
    label: "Emotion",
    items: [
      { label: "Determined", val: "determined expression" },
      { label: "Angry", val: "angry fierce expression" },
      { label: "Shocked", val: "shocked expression" },
      { label: "Happy", val: "happy laughing expression" },
      { label: "Sad", val: "sad crying expression" },
      { label: "Wink", val: "wink expression" },
      { label: "Smirk", val: "smirk confident expression" },
      { label: "Worried", val: "worried nervous expression" }
    ]
  },
  {
    label: "Pose",
    items: [
      { label: "Stand", val: "standing pose" },
      { label: "Action", val: "action fight pose" },
      { label: "Crossed arms", val: "crossed_arms pose" },
      { label: "Thumbs up", val: "thumbs_up pose" },
      { label: "Thinking", val: "thinking pose" },
      { label: "Pointing", val: "pointing pose" },
      { label: "Blade ready", val: "blade_ready pose" },
      { label: "Aiming", val: "aiming pose" }
    ]
  },
  {
    label: "Camera",
    items: [
      { label: "Wide", val: "wide camera shot" },
      { label: "Medium", val: "medium camera shot" },
      { label: "Close-up", val: "closeup face shot" },
      { label: "Low angle", val: "low_angle camera shot" }
    ]
  },
  {
    label: "Atmosphere",
    items: [
      { label: "Rain", val: "rain weather" },
      { label: "Storm", val: "heavy_rain sparks" },
      { label: "Fog", val: "fog mist" },
      { label: "Snow", val: "snow blizzard" },
      { label: "Embers", val: "embers fire" },
      { label: "Sparks", val: "sparks voltage" },
      { label: "Lasers", val: "lasers drones" },
      { label: "Explosion", val: "explosion blast" }
    ]
  }
];

export const CanvasStage: React.FC<CanvasStageProps> = ({
  currentBeat,
  displayMode,
  artStyle,
  defaultSpeaker = "Narrator",
  onUpdateCaptions,
  onSelectVersionUrl,
  onToggleLockBeat,
  onQuickDirectLayer,
  onAddEditedVersion
}) => {
  const [newSpeechText, setNewSpeechText] = useState("");
  const [speakerName, setSpeakerName] = useState(defaultSpeaker);

  // Keep speaker name synced when active cast changes
  useEffect(() => {
    if (defaultSpeaker && defaultSpeaker !== "Narrator") {
      setSpeakerName(defaultSpeaker);
    }
  }, [defaultSpeaker]);
  const [bubbleType, setBubbleType] = useState<CaptionOverlay["type"]>("speech");
  const [activeDirectorTab, setActiveDirectorTab] = useState<string>("Emotion");
  const [isAddingBubble, setIsAddingBubble] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const isDataUri = Boolean(currentBeat.currentImageUrl?.startsWith("data:"));
  const [isImageLoading, setIsImageLoading] = useState(Boolean(currentBeat.currentImageUrl) && !isDataUri);
  const [retryCount, setRetryCount] = useState(0);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Image Editor Studio state (inspired by gemini-image-editing-nextjs-quickstart, IOPaint & filerobot-image-editor)
  const [editorMode, setEditorMode] = useState<"none" | "ai-inpaint" | "draw" | "adjust" | "upload">("none");
  const [inpaintPrompt, setInpaintPrompt] = useState("");
  const [isAiEditing, setIsAiEditing] = useState(false);
  const [maskBox, setMaskBox] = useState<MaskBox | null>(null);
  const [maskDragStart, setMaskDragStart] = useState<{ x: number; y: number } | null>(null);

  // Freehand Drawing state
  const [strokes, setStrokes] = useState<DrawStroke[]>([]);
  const [activeStroke, setActiveStroke] = useState<DrawStroke | null>(null);
  const [brushColor, setBrushColor] = useState("#38bdf8");
  const [brushSize, setBrushSize] = useState(5);

  // Color / Filter Grading state
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [sepia, setSepia] = useState(0);
  const [hue, setHue] = useState(0);
  const [blur, setBlur] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStrokes([]);
    setMaskBox(null);
  }, [currentBeat.id, currentBeat.currentImageUrl]);

  const cssFilterString =
    brightness !== 100 || contrast !== 100 || saturate !== 100 || sepia !== 0 || hue !== 0 || blur !== 0
      ? `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) sepia(${sepia}%) hue-rotate(${hue}deg) blur(${blur}px)`
      : "none";

  const bakeCanvasToVersion = (label: string) => {
    const imgEl = stageRef.current?.querySelector("img.scene-main-img") as HTMLImageElement | null;
    if (!imgEl || !onAddEditedVersion) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.filter = cssFilterString;
    ctx.drawImage(imgEl, 0, 0, 1280, 720);
    ctx.filter = "none";

    // Draw freehand strokes on top
    for (const s of strokes) {
      if (s.points.length < 2) continue;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.size * 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo((s.points[0].x / 100) * 1280, (s.points[0].y / 100) * 720);
      for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo((s.points[i].x / 100) * 1280, (s.points[i].y / 100) * 720);
      }
      ctx.stroke();
    }

    const dataUri = canvas.toDataURL("image/png");
    onAddEditedVersion(dataUri, label);
    setStrokes([]);
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
    setSepia(0);
    setHue(0);
    setBlur(0);
  };

  const handleRunAiImageEdit = async (overridePrompt?: string) => {
    const rawPrompt = (overridePrompt ?? inpaintPrompt).trim();
    if (!rawPrompt || isAiEditing) return;

    const matchedSlash = SLASH_PRESETS.find((s) => s.cmd === rawPrompt.toLowerCase());
    const finalPrompt = matchedSlash ? matchedSlash.prompt : rawPrompt;

    setIsAiEditing(true);
    try {
      const res = await fetch("/api/ai-image-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: finalPrompt,
          currentImageUrl: currentDisplayUrl,
          maskRegion: maskBox || undefined,
          sceneTitle: currentBeat.title,
          sceneDescription: currentBeat.userPromptDescription,
          artStyle
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.editedImageUrl && onAddEditedVersion) {
          onAddEditedVersion(data.editedImageUrl, finalPrompt);
        } else if (data.engineDirective && onQuickDirectLayer) {
          onQuickDirectLayer(data.engineDirective);
        }
        setInpaintPrompt("");
        setMaskBox(null);
      }
    } finally {
      setIsAiEditing(false);
    }
  };

  const handleStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    if (editorMode === "ai-inpaint") {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      setMaskDragStart({ x, y });
      setMaskBox({ xPercent: x, yPercent: y, widthPercent: 1, heightPercent: 1 });
    } else if (editorMode === "draw") {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      setActiveStroke({ color: brushColor, size: brushSize, points: [{ x, y }] });
    }
  };

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    if (editorMode === "ai-inpaint" && maskDragStart) {
      const left = Math.min(maskDragStart.x, x);
      const top = Math.min(maskDragStart.y, y);
      const width = Math.max(4, Math.abs(x - maskDragStart.x));
      const height = Math.max(4, Math.abs(y - maskDragStart.y));
      setMaskBox({ xPercent: left, yPercent: top, widthPercent: width, heightPercent: height });
    } else if (editorMode === "draw" && activeStroke) {
      setActiveStroke({
        ...activeStroke,
        points: [...activeStroke.points, { x, y }]
      });
    }
  };

  const handleStagePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (editorMode === "ai-inpaint" && maskDragStart) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setMaskDragStart(null);
    } else if (editorMode === "draw" && activeStroke) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      if (activeStroke.points.length > 1) {
        setStrokes((prev) => [...prev, activeStroke]);
      }
      setActiveStroke(null);
    }
  };

  const handleUploadImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onAddEditedVersion) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onAddEditedVersion(reader.result, `Uploaded ${file.name}`);
        setEditorMode("none");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBubblePointerDown = (e: React.PointerEvent<HTMLDivElement>, capId: string) => {
    if ((e.target as HTMLElement).tagName === "BUTTON" || (e.target as HTMLElement).tagName === "INPUT") return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingId(capId);
  };

  const handleBubblePointerMove = (e: React.PointerEvent<HTMLDivElement>, capId: string) => {
    if (draggingId !== capId || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const xPercent = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
    const yPercent = Math.max(8, Math.min(92, ((e.clientY - rect.top) / rect.height) * 100));
    onUpdateCaptions(
      currentBeat.captions.map((c) => (c.id === capId ? { ...c, xPercent, yPercent } : c))
    );
  };

  const handleBubblePointerUp = (e: React.PointerEvent<HTMLDivElement>, capId: string) => {
    if (draggingId === capId) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setDraggingId(null);
    }
  };

  const updateCaptionText = (capId: string, newText: string) => {
    onUpdateCaptions(
      currentBeat.captions.map((c) => (c.id === capId ? { ...c, text: newText } : c))
    );
  };

  const handleAddBubble = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpeechText.trim()) return;

    const newCap: CaptionOverlay = {
      id: `cap-${Date.now()}`,
      type: bubbleType,
      speaker: bubbleType === "narration" || bubbleType === "sfx" ? undefined : speakerName,
      text: newSpeechText.trim(),
      xPercent: 25 + Math.random() * 40,
      yPercent: bubbleType === "narration" ? 12 : 30 + Math.random() * 30
    };

    onUpdateCaptions([...currentBeat.captions, newCap]);
    setNewSpeechText("");
    setIsAddingBubble(false);
  };

  const removeCaption = (id: string) => {
    onUpdateCaptions(currentBeat.captions.filter((c) => c.id !== id));
  };

  const baseUrl =
    currentBeat.currentImageUrl ||
    getSafetyMirrorImage(artStyle, currentBeat.sequenceIndex - 1);

  const currentDisplayUrl =
    retryCount > 0 && baseUrl.startsWith("/api/image")
      ? `${baseUrl}&retry=${retryCount}`
      : baseUrl;

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 overflow-hidden relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUploadImageFile}
        className="hidden"
      />

      {/* Top Canvas Controls Bar */}
      <div className="h-10 border-b border-zinc-800/80 bg-zinc-950 px-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5 text-xs min-w-0">
          <span className="text-zinc-200 font-medium flex-shrink-0">
            Scene {currentBeat.sequenceIndex}
          </span>
          {currentBeat.synthesizedPrompt && (
            <>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-500 text-[11px] truncate max-w-xs" title={currentBeat.synthesizedPrompt}>
                {currentBeat.synthesizedPrompt}
              </span>
            </>
          )}
        </div>

        {/* Image Editor Tools + Version History & Approval */}
        <div className="flex items-center gap-1.5">
          {/* Image Editor Mode Switcher */}
          <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 rounded-md p-0.5 mr-1">
            <button
              onClick={() => setEditorMode(editorMode === "ai-inpaint" ? "none" : "ai-inpaint")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                editorMode === "ai-inpaint"
                  ? "bg-zinc-200 text-zinc-950"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Select a region on the canvas and edit with Gemini AI"
            >
              <Crop className="w-3 h-3" />
              <span>Region AI Edit</span>
            </button>
            <button
              onClick={() => setEditorMode(editorMode === "draw" ? "none" : "draw")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                editorMode === "draw"
                  ? "bg-zinc-200 text-zinc-950"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Freehand brush & annotation on the frame"
            >
              <Brush className="w-3 h-3" />
              <span>Draw</span>
            </button>
            <button
              onClick={() => setEditorMode(editorMode === "adjust" ? "none" : "adjust")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                editorMode === "adjust"
                  ? "bg-zinc-200 text-zinc-950"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Color grading & filters"
            >
              <Sliders className="w-3 h-3" />
              <span>Filters</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              title="Upload custom image for this frame"
            >
              <Upload className="w-3 h-3" />
              <span>Upload</span>
            </button>
          </div>

          {currentBeat.versionHistory && currentBeat.versionHistory.length > 1 && (
            <div className="flex items-center gap-1 mr-1">
              {currentBeat.versionHistory.map((ver, idx) => {
                const isSelected = currentBeat.currentImageUrl === ver.imageUrl;
                return (
                  <button
                    key={ver.id}
                    onClick={() => {
                      setImageLoadError(false);
                      onSelectVersionUrl(ver.imageUrl);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-zinc-200 text-zinc-950"
                        : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    }`}
                    title={ver.editRequest ? ver.editRequest : `Version ${idx + 1}`}
                  >
                    v{idx + 1}
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={onToggleLockBeat}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              currentBeat.isLocked
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300"
            }`}
          >
            <Check className="w-3 h-3" />
            <span>{currentBeat.isLocked ? "Approved" : "Approve"}</span>
          </button>
        </div>
      </div>

      {/* Stage Director Bar */}
      {onQuickDirectLayer && editorMode === "none" && (
        <div className="h-9 border-b border-zinc-800/70 bg-zinc-950 px-5 flex items-center gap-2 overflow-x-auto z-10 select-none">
          <div className="flex items-center gap-1 pr-2 border-r border-zinc-800 flex-shrink-0">
            {DIRECTOR_GROUPS.map((g) => (
              <button
                key={g.label}
                onClick={() => setActiveDirectorTab(g.label)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  activeDirectorTab === g.label
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {DIRECTOR_GROUPS.find((g) => g.label === activeDirectorTab)?.items.map((item) => (
              <button
                key={item.label}
                onClick={() => onQuickDirectLayer(item.val)}
                className="px-2.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 text-[11px] text-zinc-400 hover:text-zinc-100 whitespace-nowrap transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Image Editor Sub-Toolbar */}
      {editorMode === "ai-inpaint" && (
        <div className="border-b border-zinc-800 bg-zinc-900/90 px-5 py-2 flex flex-col gap-2 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400 whitespace-nowrap">
              {maskBox
                ? `Selected region (${Math.round(maskBox.widthPercent)}% × ${Math.round(maskBox.heightPercent)}%)`
                : "Drag on the image to select a target area, or edit the whole frame:"}
            </span>
            {maskBox && (
              <button
                onClick={() => setMaskBox(null)}
                className="text-[11px] text-zinc-400 hover:text-white underline cursor-pointer"
              >
                Clear selection
              </button>
            )}
            <div className="flex items-center gap-1 ml-auto overflow-x-auto">
              {SLASH_PRESETS.map((s) => (
                <button
                  key={s.cmd}
                  onClick={() => handleRunAiImageEdit(s.prompt)}
                  disabled={isAiEditing}
                  className="px-2 py-0.5 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-mono text-zinc-300 hover:text-white cursor-pointer disabled:opacity-40"
                  title={s.prompt}
                >
                  {s.cmd}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inpaintPrompt}
              onChange={(e) => setInpaintPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRunAiImageEdit()}
              placeholder="Describe what to add or edit in the selected region (e.g. 'add a glowing portal', 'add a helicopter overhead')..."
              className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
            <button
              onClick={() => handleRunAiImageEdit()}
              disabled={!inpaintPrompt.trim() || isAiEditing}
              className="px-3.5 py-1.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs whitespace-nowrap cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
            >
              {isAiEditing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isAiEditing ? "Applying..." : "Apply AI Edit"}</span>
            </button>
            <button
              onClick={() => setEditorMode("none")}
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {editorMode === "draw" && (
        <div className="h-10 border-b border-zinc-800 bg-zinc-900/90 px-5 flex items-center justify-between gap-3 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-300 font-medium">Brush</span>
            <div className="flex items-center gap-1.5">
              {["#38bdf8", "#ef4444", "#fbbf24", "#22c55e", "#a855f7", "#ffffff", "#09090b"].map((c) => (
                <button
                  key={c}
                  onClick={() => setBrushColor(c)}
                  className={`w-4 h-4 rounded-full border cursor-pointer ${
                    brushColor === c ? "border-white scale-110" : "border-zinc-700"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-[11px] text-zinc-400">Size</span>
              <input
                type="range"
                min={2}
                max={20}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20 accent-zinc-200 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setStrokes((prev) => prev.slice(0, -1))}
              disabled={strokes.length === 0}
              className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 disabled:opacity-40 cursor-pointer"
            >
              <Undo2 className="w-3 h-3" />
              <span>Undo</span>
            </button>
            <button
              onClick={() => setStrokes([])}
              disabled={strokes.length === 0}
              className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 disabled:opacity-40 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
            <button
              onClick={() => bakeCanvasToVersion("Freehand brush edit")}
              disabled={strokes.length === 0}
              className="px-3 py-1 rounded bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium disabled:opacity-40 cursor-pointer"
            >
              Save Drawing as Version
            </button>
            <button
              onClick={() => setEditorMode("none")}
              className="p-1 text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {editorMode === "adjust" && (
        <div className="border-b border-zinc-800 bg-zinc-900/90 px-5 py-2 flex flex-wrap items-center justify-between gap-3 z-10">
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-300">
            <div className="flex items-center gap-1">
              {FILTER_PRESETS.map((fp) => (
                <button
                  key={fp.name}
                  onClick={() => {
                    setBrightness(fp.brightness);
                    setContrast(fp.contrast);
                    setSaturate(fp.saturate);
                    setSepia(fp.sepia);
                    setHue(fp.hue);
                    setBlur(fp.blur);
                  }}
                  className="px-2 py-0.5 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                >
                  {fp.name}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-1.5">
              <span className="text-zinc-400">Brightness</span>
              <input type="range" min={50} max={150} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-16 accent-zinc-200" />
            </label>
            <label className="flex items-center gap-1.5">
              <span className="text-zinc-400">Contrast</span>
              <input type="range" min={50} max={160} value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-16 accent-zinc-200" />
            </label>
            <label className="flex items-center gap-1.5">
              <span className="text-zinc-400">Saturation</span>
              <input type="range" min={0} max={200} value={saturate} onChange={(e) => setSaturate(Number(e.target.value))} className="w-16 accent-zinc-200" />
            </label>
            <label className="flex items-center gap-1.5">
              <span className="text-zinc-400">Hue</span>
              <input type="range" min={-180} max={180} value={hue} onChange={(e) => setHue(Number(e.target.value))} className="w-16 accent-zinc-200" />
            </label>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => bakeCanvasToVersion("Color grade adjustment")}
              className="px-3 py-1 rounded bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium cursor-pointer"
            >
              Save Grade as Version
            </button>
            <button
              onClick={() => setEditorMode("none")}
              className="p-1 text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Canvas Viewport */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden bg-dot-grid">
        <div
          ref={stageRef}
          onPointerDown={handleStagePointerDown}
          onPointerMove={handleStagePointerMove}
          onPointerUp={handleStagePointerUp}
          className={`relative w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden border border-zinc-800 bg-black group aspect-video select-none ${
            editorMode === "ai-inpaint" || editorMode === "draw" ? "cursor-crosshair" : ""
          }`}
        >
          {/* Main Visual Image with Loading & Retry Overlay */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentDisplayUrl}
            alt={currentBeat.title}
            crossOrigin="anonymous"
            style={{ filter: cssFilterString }}
            onLoad={() => {
              setIsImageLoading(false);
              setImageLoadError(false);
            }}
            onError={() => {
              setIsImageLoading(false);
              setImageLoadError(true);
            }}
            className={`scene-main-img w-full h-full object-cover transition-opacity duration-300 ${
              isImageLoading ? "opacity-30" : "opacity-100"
            }`}
          />

          {/* Freehand Drawing SVG Overlay */}
          {(strokes.length > 0 || activeStroke) && (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
            >
              {[...strokes, ...(activeStroke ? [activeStroke] : [])].map((s, idx) => (
                <polyline
                  key={idx}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={s.size * 0.25}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={s.points.map((p) => `${p.x},${p.y}`).join(" ")}
                />
              ))}
            </svg>
          )}

          {/* AI Inpaint Region Selection Box Overlay */}
          {editorMode === "ai-inpaint" && maskBox && (
            <div
              style={{
                left: `${maskBox.xPercent}%`,
                top: `${maskBox.yPercent}%`,
                width: `${maskBox.widthPercent}%`,
                height: `${maskBox.heightPercent}%`
              }}
              className="absolute border-2 border-dashed border-sky-400 bg-sky-400/15 pointer-events-none z-20 flex items-start justify-end p-1"
            >
              <span className="px-1.5 py-0.5 rounded bg-zinc-950/90 text-[10px] font-mono text-sky-300">
                Target Area
              </span>
            </div>
          )}

          {isImageLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/75 backdrop-blur-sm z-20 p-6 text-center">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-2.5" />
              <p className="text-xs font-bold text-zinc-100">
                Painting Scene {currentBeat.sequenceIndex}: {currentBeat.title}...
              </p>
              <p className="text-[11px] text-zinc-400 max-w-md mt-1 line-clamp-2">
                {currentBeat.userPromptDescription}
              </p>
            </div>
          )}

          {imageLoadError && !isImageLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/85 z-20 p-6 text-center">
              <p className="text-xs font-bold text-zinc-200 mb-2">
                Scene image took too long to load.
              </p>
              <button
                onClick={() => {
                  setImageLoadError(false);
                  setIsImageLoading(true);
                  setRetryCount((c) => c + 1);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Render</span>
              </button>
            </div>
          )}

          {/* COMIC MODE OVERLAYS (Draggable & Double-Click Editable) */}
          {displayMode === "comic" && (
            <div className="absolute inset-0 pointer-events-none">
              {currentBeat.captions.map((cap) => (
                <div
                  key={cap.id}
                  onPointerDown={(e) => handleBubblePointerDown(e, cap.id)}
                  onPointerMove={(e) => handleBubblePointerMove(e, cap.id)}
                  onPointerUp={(e) => handleBubblePointerUp(e, cap.id)}
                  onDoubleClick={() => setEditingId(cap.id)}
                  style={{
                    left: `${cap.xPercent}%`,
                    top: `${cap.yPercent}%`
                  }}
                  title="Drag to move • Double-click to edit text"
                  className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 select-none touch-none group/bubble ${
                    draggingId === cap.id ? "cursor-grabbing scale-105 z-30" : "cursor-grab z-10"
                  }`}
                >
                  {cap.type === "narration" ? (
                    <div className="relative bg-amber-100 text-black font-extrabold text-[11px] px-3 py-1.5 uppercase tracking-wide border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] max-w-xs font-sans">
                      {editingId === cap.id ? (
                        <input
                          autoFocus
                          value={cap.text}
                          onChange={(e) => updateCaptionText(cap.id, e.target.value)}
                          onBlur={() => setEditingId(null)}
                          onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                          className="bg-white px-1 py-0.5 text-black text-[11px] font-bold w-56 outline-none border border-amber-500"
                        />
                      ) : (
                        cap.text
                      )}
                      <button
                        onClick={() => removeCaption(cap.id)}
                        className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold hidden group-hover/bubble:flex items-center justify-center cursor-pointer"
                        title="Delete caption"
                      >
                        ✕
                      </button>
                    </div>
                  ) : cap.type === "sfx" ? (
                    <div className="relative font-black italic text-2xl tracking-tighter text-amber-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase">
                      {editingId === cap.id ? (
                        <input
                          autoFocus
                          value={cap.text}
                          onChange={(e) => updateCaptionText(cap.id, e.target.value)}
                          onBlur={() => setEditingId(null)}
                          onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                          className="bg-black px-1 py-0.5 text-amber-400 text-lg font-black w-40 outline-none border border-amber-500"
                        />
                      ) : (
                        cap.text
                      )}
                      <button
                        onClick={() => removeCaption(cap.id)}
                        className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold hidden group-hover/bubble:flex items-center justify-center cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : cap.type === "thought" ? (
                    <div className="relative bg-sky-50 text-black text-xs italic font-bold px-4 py-2.5 rounded-full border-2 border-dashed border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] max-w-[230px] font-sans">
                      {cap.speaker && (
                        <span className="block text-[9px] text-zinc-500 uppercase font-extrabold not-italic tracking-wider mb-0.5">
                          {cap.speaker} (thinks):
                        </span>
                      )}
                      {editingId === cap.id ? (
                        <input
                          autoFocus
                          value={cap.text}
                          onChange={(e) => updateCaptionText(cap.id, e.target.value)}
                          onBlur={() => setEditingId(null)}
                          onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                          className="bg-white px-1 py-0.5 text-black text-xs font-bold w-44 outline-none border border-amber-500 rounded"
                        />
                      ) : (
                        <p className="leading-snug">{cap.text}</p>
                      )}
                      <div className="absolute -bottom-2.5 left-6 w-2.5 h-2.5 rounded-full bg-sky-50 border-2 border-black" />
                      <div className="absolute -bottom-4 left-4 w-1.5 h-1.5 rounded-full bg-sky-50 border border-black" />
                      <button
                        onClick={() => removeCaption(cap.id)}
                        className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold hidden group-hover/bubble:flex items-center justify-center cursor-pointer"
                        title="Delete thought bubble"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="relative bg-white text-black text-xs font-bold px-3.5 py-2 rounded-2xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] max-w-[220px] font-sans">
                      {cap.speaker && (
                        <span className="block text-[10px] text-zinc-600 uppercase font-extrabold tracking-wider mb-0.5">
                          {cap.speaker}:
                        </span>
                      )}
                      {editingId === cap.id ? (
                        <input
                          autoFocus
                          value={cap.text}
                          onChange={(e) => updateCaptionText(cap.id, e.target.value)}
                          onBlur={() => setEditingId(null)}
                          onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                          className="bg-zinc-100 px-1 py-0.5 text-black text-xs font-bold w-44 outline-none border border-amber-500 rounded"
                        />
                      ) : (
                        <p className="leading-snug">{cap.text}</p>
                      )}
                      <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-white border-r-[8px] border-r-transparent filter drop-shadow-[0px_2px_0px_rgba(0,0,0,1)]" />
                      <button
                        onClick={() => removeCaption(cap.id)}
                        className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold hidden group-hover/bubble:flex items-center justify-center cursor-pointer"
                        title="Delete bubble"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CINEMATIC MODE OVERLAY */}
          {displayMode === "cinematic" && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-10 pb-4 px-8 text-center">
              <p className="text-amber-200 text-sm font-serif italic max-w-2xl mx-auto drop-shadow-md">
                &ldquo;{currentBeat.subtitleText || currentBeat.captions[0]?.text || currentBeat.userPromptDescription}&rdquo;
              </p>
            </div>
          )}

          {/* Add Dialogue Bubble Button */}
          {displayMode === "comic" && (
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                onClick={() => setIsAddingBubble(!isAddingBubble)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-xs font-semibold backdrop-blur-md border border-zinc-700 shadow-lg cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Add Speech Bubble</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pop-up Add Bubble Form */}
      {isAddingBubble && (
        <div className="absolute bottom-16 right-6 w-80 bg-zinc-900 border border-zinc-700 p-4 rounded-xl shadow-2xl z-30">
          <h4 className="text-xs font-bold text-zinc-100 mb-2 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            Add Dialogue to Scene
          </h4>
          <form onSubmit={handleAddBubble} className="space-y-2">
            {/* Bubble Type Selector (AI Comic Factory style) */}
            <div className="grid grid-cols-4 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              {(
                [
                  { id: "speech", label: "Speech" },
                  { id: "thought", label: "Thought" },
                  { id: "narration", label: "Caption" },
                  { id: "sfx", label: "SFX" }
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setBubbleType(t.id)}
                  className={`py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    bubbleType === t.id ? "bg-zinc-200 text-zinc-950" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {bubbleType !== "narration" && bubbleType !== "sfx" && (
              <input
                type="text"
                placeholder="Speaker (e.g. Captain Miller)"
                value={speakerName}
                onChange={(e) => setSpeakerName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            )}
            <textarea
              rows={2}
              placeholder={
                bubbleType === "sfx"
                  ? "Action sound effect (e.g. KRAKOOM! / SLASH!)"
                  : bubbleType === "narration"
                  ? "Narration box caption..."
                  : "Dialogue or thought line..."
              }
              value={newSpeechText}
              onChange={(e) => setNewSpeechText(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingBubble(false)}
                className="px-2.5 py-1 rounded text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs cursor-pointer"
              >
                Place Bubble
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
