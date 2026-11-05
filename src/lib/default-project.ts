import { Project, StyleBible } from "@/types";

const defaultStyle: StyleBible = {
  artStyle: "Gritty 1990s Graphic Novel, Ink & Wash",
  visualTone: "High contrast shadows, clean ink lines, atmospheric lighting",
  lightingStyle: "Dramatic studio lighting",
  colorPalette: ["#2b3a42", "#3f5e5a", "#8b9489", "#c85a17", "#1e2226"],
  aspectRatio: "16:9"
};

export const initialProject: Project = {
  id: "empty-project",
  title: "Untitled Project",
  synopsis: "",
  activeBeatIndex: 0,
  displayMode: "comic",
  styleBible: defaultStyle,
  characters: [],
  beats: []
};
