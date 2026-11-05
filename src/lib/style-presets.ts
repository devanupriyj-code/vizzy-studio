export interface StylePreset {
  name: string;
  visualTone: string;
  lighting: string;
  colors: string[];
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    name: "Gritty 1990s Graphic Novel, Ink & Wash",
    visualTone: "Desaturated, heavy ink outlines, crosshatch shading, textured paper wash",
    lighting: "Cold overcast, moody rim light, heavy dark shadows",
    colors: ["#2b3a42", "#3f5e5a", "#8b9489", "#c85a17", "#1e2226"]
  },
  {
    name: "Cyberpunk Neon Noir",
    visualTone: "Rain-slicked streets, holographic glow, dystopian city, smoke and steam",
    lighting: "High-contrast neon pink and cyan rim light, deep midnight shadows",
    colors: ["#0d0221", "#0f084b", "#26408b", "#a6cfd5", "#f72585"]
  },
  {
    name: "Cinematic Watercolor Storyboard",
    visualTone: "Soft fluid washes, painterly textures, atmospheric perspective",
    lighting: "Warm golden hour sunlight, soft diffused glow",
    colors: ["#e9c46a", "#f4a261", "#e76f51", "#2a9d8f", "#264653"]
  },
  {
    name: "Anime / Manga Dynamic Shonen",
    visualTone: "Sharp crisp lineart, dramatic speed lines, high energy comic layout",
    lighting: "Vibrant saturated key lighting, glowing energy bursts",
    colors: ["#d90429", "#ef233c", "#edf2f4", "#8d99ae", "#2b2d42"]
  }
];
