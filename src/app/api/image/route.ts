import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

type GeneratedImage = { buffer: ArrayBuffer; contentType: string };

// In-memory cache so revisiting scenes or re-viewing portraits is instant
const imageCache = new Map<string, GeneratedImage>();
// Deduplicate concurrent requests for the exact same image (CanvasStage + ChatPanel + Filmstrip)
const inFlight = new Map<string, Promise<GeneratedImage>>();

// Cooldown timestamps so we don't stall on temporarily rate-limited providers
let hfCooldownUntil = 0;
let pollinationsCooldownUntil = 0;
let hordeSubmitChain: Promise<void> = Promise.resolve();

const FLUX_SPACES = [
  "https://black-forest-labs-flux-1-schnell.hf.space",
  "https://evalstate-flux1-schnell.hf.space"
];

/**
 * Provider 1: Hugging Face public FLUX.1-schnell Gradio API (~4-6s when ZeroGPU quota is free).
 */
async function tryFluxSpace(
  host: string,
  prompt: string,
  seed: number,
  width: number,
  height: number
): Promise<GeneratedImage | null> {
  if (Date.now() < hfCooldownUntil) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 18000);
  try {
    const callRes = await fetch(`${host}/gradio_api/call/infer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        data: [prompt, seed % 2147483647, false, width, height, 4]
      })
    });
    if (!callRes.ok) {
      hfCooldownUntil = Date.now() + 60000;
      return null;
    }
    const { event_id } = (await callRes.json()) as { event_id?: string };
    if (!event_id) return null;

    const sseRes = await fetch(`${host}/gradio_api/call/infer/${event_id}`, {
      signal: controller.signal
    });
    if (!sseRes.ok) return null;
    const sseText = await sseRes.text();

    if (sseText.includes("event: error")) {
      hfCooldownUntil = Date.now() + 60000;
      return null;
    }

    const dataLine = sseText
      .split("\n")
      .reverse()
      .find((line) => line.startsWith("data: ["));
    if (!dataLine) return null;

    const payload = JSON.parse(dataLine.slice(6));
    const fileUrl: string | undefined = payload?.[0]?.url;
    if (!fileUrl) return null;

    const imgRes = await fetch(fileUrl, { signal: controller.signal });
    if (!imgRes.ok) return null;
    const buffer = await imgRes.arrayBuffer();
    if (buffer.byteLength < 2000) return null;

    return {
      buffer,
      contentType: imgRes.headers.get("content-type") || "image/webp"
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Provider 2: Pollinations FLUX (using non-image Accept header so rate-limits return HTTP 402
 * instead of the yellow "Free limit reached" placeholder image).
 */
async function tryPollinations(
  prompt: string,
  seed: number,
  width: number,
  height: number,
  token?: string
): Promise<GeneratedImage | null> {
  const apiToken = token || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
  if (!apiToken && Date.now() < pollinationsCooldownUntil) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const encoded = encodeURIComponent(prompt);
    let url = `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${seed}&model=flux&nologo=true`;
    if (apiToken) url += `&token=${encodeURIComponent(apiToken)}`;

    const res = await fetch(url, {
      headers: { Accept: "application/json, */*" },
      signal: controller.signal
    });

    if (!res.ok) {
      const retryAfter = Number(res.headers.get("retry-after")) || 38;
      if (!apiToken) {
        pollinationsCooldownUntil = Date.now() + retryAfter * 1000;
      }
      return null;
    }

    const ct = res.headers.get("content-type") || "";
    if (!ct.startsWith("image/")) return null;
    if (!res.headers.get("x-model-used")) return null;

    const buffer = await res.arrayBuffer();
    if (buffer.byteLength < 5000) return null;
    return { buffer, contentType: ct };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Provider 3: AI Horde distributed GPU cluster (zero API key required, no 45s rate limit).
 * Uses <= 576x576 resolution so anonymous key "0000000000" requires zero upfront kudos.
 */
async function tryAiHorde(
  prompt: string,
  seed: number,
  width: number,
  height: number
): Promise<GeneratedImage | null> {
  try {
    const isSquare = Math.abs(width - height) < 100;
    const isPortrait = height > width + 100;
    const hordeWidth = isSquare ? 512 : isPortrait ? 384 : 576;
    const hordeHeight = isSquare ? 512 : isPortrait ? 512 : 320;

    // Space out submissions by 650ms to respect AI Horde's 2 req/sec submission limit
    const submitTurn = hordeSubmitChain.then(
      () => new Promise<void>((resolve) => setTimeout(resolve, 650))
    );
    hordeSubmitChain = submitTurn;
    await submitTurn;

    const submitRes = await fetch("https://aihorde.net/api/v2/generate/async", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: "0000000000",
        "Client-Agent": "VizzyStoryboardStudio:1.0:local"
      },
      body: JSON.stringify({
        prompt: `${prompt} ### text, watermark, blurry, deformed, ugly`,
        params: {
          width: hordeWidth,
          height: hordeHeight,
          steps: 18,
          cfg_scale: 7,
          sampler_name: "k_euler_a",
          seed: String(seed % 99999999)
        },
        models: [
          "Deliberate",
          "stable_diffusion",
          "AbsoluteReality",
          "CyberRealistic Pony"
        ],
        r2: true
      })
    });

    if (!submitRes.ok) return null;
    const submitData = (await submitRes.json()) as { id?: string };
    if (!submitData.id) return null;

    // Poll every 2s up to 34s
    for (let i = 0; i < 17; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const statusRes = await fetch(
        `https://aihorde.net/api/v2/generate/status/${submitData.id}`
      );
      if (!statusRes.ok) continue;
      const status = (await statusRes.json()) as {
        done?: boolean;
        faulted?: boolean;
        generations?: { img?: string }[];
      };

      if (status.faulted) return null;
      if (status.done && status.generations?.[0]?.img) {
        const imgField = status.generations[0].img;
        if (imgField.startsWith("http")) {
          const imgRes = await fetch(imgField);
          if (!imgRes.ok) return null;
          const buffer = await imgRes.arrayBuffer();
          if (buffer.byteLength < 2000) return null;
          return {
            buffer,
            contentType: imgRes.headers.get("content-type") || "image/webp"
          };
        } else {
          // Base64 encoded webp
          const bin = Buffer.from(imgField, "base64");
          return {
            buffer: bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength),
            contentType: "image/webp"
          };
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Provider 4: Gemini custom SVG graphic-novel illustrator + deterministic comic panel fallback.
 * Guarantees 100% uptime and never shows unrelated stock photos.
 */
async function generateIllustratedSvg(
  prompt: string,
  width: number,
  height: number
): Promise<GeneratedImage> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && !apiKey.includes("your_gemini")) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const res = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a dramatic, richly detailed graphic novel illustration in pure SVG (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">...</svg>) for this scene:
"${prompt}"
Requirements:
- Return ONLY raw valid <svg>...</svg> markup, no markdown fences or explanation.
- Include layered atmospheric background gradients, cityscapes/landscapes/architecture matching the scene, dynamic lighting rays/rain/sparks/shadows, expressive character silhouettes/figures in action, and dramatic comic-book composition.
- Do NOT include speech bubbles or caption text inside the SVG.`
      });
      const raw = (res.text || "").trim();
      const match = raw.match(/<svg[\s\S]*<\/svg>/i);
      if (match) {
        const encoded = new TextEncoder().encode(match[0]);
        return {
          buffer: encoded.buffer.slice(encoded.byteOffset, encoded.byteOffset + encoded.byteLength),
          contentType: "image/svg+xml"
        };
      }
    } catch {
      // Fall through to deterministic SVG below
    }
  }

  const safeText = prompt.replace(/[<>&"']/g, "").slice(0, 110);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#090d16"/>
        <stop offset="55%" stop-color="#1e1b4b"/>
        <stop offset="100%" stop-color="#31102f"/>
      </linearGradient>
      <radialGradient id="glow" cx="65%" cy="35%" r="50%">
        <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#sky)"/>
    <rect width="100%" height="100%" fill="url(#glow)"/>
    <polygon points="0,${height} 0,${height * 0.62} ${width * 0.25},${height * 0.52} ${width * 0.55},${height * 0.68} ${width * 0.85},${height * 0.48} ${width},${height * 0.6} ${width},${height}" fill="#09090b" opacity="0.85"/>
    <text x="${width / 2}" y="${height * 0.88}" text-anchor="middle" fill="#a1a1aa" font-family="sans-serif" font-size="14">${safeText}</text>
  </svg>`;
  const encoded = new TextEncoder().encode(svg);
  return {
    buffer: encoded.buffer.slice(encoded.byteOffset, encoded.byteOffset + encoded.byteLength),
    contentType: "image/svg+xml"
  };
}

async function generateSceneImage(
  prompt: string,
  seed: number,
  width: number,
  height: number,
  token?: string
): Promise<GeneratedImage> {
  // 1. Try Hugging Face FLUX.1-schnell spaces
  for (const space of FLUX_SPACES) {
    const res = await tryFluxSpace(space, prompt, seed, width, height);
    if (res) return res;
  }

  // 2. Try Pollinations FLUX
  const pollRes = await tryPollinations(prompt, seed, width, height, token);
  if (pollRes) return pollRes;

  // 3. Try AI Horde distributed GPU cluster (no 45s rate limit)
  const hordeRes = await tryAiHorde(prompt, seed, width, height);
  if (hordeRes) return hordeRes;

  // 4. Fallback to Gemini custom SVG graphic novel illustration
  return generateIllustratedSvg(prompt, width, height);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const prompt = (searchParams.get("prompt") || "cinematic storyboard scene").slice(0, 900);
  const seed = Number(searchParams.get("seed")) || 42;
  const width = Math.min(1344, Math.max(512, Number(searchParams.get("width")) || 1024));
  const height = Math.min(1024, Math.max(512, Number(searchParams.get("height")) || 576));
  const token = searchParams.get("token") || undefined;

  const cacheKey = `${prompt}|${seed}|${width}x${height}`;
  const cached = imageCache.get(cacheKey);
  if (cached) {
    return new NextResponse(cached.buffer, {
      headers: {
        "Content-Type": cached.contentType,
        "Cache-Control": "public, max-age=86400"
      }
    });
  }

  // Deduplicate concurrent identical requests
  let pending = inFlight.get(cacheKey);
  if (!pending) {
    pending = generateSceneImage(prompt, seed, width, height, token).finally(() => {
      inFlight.delete(cacheKey);
    });
    inFlight.set(cacheKey, pending);
  }

  const result = await pending;
  imageCache.set(cacheKey, result);

  return new NextResponse(result.buffer, {
    headers: {
      "Content-Type": result.contentType,
      "Cache-Control": "public, max-age=86400"
    }
  });
}
