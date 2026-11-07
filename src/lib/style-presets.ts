export interface StylePreset {
  name: string;
  visualTone: string;
  lighting: string;
  colors: string[];
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    name: "Anime / Manga Dynamic Shonen",
    visualTone: "Sharp crisp lineart, expressive anime eyes, dramatic speedlines & screentones",
    lighting: "Vibrant saturated key lighting, glowing energy bursts, twilight gradients",
    colors: ["#d90429", "#ef233c", "#edf2f4", "#8d99ae", "#2b2d42"]
  },
  {
    name: "Cinematic Watercolor Storyboard",
    visualTone: "Soft fluid washes, warm golden hour palette, painterly clouds, delicate umber lineart",
    lighting: "Warm diffused sunlight, soft atmospheric glow, painterly paper textures",
    colors: ["#e9c46a", "#f4a261", "#e76f51", "#2a9d8f", "#264653"]
  },
  {
    name: "Cyberpunk Neon Noir",
    visualTone: "Dual cyan & magenta neon rim lighting, holographic HUD elements, obsidian skyline",
    lighting: "High-contrast neon pink and cyan rim light, glowing reflections, deep midnight shadows",
    colors: ["#0d0221", "#0f084b", "#26408b", "#a6cfd5", "#f72585"]
  },
  {
    name: "Gritty 1990s Graphic Novel, Ink & Wash",
    visualTone: "Desaturated, heavy black ink outlines, crosshatch shading, textured paper wash",
    lighting: "Cold overcast, moody rim light, heavy dark shadows",
    colors: ["#2b3a42", "#3f5e5a", "#8b9489", "#c85a17", "#1e2226"]
  },
  {
    name: "Classic 1960s Retro Comic (Pop Art)",
    visualTone: "Vintage newsprint tone, Ben-Day halftone dot shading, bold 4px pop art black ink",
    lighting: "High-key saturated comic book print, punchy primary contrasts",
    colors: ["#faf5eb", "#e11d48", "#2563eb", "#eab308", "#09090b"]
  },
  {
    name: "Film Noir Chiaroscuro",
    visualTone: "Stark black & white ink, dramatic Venetian blind shadow slits, high-contrast silhouettes",
    lighting: "Harsh diagonal streetlamp key, pitch black shadows, stark white rim highlights",
    colors: ["#09090b", "#18181b", "#52525b", "#d4d4d8", "#fafafa"]
  }
];
