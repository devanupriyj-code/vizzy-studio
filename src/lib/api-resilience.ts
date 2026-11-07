/**
 * Utility for robust API response extraction, 429 rate limit resilience, and safe deterministic fallbacks.
 */

/**
 * Extracts and parses valid JSON from raw model text even if wrapped in
 * markdown code fences (```json ... ```) or accompanied by conversational text.
 */
export function cleanJsonExtract<T = Record<string, any>>(rawText: string | null | undefined): T | null {
  if (!rawText || typeof rawText !== "string") return null;

  let text = rawText.trim();

  // Strip markdown code fences if present
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  // 1. Direct parse attempt
  try {
    return JSON.parse(text) as T;
  } catch {
    // 2. Search for outermost JSON object { ... }
    const startObj = text.indexOf("{");
    const endObj = text.lastIndexOf("}");
    if (startObj !== -1 && endObj !== -1 && endObj > startObj) {
      try {
        return JSON.parse(text.slice(startObj, endObj + 1)) as T;
      } catch {
        // continue to array check
      }
    }

    // 3. Search for outermost JSON array [ ... ]
    const startArr = text.indexOf("[");
    const endArr = text.lastIndexOf("]");
    if (startArr !== -1 && endArr !== -1 && endArr > startArr) {
      try {
        return JSON.parse(text.slice(startArr, endArr + 1)) as T;
      } catch {
        // failed
      }
    }

    return null;
  }
}

/**
 * Checks whether an error, HTTP status, or error string indicates a 429 Rate Limit / Quota Exhaustion.
 */
export function isRateLimitError(err: unknown, status?: number): boolean {
  if (status === 429) return true;
  const str = String(err || "").toLowerCase();
  return (
    str.includes("429") ||
    str.includes("resource_exhausted") ||
    str.includes("quota") ||
    str.includes("rate limit") ||
    str.includes("too many requests") ||
    str.includes("rate_limit_exceeded") ||
    str.includes("exceeded your current quota")
  );
}

/**
 * Pause execution for ms milliseconds with small jitter to prevent thundering herd.
 */
export function sleep(ms: number, jitter: boolean = true): Promise<void> {
  const delay = jitter ? ms + Math.floor(Math.random() * 80) : ms;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Standard ordered list of Gemini models for fast, reliable fallback across tiers.
 */
export const GEMINI_FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-3-flash-preview",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite-preview"
];
