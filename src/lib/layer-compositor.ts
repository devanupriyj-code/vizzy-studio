import { CharacterProfile, StyleBible } from "@/types";

export type WeatherType = "none" | "rain" | "heavy_rain" | "fog" | "smoke" | "snow" | "ash" | "embers";
export type VfxType = "sparks" | "lasers" | "explosion" | "hologram" | "speed_lines" | "magic_aura" | "searchlights";
export type CameraShot = "wide" | "medium" | "closeup" | "low_angle" | "dramatic_side";
export type LightingMood = "default" | "darker" | "brighter" | "neon" | "crimson" | "warm" | "noir" | "emerald" | "golden";
export type CharPose =
  | "standing"
  | "action"
  | "crouching"
  | "pointing"
  | "aiming"
  | "running"
  | "crossed_arms"
  | "blade_ready"
  | "casting"
  | "defensive"
  | "thumbs_up"
  | "thinking"
  | "hand_on_hip";
export type CharExpression =
  | "determined"
  | "angry"
  | "shocked"
  | "calm"
  | "focused"
  | "smirking"
  | "sad"
  | "fierce"
  | "happy"
  | "wink"
  | "worried";

export type BgCategory =
  | "cyberpunk"
  | "military"
  | "noir"
  | "fantasy"
  | "modern"
  | "space"
  | "wasteland"
  | "horror"
  | "historical"
  | "anime"
  | "steampunk"
  | "underwater"
  | "mythology"
  | "western"
  | "superhero";

export type BgVariant =
  | "rooftop"
  | "alley"
  | "power_grid"
  | "street"
  | "interior"
  | "beach"
  | "bunker"
  | "vehicle"
  | "forest"
  | "bridge"
  | "courtyard"
  | "vault"
  | "laboratory"
  | "throne_room"
  | "starship_bridge"
  | "train_car"
  | "ruined_city"
  | "mountain_pass"
  | "cyber_market"
  | "harbor_dock"
  | "canyon_outpost"
  | "floating_island"
  | "prison_block"
  | "cathedral_nave";

export interface BackgroundDef {
  id: string;
  name: string;
  category: BgCategory;
  variant: BgVariant;
  editionIndex: number;
  keywords: string[];
  skyColors: [string, string, string];
  accentColor: string;
  secondaryAccent: string;
  groundColor: string;
}

export const CATEGORIES: BgCategory[] = [
  "cyberpunk",
  "military",
  "noir",
  "fantasy",
  "modern",
  "space",
  "wasteland",
  "horror",
  "historical",
  "anime",
  "steampunk",
  "underwater",
  "mythology",
  "western",
  "superhero"
];

const VARIANTS: {
  variant: BgVariant;
  label: string;
  tags: string[];
}[] = [
  { variant: "rooftop", label: "Skyscraper Rooftop Ledge", tags: ["rooftop", "ledge", "gargoyle", "skyline", "high", "tower", "overlook", "vigil"] },
  { variant: "alley", label: "Neon Shadow Alleyway", tags: ["alley", "alleyway", "narrow", "corner", "backstreet", "exchange", "shadows"] },
  { variant: "power_grid", label: "High-Voltage Transformer Grid", tags: ["transformer", "voltage", "sparks", "electric", "generator", "reactor", "power", "wires", "cables", "coil", "circuit"] },
  { variant: "street", label: "Downtown Boulevard & Crosswalk", tags: ["street", "road", "boulevard", "traffic", "city", "avenue", "plaza", "sector", "descend"] },
  { variant: "interior", label: "Tactical Command Room", tags: ["room", "office", "command", "inside", "table", "desk", "hallway", "corridor", "briefing"] },
  { variant: "beach", label: "Stormy Coastline & Obstacles", tags: ["beach", "shore", "ocean", "sea", "surf", "waves", "sand", "coast", "omaha", "hedgehog", "water"] },
  { variant: "bunker", label: "Fortified Concrete Casemate", tags: ["bunker", "trench", "fortress", "wall", "cover", "shelter", "bluff", "cliff", "nest", "pillbox"] },
  { variant: "vehicle", label: "Armored Transport Dropship", tags: ["boat", "craft", "higgins", "ramp", "ship", "dropship", "cabin", "cockpit", "hangar", "deck"] },
  { variant: "forest", label: "Misty Ancient Woodlands", tags: ["forest", "woods", "trees", "jungle", "grove", "swamp", "bamboo", "path", "wilderness"] },
  { variant: "bridge", label: "Suspension Skybridge & Overpass", tags: ["bridge", "overpass", "walkway", "catwalk", "crossing", "viaduct", "river"] },
  { variant: "courtyard", label: "Citadel Courtyard & Steps", tags: ["courtyard", "arena", "square", "steps", "temple", "castle", "shrine", "gates", "palace"] },
  { variant: "vault", label: "Subterranean Data Vault", tags: ["vault", "underground", "subway", "tunnel", "basement", "sewer", "crypt", "archive", "data", "terminal"] },
  { variant: "laboratory", label: "Bio-Tech Research Lab", tags: ["lab", "laboratory", "science", "experiment", "tube", "specimen", "medical", "clinic", "hospital"] },
  { variant: "throne_room", label: "Grand Pillar Hall & Throne", tags: ["throne", "hall", "sanctum", "chamber", "king", "emperor", "council"] },
  { variant: "starship_bridge", label: "Orbital Deck & Viewport", tags: ["starship", "orbital", "viewport", "station", "galaxy", "nebula", "cosmos", "helm"] },
  { variant: "train_car", label: "High-Speed Maglev Express", tags: ["train", "carriage", "rail", "locomotive", "passenger", "metro"] },
  { variant: "ruined_city", label: "Shattered War-Torn Ruins", tags: ["ruins", "rubble", "destroyed", "collapsed", "crater", "wreckage", "devastated", "warzone"] },
  { variant: "mountain_pass", label: "Jagged Mountain Cliff & Peaks", tags: ["mountain", "peak", "cliff", "ridge", "summit", "valley", "rock"] },
  { variant: "cyber_market", label: "Lantern Bazaar & Night Market", tags: ["market", "bazaar", "shop", "vendor", "lantern", "stall", "crowd", "chinatown"] },
  { variant: "harbor_dock", label: "Industrial Cargo Pier & Cranes", tags: ["harbor", "dock", "pier", "port", "crane", "container", "shipyard", "wharf"] },
  { variant: "canyon_outpost", label: "Red Rock Canyon & Watchtower", tags: ["canyon", "mesa", "outpost", "gorge", "desert", "ravine", "frontier"] },
  { variant: "floating_island", label: "Sky-Citadel Floating Spire", tags: ["floating", "sky", "island", "aether", "clouds", "sanctuary", "celestial"] },
  { variant: "prison_block", label: "High-Security Detention Cellblock", tags: ["prison", "cell", "jail", "bars", "interrogation", "detention", "lockup"] },
  { variant: "cathedral_nave", label: "Stained-Glass Cathedral & Altar", tags: ["cathedral", "church", "altar", "stained", "glass", "chapel", "monastery"] }
];

const EDITIONS: { suffix: string; skyShift: [string, string, string] | null; tag: string }[] = [
  { suffix: "Midnight Edition", skyShift: null, tag: "midnight" },
  { suffix: "Crimson Alert Edition", skyShift: ["#160409", "#310915", "#4c0519"], tag: "crimson" },
  { suffix: "Golden Mist Edition", skyShift: ["#12131c", "#27233a", "#4a354f"], tag: "mist" }
];

const CATEGORY_THEMES: Record<
  BgCategory,
  {
    prefix: string;
    catTags: string[];
    sky: [string, string, string];
    accent: string;
    secondary: string;
    ground: string;
  }
> = {
  cyberpunk: {
    prefix: "Cyberpunk Neon",
    catTags: ["cyberpunk", "neon", "sector", "drone", "drones", "hologram", "holographic", "laser", "chrome", "cyber", "synth", "future", "blueprint"],
    sky: ["#040711", "#0c1528", "#1a1638"],
    accent: "#00f5d4",
    secondary: "#f43f5e",
    ground: "#070a12"
  },
  military: {
    prefix: "Wartime Tactical",
    catTags: ["war", "wwii", "soldier", "squad", "captain", "private", "artillery", "helmet", "rifle", "normandy", "military", "combat", "army"],
    sky: ["#182024", "#2b3940", "#4a5861"],
    accent: "#ea580c",
    secondary: "#94a3b8",
    ground: "#161a1c"
  },
  noir: {
    prefix: "Noir Detective",
    catTags: ["noir", "detective", "crime", "mystery", "raincoat", "cigarette", "police", "investigation", "midnight"],
    sky: ["#070709", "#141418", "#242429"],
    accent: "#f59e0b",
    secondary: "#e2e8f0",
    ground: "#08080a"
  },
  fantasy: {
    prefix: "Mythic Kingdom",
    catTags: ["magic", "sword", "dragon", "knight", "kingdom", "spell", "ancient", "throne", "wizard", "elf"],
    sky: ["#0c1324", "#1b1642", "#350959"],
    accent: "#a855f7",
    secondary: "#38bdf8",
    ground: "#110f1a"
  },
  modern: {
    prefix: "Urban Action",
    catTags: ["modern", "downtown", "police", "car", "office", "building", "chase", "agent", "heist"],
    sky: ["#0a1526", "#192333", "#2d3b4e"],
    accent: "#38bdf8",
    secondary: "#f59e0b",
    ground: "#0c1322"
  },
  space: {
    prefix: "Deep Space",
    catTags: ["space", "starship", "planet", "orbit", "alien", "galaxy", "station", "astronaut", "cosmos"],
    sky: ["#02040d", "#070b17", "#161436"],
    accent: "#22d3ee",
    secondary: "#818cf8",
    ground: "#070a12"
  },
  wasteland: {
    prefix: "Post-Apocalyptic",
    catTags: ["wasteland", "ruins", "desert", "rust", "scavenger", "apocalypse", "dust", "collapsed", "survivor"],
    sky: ["#211109", "#3d1704", "#6e300d"],
    accent: "#f97316",
    secondary: "#eab308",
    ground: "#170f0b"
  },
  horror: {
    prefix: "Gothic Dread",
    catTags: ["horror", "ghost", "monster", "blood", "cursed", "haunted", "crypt", "graveyard", "nightmare"],
    sky: ["#040406", "#140d17", "#290d1e"],
    accent: "#e11d48",
    secondary: "#a855f7",
    ground: "#070508"
  },
  historical: {
    prefix: "Epic Historical",
    catTags: ["samurai", "katana", "empire", "temple", "dynasty", "warrior", "shogun", "duel"],
    sky: ["#171412", "#262220", "#3d3936"],
    accent: "#eab308",
    secondary: "#ef4444",
    ground: "#14110f"
  },
  anime: {
    prefix: "Shonen Dynamic",
    catTags: ["shonen", "manga", "sakura", "dojo", "academy", "rival", "sensei", "energy", "aura"],
    sky: ["#090d1f", "#1e1b4b", "#311042"],
    accent: "#f43f5e",
    secondary: "#00f5d4",
    ground: "#0b0914"
  },
  steampunk: {
    prefix: "Clockwork Brass",
    catTags: ["steampunk", "brass", "gears", "airship", "steam", "victorian", "clockwork", "coal"],
    sky: ["#1a120b", "#332211", "#593a1e"],
    accent: "#f59e0b",
    secondary: "#fb923c",
    ground: "#140e09"
  },
  underwater: {
    prefix: "Abyssal Ocean",
    catTags: ["underwater", "submarine", "abyss", "coral", "deep sea", "atlantis", "trench", "bioluminescent"],
    sky: ["#021019", "#042638", "#07415c"],
    accent: "#00f5d4",
    secondary: "#38bdf8",
    ground: "#020c14"
  },
  mythology: {
    prefix: "Celestial Olympus",
    catTags: ["olympus", "gods", "titan", "divine", "valhalla", "immortal", "oracle", "pantheon"],
    sky: ["#0f172a", "#1e1b4b", "#4c1d95"],
    accent: "#facc15",
    secondary: "#38bdf8",
    ground: "#111827"
  },
  western: {
    prefix: "Frontier Outlaw",
    catTags: ["western", "cowboy", "saloon", "outlaw", "sheriff", "bounty", "dusty", "revolver"],
    sky: ["#271206", "#572409", "#9a3412"],
    accent: "#fb923c",
    secondary: "#facc15",
    ground: "#1c0f07"
  },
  superhero: {
    prefix: "Metropolis Vigilante",
    catTags: ["superhero", "vigilante", "hero", "villain", "metropolis", "cape", "justice", "cosmic"],
    sky: ["#060b19", "#111c38", "#1e3a8a"],
    accent: "#38bdf8",
    secondary: "#ef4444",
    ground: "#070b14"
  }
};

/**
 * 1,080 Distinct Stored Backgrounds (15 Categories x 24 Settings x 3 Editions)
 */
export const BACKGROUND_CATALOG: BackgroundDef[] = CATEGORIES.flatMap((cat) => {
  const theme = CATEGORY_THEMES[cat];
  return VARIANTS.flatMap((v) =>
    EDITIONS.map((ed, edIdx) => ({
      id: `bg_${cat}_${v.variant}_${edIdx}`,
      name: `${theme.prefix} — ${v.label} (${ed.suffix})`,
      category: cat,
      variant: v.variant,
      editionIndex: edIdx,
      keywords: [...theme.catTags, ...v.tags, ed.tag],
      skyColors: ed.skyShift || theme.sky,
      accentColor: edIdx === 1 ? theme.secondary : theme.accent,
      secondaryAccent: edIdx === 1 ? theme.accent : theme.secondary,
      groundColor: theme.ground
    }))
  );
});

export type HairStyleType =
  | "short"
  | "spiky"
  | "long"
  | "ponytail"
  | "twin_tails"
  | "bob"
  | "undercut"
  | "braided"
  | "slick"
  | "messy"
  | "buzz"
  | "hooded"
  | "helmet"
  | "visor_helm"
  | "crown"
  | "cowboy_hat";

export type OutfitStyleType =
  | "trench_coat"
  | "cyber_jacket"
  | "military_armor"
  | "stealth_suit"
  | "royal_cloak"
  | "lab_coat"
  | "samurai_garb"
  | "wasteland_plate";

export type AccessoryType = "none" | "visor" | "eyepatch" | "glasses" | "mask" | "headband";

export interface CharacterRigVisuals {
  skinColor: string;
  skinShadow: string;
  hairColor: string;
  hairHighlight: string;
  hairStyle: HairStyleType;
  eyeColor: string;
  outfitStyle: OutfitStyleType;
  outfitPrimary: string;
  outfitDark: string;
  outfitSecondary: string;
  accentGlow: string;
  hasScar: boolean;
  hasStubble: boolean;
  accessory: AccessoryType;
  isFemale: boolean;
  propType: "none" | "rifle" | "pistol" | "holodrive" | "blade" | "katana" | "energy_orb" | "coat_collar";
  customBackSvg?: string;
  customSvg?: string;
}

export interface StoredCharacterPreset {
  id: string;
  name: string;
  role: string;
  archetype: string;
  age: string;
  hairAndEyes: string;
  facialFeatures: string;
  attire: string;
  customSvg?: string;
}

const ARCHETYPE_ROLES = [
  { role: "Cyber Rogue Operative", hair: "spiky black hair, cyan eyes", face: "sharp jaw, diagonal cheek scar", attire: "dark high-collar neon trench coat with holodrive" },
  { role: "Neural Net Hacker", hair: "silver long hair, emerald eyes", face: "angular features, cyber visor", attire: "crimson cyber jacket with glowing data drive" },
  { role: "2nd Rangers Commander", hair: "short dark hair, grey eyes, helmet", face: "weathered jaw, 3-day stubble, cheek scar", attire: "olive military field jacket with rifle" },
  { role: "Airborne Recon Sniper", hair: "blonde buzzed hair, piercing blue eyes", face: "calm focused gaze, fair skin", attire: "tactical military uniform with scoped rifle" },
  { role: "Syndicate Enforcer", hair: "slicked back silver hair, red eyes", face: "heavy stubble, eyepatch", attire: "black armored stealth suit with pistol" },
  { role: "Ronin Blade Master", hair: "long ponytail black hair, amber eyes", face: "stoic expression, headband, scar", attire: "midnight samurai kimono with katana blade" },
  { role: "Arcane High Mage", hair: "flowing white hair, violet eyes", face: "ethereal pale skin, glowing rune mark", attire: "royal purple cloak with energy orb" },
  { role: "Chief Bio-Scientist", hair: "bob cut auburn red hair, green eyes", face: "intelligent gaze, glasses", attire: "white research lab coat with holographic tablet" },
  { role: "Wasteland Road Raider", hair: "undercut pink hair, gold eyes", face: "tactical mask, fierce brow", attire: "rusted wasteland plate armor with rifle" },
  { role: "Starfleet Vanguard Pilot", hair: "messy blue hair, cyan eyes, visor helm", face: "confident smirk, fair skin", attire: "orbital flight stealth suit with pistol" },
  { role: "Noir Private Investigator", hair: "short dark hair, amber eyes", face: "weathered stubble, sharp cheekbones", attire: "charcoal noir trench coat with pistol" },
  { role: "Shadow Assassin", hair: "hooded raven black hair, crimson eyes", face: "masked lower face, glowing eyes", attire: "obsidian stealth cloak with energy blade" },
  { role: "Valkyrie Strike Captain", hair: "braided golden blonde hair, blue eyes", face: "noble jawline, cheek scar", attire: "crimson and gold royal armor with blade" },
  { role: "Mecha Hangar Engineer", hair: "twin tails cyan hair, amber eyes", face: "glasses, expressive eyes", attire: "high-visibility cyber jacket with holodrive" },
  { role: "Inquisitor Detective", hair: "slick silver hair, grey eyes", face: "glasses, stern expression", attire: "long dark coat with holographic dossier" },
  { role: "Rebel Underground Leader", hair: "undercut dark hair, green eyes", face: "heavy beard stubble, scar across nose", attire: "olive tactical armor with rifle" },
  { role: "Imperial Sovereign", hair: "long golden blonde hair, violet eyes, crown", face: "regal sharp features, fair skin", attire: "royal purple and gold cloak with blade" },
  { role: "Frontier Bounty Hunter", hair: "short brown hair, amber eyes, cowboy hat", face: "weathered tan skin, stubble, scar", attire: "dark duster trench coat with rifle" },
  { role: "Chrono Navigator", hair: "bob cut silver hair, cyan eyes", face: "glasses, calm expression", attire: "brass steampunk coat with energy orb" },
  { role: "Abyssal Diver Captain", hair: "short blue hair, emerald eyes, visor helm", face: "determined jaw, scar", attire: "deep-sea armored stealth suit with holodrive" },
  { role: "Shonen Martial Prodigy", hair: "spikycrimson red hair, gold eyes", face: "headband, fierce grin, cheek scar", attire: "crimson combat jacket with energy orb" },
  { role: "Crimson Witch of Ash", hair: "flowing pink hair, crimson eyes", face: "pale skin, calm gaze", attire: "dark crimson royal cloak with energy orb" },
  { role: "Spec-Ops Ghost Medic", hair: "ponytail blonde hair, green eyes", face: "tactical mask, fair skin", attire: "white and olive tactical armor with holodrive" },
  { role: "Cybernetic Street Samurai", hair: "undercut cyan hair, red eyes", face: "cyber visor, cheek scar", attire: "black neon cyber jacket with katana" },
  { role: "Dreadnought Gunner", hair: "buzz cut dark hair, amber eyes, helmet", face: "heavy stubble, eyepatch", attire: "heavy military plate armor with rifle" },
  { role: " Astral Oracle", hair: "twin tails white hair, violet eyes, crown", face: "ethereal pale skin", attire: "white royal cloak with energy orb" },
  { role: "Gotham Night Sentinel", hair: "hooded black hair, cyan eyes", face: "masked lower face, sharp jaw", attire: "dark armored cape trench coat with blade" },
  { role: "Bio-Hazard Contagion Specialist", hair: "short silver hair, green eyes, visor helm", face: "tactical mask", attire: "white lab hazmat armor with holodrive" },
  { role: "Desert Dune Nomad", hair: "braided black hair, amber eyes", face: "olive skin, headband, scar", attire: "wasteland cloak with katana" },
  { role: "Orbital Marine Sergeant", hair: "buzz blonde hair, blue eyes, helmet", face: "weathered stubble, cheek scar", attire: "blue space military armor with rifle" }
];

const FIRST_NAMES = [
  "Kael", "Mira", "Captain Miller", "Jackson", "Vex", "Sora", "Nyx", "Dante", "Lyra", "Orion",
  "Zane", "Elena", "Riku", "Valkyrie", "Cyrus", "Freya", "Marcus", "Akira", "Nova", "Cassian",
  "jin", "Seraphina", "Rook", "Talia", "Viktor", "Astrid", "Kaito", "Isolde", "Gideon", "Yuki",
  "Darius", "Sable", "Thorne", "Celeste", "jax", "Aria", "Magnus", "Kaia", "Lucian", "Zara"
];

/**
 * 1,200 Stored Character Variations (40 Characters x 30 Distinct Archetype Rigs)
 */
export const CHARACTER_STORAGE_PRESETS: StoredCharacterPreset[] = FIRST_NAMES.flatMap((firstName, fIdx) =>
  ARCHETYPE_ROLES.map((arch, aIdx) => {
    const num = fIdx * ARCHETYPE_ROLES.length + aIdx + 1;
    return {
      id: `preset-char-${num}`,
      name: `${firstName} — ${arch.role}`,
      role: arch.role,
      archetype: arch.role,
      age: `${20 + ((num * 3) % 28)}`,
      hairAndEyes: arch.hair,
      facialFeatures: arch.face,
      attire: arch.attire
    };
  })
);

/**
 * Dynamically adds a newly AI-created or AI-modified character into the runtime & localStorage Character Storage
 * so even traits that were not originally in storage become part of your available Character Forge library.
 */
export function registerCustomPresetInStorage(preset: Omit<StoredCharacterPreset, "id"> & { id?: string }) {
  const newEntry: StoredCharacterPreset = {
    ...preset,
    id: preset.id || `preset-ai-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
  if (!CHARACTER_STORAGE_PRESETS.some((p) => p.hairAndEyes === newEntry.hairAndEyes && p.attire === newEntry.attire && p.facialFeatures === newEntry.facialFeatures)) {
    CHARACTER_STORAGE_PRESETS.unshift(newEntry);
  }
}

/**
 * Generates procedural SVG layers for any unstored character traits (horns, wings, halo, cat/elf ears,
 * wizard/top/pirate hats, cap, headphones, beard, mustache, sunglasses, cigar, fangs, third eye, cape,
 * scarf, jetpack, tail, shield, staff, axe, hammer, scythe, bow, guitar, antennae, flames, etc.)
 * in the character rig coordinate space where (0,0) is the center of the face.
 */
function buildProceduralUnstoredLayers(
  fullText: string,
  accentColor: string,
  hairColor: string,
  outfitPrimary: string
): { backSvg: string; frontSvg: string } {
  let backSvg = "";
  let frontSvg = "";

  // 1. WINGS / CAPE / JETPACK / TAIL / AURA (behind character)
  if (/\b(angel wing|feathered wing|white wing|wings)\b/.test(fullText) && !/\b(demon|bat|dragon|cyber|mecha)\b/.test(fullText)) {
    backSvg += `
      <g fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5">
        <path d="M -35 55 C -115 -10, -165 20, -145 95 C -120 90, -135 125, -110 140 C -85 130, -65 110, -45 95 Z"/>
        <path d="M 35 55 C 115 -10, 165 20, 145 95 C 120 90, 135 125, 110 140 C 85 130, 65 110, 45 95 Z"/>
      </g>
    `;
  }
  if (/\b(demon wing|bat wing|dragon wing|dark wing|demon|devil|horns)\b/.test(fullText) && !/\b(angel|valkyrie|seraph)\b/.test(fullText)) {
    backSvg += `
      <g fill="#4c0519" stroke="#f43f5e" stroke-width="2.5">
        <polygon points="-35,55 -135,-15 -155,65 -115,55 -130,115 -85,90 -50,110"/>
        <polygon points="35,55 135,-15 155,65 115,55 130,115 85,90 50,110"/>
      </g>
    `;
  }
  if (/\b(cyber wing|mecha wing|robotic wing|energy wing)\b/.test(fullText)) {
    backSvg += `
      <g fill="${accentColor}" fill-opacity="0.35" stroke="${accentColor}" stroke-width="2.5">
        <polygon points="-40,50 -145,0 -130,35 -160,65 -110,85 -45,85"/>
        <polygon points="40,50 145,0 130,35 160,65 110,85 45,85"/>
      </g>
    `;
  }
  if (/\b(cape|flowing cape|cloak cape)\b/.test(fullText)) {
    backSvg += `
      <path d="M -52 54 C -95 95, -115 180, -125 255 L 125 255 C 115 180, 95 95, 52 54 Z" fill="${outfitPrimary}" stroke="#09090b" stroke-width="3" opacity="0.9"/>
    `;
  }
  if (/\b(jetpack|thruster)\b/.test(fullText)) {
    backSvg += `
      <g>
        <rect x="-72" y="45" width="24" height="68" rx="6" fill="#475569" stroke="#09090b" stroke-width="2.5"/>
        <rect x="48" y="45" width="24" height="68" rx="6" fill="#475569" stroke="#09090b" stroke-width="2.5"/>
        <polygon points="-68,113 -52,113 -60,155" fill="#f97316"/>
        <polygon points="52,113 68,113 60,155" fill="#f97316"/>
      </g>
    `;
  }
  if (/\b(tail|demon tail|cat tail|dragon tail)\b/.test(fullText)) {
    backSvg += `
      <path d="M 45 175 C 115 175, 135 115, 105 85 C 95 75, 125 55, 140 65" fill="none" stroke="${hairColor}" stroke-width="7" stroke-linecap="round"/>
      <polygon points="140,65 152,55 148,74" fill="${accentColor}"/>
    `;
  }
  if (/\b(flaming aura|fire aura|flame aura|super saiyan|burning aura)\b/.test(fullText)) {
    backSvg += `
      <polygon points="0,-115 -45,-65 -85,-90 -75,-20 -115,20 -85,95 -110,185 110,185 85,95 115,20 75,-20 85,-90 45,-65" fill="#f97316" opacity="0.28" stroke="#facc15" stroke-width="2"/>
    `;
  }

  // 2. HEADGEAR / HORNS / HALO / EARS / HATS (front of head)
  if (/\b(horn|horns|demon|devil|oni|tiefling)\b/.test(fullText)) {
    frontSvg += `
      <path d="M -24 -36 C -42 -68, -58 -78, -44 -96 C -26 -82, -16 -58, -10 -40 Z" fill="#dc2626" stroke="#09090b" stroke-width="2.5"/>
      <path d="M 24 -36 C 42 -68, 58 -78, 44 -96 C 26 -82, 16 -58, 10 -40 Z" fill="#dc2626" stroke="#09090b" stroke-width="2.5"/>
    `;
  }
  if (/\b(antler|antlers|stag|druid)\b/.test(fullText)) {
    frontSvg += `
      <path d="M -24 -38 L -48 -78 M -36 -58 L -58 -64 M -42 -68 L -34 -88" fill="none" stroke="#a16207" stroke-width="4" stroke-linecap="round"/>
      <path d="M 24 -38 L 48 -78 M 36 -58 L 58 -64 M 42 -68 L 34 -88" fill="none" stroke="#a16207" stroke-width="4" stroke-linecap="round"/>
    `;
  }
  if (/\b(halo|angel|seraph|divine)\b/.test(fullText)) {
    frontSvg += `
      <ellipse cx="0" cy="-76" rx="38" ry="9" fill="none" stroke="#facc15" stroke-width="5"/>
      <ellipse cx="0" cy="-76" rx="38" ry="9" fill="none" stroke="#fef08a" stroke-width="2"/>
    `;
  }
  if (/\b(cat ear|cat ears|neko|fox ear|fox ears|wolf ear|wolf ears)\b/.test(fullText)) {
    frontSvg += `
      <polygon points="-36,-28 -48,-72 -12,-42" fill="${hairColor}" stroke="#09090b" stroke-width="2.5"/>
      <polygon points="-33,-32 -42,-60 -18,-42" fill="#f472b6"/>
      <polygon points="36,-28 48,-72 12,-42" fill="${hairColor}" stroke="#09090b" stroke-width="2.5"/>
      <polygon points="33,-32 42,-60 18,-42" fill="#f472b6"/>
    `;
  }
  if (/\b(elf|elven|pointed ear|pointed ears)\b/.test(fullText)) {
    frontSvg += `
      <polygon points="-38,-6 -68,-18 -38,10" fill="#f3c69f" stroke="#09090b" stroke-width="2.2"/>
      <polygon points="38,-6 68,-18 38,10" fill="#f3c69f" stroke="#09090b" stroke-width="2.2"/>
    `;
  }
  if (/\b(antenna|antennae|alien)\b/.test(fullText)) {
    frontSvg += `
      <path d="M -16 -42 Q -28 -78 -36 -82" fill="none" stroke="#10b981" stroke-width="3"/>
      <circle cx="-36" cy="-82" r="5" fill="#6ee7b7" stroke="#09090b" stroke-width="1.5"/>
      <path d="M 16 -42 Q 28 -78 36 -82" fill="none" stroke="#10b981" stroke-width="3"/>
      <circle cx="36" cy="-82" r="5" fill="#6ee7b7" stroke="#09090b" stroke-width="1.5"/>
    `;
  }
  if (/\b(wizard hat|witch hat|mage hat|sorcerer hat)\b/.test(fullText)) {
    frontSvg += `
      <ellipse cx="0" cy="-28" rx="68" ry="12" fill="#3b0764" stroke="#09090b" stroke-width="3"/>
      <polygon points="-42,-28 0,-108 18,-95 42,-28" fill="#4c1d95" stroke="#09090b" stroke-width="3"/>
      <rect x="-38" y="-36" width="76" height="8" rx="2" fill="#f59e0b" stroke="#09090b" stroke-width="1.5"/>
    `;
  }
  if (/\b(top hat|gentleman hat)\b/.test(fullText)) {
    frontSvg += `
      <ellipse cx="0" cy="-26" rx="54" ry="9" fill="#18181b" stroke="#09090b" stroke-width="3"/>
      <rect x="-34" y="-82" width="68" height="56" rx="3" fill="#27272a" stroke="#09090b" stroke-width="3"/>
      <rect x="-34" y="-36" width="68" height="8" fill="#dc2626"/>
    `;
  }
  if (/\b(pirate hat|tricorne|captain hat)\b/.test(fullText)) {
    frontSvg += `
      <path d="M -64 -20 Q 0 -68 64 -20 L 42 -14 L -42 -14 Z" fill="#1c1917" stroke="#facc15" stroke-width="2.5"/>
      <circle cx="0" cy="-34" r="7" fill="#f8fafc"/>
    `;
  }
  if (/\b(baseball cap|cap|trucker hat)\b/.test(fullText)) {
    frontSvg += `
      <path d="M -42 -16 C -42 -56, 42 -56, 42 -16 Z" fill="${outfitPrimary}" stroke="#09090b" stroke-width="2.5"/>
      <path d="M -42 -16 Q 15 -24 58 -10 Q 15 -8 -42 -16 Z" fill="${accentColor}" stroke="#09090b" stroke-width="2"/>
    `;
  }
  if (/\b(headphone|headphones|headset)\b/.test(fullText)) {
    frontSvg += `
      <path d="M -44 -4 C -48 -58, 48 -58, 44 -4" fill="none" stroke="#334155" stroke-width="6"/>
      <rect x="-50" y="-14" width="12" height="24" rx="5" fill="${accentColor}" stroke="#09090b" stroke-width="2"/>
      <rect x="38" y="-14" width="12" height="24" rx="5" fill="${accentColor}" stroke="#09090b" stroke-width="2"/>
    `;
  }
  if (/\b(mohawk)\b/.test(fullText)) {
    frontSvg += `
      <polygon points="-8,-26 -14,-86 0,-96 14,-86 8,-26" fill="${hairColor}" stroke="#09090b" stroke-width="2.5"/>
    `;
  }
  if (/\b(afro)\b/.test(fullText)) {
    backSvg += `<circle cx="0" cy="-18" r="62" fill="${hairColor}" stroke="#09090b" stroke-width="3"/>`;
  }

  // 3. FACIAL HAIR & FACE MODS
  if (/\b(full beard|long beard|heavy beard|thick beard|wizard beard|beard)\b/.test(fullText) && !fullText.includes("stubble")) {
    const isLongBeard = /\b(long beard|wizard beard)\b/.test(fullText);
    frontSvg += `
      <path d="M -32 8 C -34 38, -18 ${isLongBeard ? 95 : 54}, 0 ${isLongBeard ? 105 : 58} C 18 ${isLongBeard ? 95 : 54}, 34 38, 32 8 C 20 18, 12 22, 0 22 C -12 22, -20 18, -32 8 Z"
            fill="${hairColor}" stroke="#09090b" stroke-width="2.5"/>
    `;
  }
  if (/\b(mustache|moustache|handlebar)\b/.test(fullText)) {
    frontSvg += `
      <path d="M -22 16 Q -10 8 0 14 Q 10 8 22 16 Q 10 22 0 17 Q -10 22 -22 16 Z" fill="${hairColor}" stroke="#09090b" stroke-width="1.8"/>
    `;
  }
  if (/\b(sunglasses|shades|aviators|dark glasses)\b/.test(fullText)) {
    frontSvg += `
      <g fill="#09090b" stroke="#facc15" stroke-width="2">
        <polygon points="-32,-9 -4,-9 -7,5 -28,5"/>
        <polygon points="4,-9 32,-9 28,5 7,5"/>
        <line x1="-4" y1="-6" x2="4" y2="-6"/>
      </g>
    `;
  }
  if (/\b(monocle)\b/.test(fullText)) {
    frontSvg += `
      <circle cx="15" cy="-3" r="10" fill="#38bdf8" fill-opacity="0.25" stroke="#facc15" stroke-width="2.2"/>
      <line x1="25" y1="0" x2="28" y2="28" stroke="#facc15" stroke-width="1.5"/>
    `;
  }
  if (/\b(third eye|mystic eye)\b/.test(fullText)) {
    frontSvg += `
      <ellipse cx="0" cy="-18" rx="8" ry="4.5" fill="#ffffff" stroke="#09090b" stroke-width="1.8"/>
      <circle cx="0" cy="-18" r="3" fill="${accentColor}"/>
    `;
  }
  if (/\b(fang|fangs|vampire)\b/.test(fullText)) {
    frontSvg += `
      <polygon points="-9,19 -6,27 -3,19" fill="#ffffff" stroke="#09090b" stroke-width="1"/>
      <polygon points="3,19 6,27 9,19" fill="#ffffff" stroke="#09090b" stroke-width="1"/>
    `;
  }
  if (/\b(cigar|cigarette|pipe|smoking)\b/.test(fullText)) {
    frontSvg += `
      <rect x="4" y="18" width="22" height="5" rx="1.5" transform="rotate(12 4 18)" fill="#92400e" stroke="#09090b" stroke-width="1.5"/>
      <circle cx="25" cy="23" r="2.5" fill="#ef4444"/>
      <path d="M 28 18 Q 34 6 28 -4 Q 24 -14 32 -24" fill="none" stroke="#cbd5e1" stroke-width="2" opacity="0.6"/>
    `;
  }
  if (/\b(tattoo|face mark|war paint|runes|markings)\b/.test(fullText)) {
    frontSvg += `
      <path d="M -26 4 L -14 8 L -22 16" fill="none" stroke="${accentColor}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M 26 4 L 14 8 L 22 16" fill="none" stroke="${accentColor}" stroke-width="2.5" stroke-linecap="round"/>
    `;
  }
  if (/\b(scarf|muffler)\b/.test(fullText)) {
    frontSvg += `
      <rect x="-34" y="34" width="68" height="18" rx="6" fill="#dc2626" stroke="#09090b" stroke-width="2.5"/>
      <polygon points="12,48 28,48 34,105 14,105" fill="#b91c1c" stroke="#09090b" stroke-width="2.5"/>
    `;
  }
  if (/\b(pauldron|shoulder pad|spiked shoulder)\b/.test(fullText)) {
    frontSvg += `
      <polygon points="-48,48 -95,38 -82,74 -48,72" fill="#475569" stroke="#09090b" stroke-width="3"/>
      <polygon points="48,48 95,38 82,74 48,72" fill="#475569" stroke="#09090b" stroke-width="3"/>
    `;
  }
  if (/\b(necklace|amulet|pendant|medallion|gold chain)\b/.test(fullText)) {
    frontSvg += `
      <path d="M -22 48 Q 0 78 22 48" fill="none" stroke="#facc15" stroke-width="3"/>
      <circle cx="0" cy="68" r="7" fill="${accentColor}" stroke="#facc15" stroke-width="2.5"/>
    `;
  }

  // 4. EXTRA WEAPONS & PROPS (shield, staff, axe, hammer, scythe, bow, guitar, book, torch)
  if (/\b(shield|aegis|buckler)\b/.test(fullText)) {
    frontSvg += `
      <path d="M -92 55 L -38 55 L -38 115 C -38 145, -65 165, -65 165 C -65 165, -92 145, -92 115 Z" fill="#1e293b" stroke="#facc15" stroke-width="4"/>
      <circle cx="-65" cy="102" r="12" fill="${accentColor}"/>
    `;
  }
  if (/\b(staff|magic staff|wizard staff|wand|scepter|trident|spear)\b/.test(fullText)) {
    frontSvg += `
      <line x1="88" y1="-75" x2="88" y2="195" stroke="#78350f" stroke-width="7" stroke-linecap="round"/>
      <circle cx="88" cy="-82" r="16" fill="${accentColor}" stroke="#fef08a" stroke-width="3"/>
      <circle cx="88" cy="-82" r="26" fill="${accentColor}" opacity="0.3"/>
    `;
  }
  if (/\b(axe|battleaxe|warhammer|hammer)\b/.test(fullText)) {
    frontSvg += `
      <line x1="86" y1="-55" x2="76" y2="180" stroke="#78350f" stroke-width="7"/>
      <path d="M 52 -48 Q 86 -30 122 -48 L 128 -12 Q 86 -26 46 -12 Z" fill="#94a3b8" stroke="#09090b" stroke-width="3"/>
    `;
  }
  if (/\b(scythe|reaper)\b/.test(fullText)) {
    frontSvg += `
      <line x1="82" y1="-85" x2="68" y2="195" stroke="#1e293b" stroke-width="6"/>
      <path d="M 82 -82 C 35 -95, -25 -75, -45 -45 C -10 -58, 40 -62, 80 -64 Z" fill="#e2e8f0" stroke="${accentColor}" stroke-width="2.5"/>
    `;
  }
  if (/\b(bow|archer|crossbow)\b/.test(fullText)) {
    frontSvg += `
      <path d="M 78 -55 C 118 -15, 118 65, 78 105" fill="none" stroke="#92400e" stroke-width="5"/>
      <line x1="78" y1="-55" x2="78" y2="105" stroke="#e2e8f0" stroke-width="1.8"/>
    `;
  }
  if (/\b(guitar|lute|instrument)\b/.test(fullText)) {
    frontSvg += `
      <g transform="translate(20, 95) rotate(-25)">
        <ellipse cx="0" cy="0" rx="34" ry="24" fill="#dc2626" stroke="#09090b" stroke-width="3"/>
        <rect x="28" y="-5" width="65" height="10" fill="#78350f" stroke="#09090b" stroke-width="2"/>
        <circle cx="0" cy="0" r="8" fill="#09090b"/>
      </g>
    `;
  }

  return { backSvg, frontSvg };
}

function hashStr(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export type StyleArchetype =
  | "manga_anime"
  | "gritty_graphic_novel"
  | "watercolor_storyboard"
  | "cyberpunk_neon"
  | "retro_comic"
  | "film_noir";

export function resolveStyleArchetype(artStyle: string = ""): StyleArchetype {
  const s = (artStyle || "").toLowerCase();
  if (/\b(manga|anime|shonen|seinen|chibi|webtoon|cel|studio trigger)\b/.test(s)) {
    return "manga_anime";
  }
  if (/\b(watercolor|watercolour|storybook|painterly|ghibli|pastel|gouache|impressionist)\b/.test(s)) {
    return "watercolor_storyboard";
  }
  if (/\b(cyberpunk|synthwave|neon noir|sci-fi|scifi|hologram|futuristic|blade runner)\b/.test(s)) {
    return "cyberpunk_neon";
  }
  if (/\b(retro|pop art|vintage comic|silver age|golden age|kirby|lichtenstein|ben-day|halftone)\b/.test(s)) {
    return "retro_comic";
  }
  if (/\b(noir|monochrome|black and white|b&w|chiaroscuro|shadowy|detective|sin city)\b/.test(s)) {
    return "film_noir";
  }
  return "gritty_graphic_novel";
}

export function deriveCharacterRig(char: CharacterProfile, artStyle: string): CharacterRigVisuals {
  const hairEyeText = `${char.identity.hairAndEyes}`.toLowerCase();
  const faceText = `${char.identity.facialFeatures} ${char.identity.hairAndEyes}`.toLowerCase();
  const attireText = `${char.currentAttire} ${char.role}`.toLowerCase();
  const fullText = `${char.name} ${char.role} ${char.identity.facialFeatures} ${char.identity.hairAndEyes} ${char.currentAttire} ${artStyle}`.toLowerCase();
  const h = hashStr(char.name || "hero");

  const skinPairs: [string, string][] = [
    ["#f3c69f", "#c58c63"],
    ["#e5b589", "#b47e52"],
    ["#f7d7c0", "#cc9e82"],
    ["#c98c58", "#8f592d"],
    ["#8f5834", "#5c3419"]
  ];
  const [baseSkinColor, baseSkinShadow] =
    /\b(green skin|alien|orc|goblin|reptile)\b/.test(faceText)
      ? ["#34d399", "#059669"]
      : /\b(blue skin|frost|avatar|ice skin)\b/.test(faceText)
      ? ["#60a5fa", "#2563eb"]
      : /\b(red skin|demon skin|oni|tiefling)\b/.test(faceText)
      ? ["#f87171", "#dc2626"]
      : /\b(purple skin|violet skin|void)\b/.test(faceText)
      ? ["#c084fc", "#7e22ce"]
      : /\b(grey skin|gray skin|zombie|undead|cyborg skin|metal skin|robot)\b/.test(faceText)
      ? ["#94a3b8", "#475569"]
      : faceText.includes("fair") || faceText.includes("pale") || faceText.includes("ethereal") || faceText.includes("vampire")
      ? ["#f7d7c0", "#cc9e82"]
      : faceText.includes("dark skin") || faceText.includes("deep") || faceText.includes("brown skin")
      ? ["#8f5834", "#5c3419"]
      : faceText.includes("olive") || faceText.includes("weathered") || faceText.includes("tan")
      ? ["#dfb088", "#a8764e"]
      : skinPairs[h % skinPairs.length];

  const skinColor = char.identity.customColors?.skin || baseSkinColor;
  const skinShadow = baseSkinShadow;

  // Split hair clause from eye clause so "green hair and blue eyes" or "brown hair and green eyes" never collide
  const clauses = hairEyeText.split(/;|,|\band\b|\bwith\b/);
  const hairClause = clauses.filter((c) => !c.includes("eye") && !c.includes("visor")).join(" ") || hairEyeText;
  const eyeClause = clauses.filter((c) => c.includes("eye") || c.includes("iris") || c.includes("visor")).join(" ") || `${hairEyeText} ${faceText}`;

  const [hairColor, hairHighlight] =
    /\b(green|emerald|lime|mint|jade|forest|viridis)\b/.test(hairClause)
      ? ["#10b981", "#6ee7b7"]
      : /\b(brown|brunette|chestnut|chocolate|walnut|hazel|mocha)\b/.test(hairClause)
      ? ["#78350f", "#d97706"]
      : /\b(orange|ginger|copper|flame|tangerine|rust)\b/.test(hairClause)
      ? ["#ea580c", "#fdba74"]
      : /\b(blonde|blond|golden|yellow|platinum|gold|flaxen)\b/.test(hairClause)
      ? ["#eab308", "#fef08a"]
      : /\b(red|crimson|scarlet|ruby|maroon|burgundy|auburn|vermilion)\b/.test(hairClause)
      ? ["#dc2626", "#f87171"]
      : /\b(cyan|teal|turquoise|aqua)\b/.test(hairClause)
      ? ["#06b6d4", "#67e8f9"]
      : /\b(blue|navy|cobalt|sapphire|indigo|azure)\b/.test(hairClause)
      ? ["#2563eb", "#93c5fd"]
      : /\b(purple|violet|lavender|lilac|amethyst|plum)\b/.test(hairClause)
      ? ["#9333ea", "#d8b4fe"]
      : /\b(pink|rose|magenta|coral|sakura|fuchsia)\b/.test(hairClause)
      ? ["#ec4899", "#f9a8d4"]
      : /\b(silver|white|grey|gray|ash|frost|snow)\b/.test(hairClause)
      ? ["#cbd5e1", "#ffffff"]
      : /\b(black|dark|raven|jet|obsidian|midnight)\b/.test(hairClause)
      ? ["#14161f", "#3b4259"]
      : ["#181a24", "#3f465e"];

  const isFemale =
    fullText.includes("mira") ||
    fullText.includes("lyra") ||
    fullText.includes("elena") ||
    fullText.includes("freya") ||
    fullText.includes("nova") ||
    fullText.includes("she") ||
    fullText.includes("her") ||
    fullText.includes("woman") ||
    fullText.includes("female") ||
    fullText.includes("girl") ||
    fullText.includes("valkyrie") ||
    fullText.includes("witch") ||
    fullText.includes("queen") ||
    fullText.includes("hacker");

  let hairStyle: HairStyleType = "short";
  if (fullText.includes("visor helm")) hairStyle = "visor_helm";
  else if (fullText.includes("helmet")) hairStyle = "helmet";
  else if (fullText.includes("crown")) hairStyle = "crown";
  else if (fullText.includes("cowboy hat")) hairStyle = "cowboy_hat";
  else if (attireText.includes("hood") || attireText.includes("cloak") || hairEyeText.includes("hooded")) hairStyle = "hooded";
  else if (hairEyeText.includes("spiky") || hairEyeText.includes("spike")) hairStyle = "spiky";
  else if (hairEyeText.includes("twin") || hairEyeText.includes("pigtail")) hairStyle = "twin_tails";
  else if (hairEyeText.includes("ponytail") || hairEyeText.includes("topknot")) hairStyle = "ponytail";
  else if (hairEyeText.includes("braid")) hairStyle = "braided";
  else if (hairEyeText.includes("bob")) hairStyle = "bob";
  else if (hairEyeText.includes("undercut")) hairStyle = "undercut";
  else if (hairEyeText.includes("slick")) hairStyle = "slick";
  else if (hairEyeText.includes("buzz") || hairEyeText.includes("cropped") || hairEyeText.includes("bald")) hairStyle = "buzz";
  else if (hairEyeText.includes("messy") || hairEyeText.includes("tousled")) hairStyle = "messy";
  else if (hairEyeText.includes("short")) hairStyle = "short";
  else if (hairEyeText.includes("long") || hairEyeText.includes("flowing") || isFemale) hairStyle = "long";
  else if (fullText.includes("kael") || fullText.includes("anime")) hairStyle = "spiky";

  const eyeColor =
    /\b(cyan|teal|aqua|turquoise)\b/.test(eyeClause)
      ? "#00f5d4"
      : /\b(emerald|green|lime|jade|mint)\b/.test(eyeClause)
      ? "#10b981"
      : /\b(amber|gold|golden|yellow|orange|hazel)\b/.test(eyeClause)
      ? "#f59e0b"
      : /\b(violet|purple|amethyst|magenta|pink)\b/.test(eyeClause)
      ? "#a855f7"
      : /\b(red|crimson|scarlet|ruby)\b/.test(eyeClause)
      ? "#f43f5e"
      : /\b(brown|dark)\b/.test(eyeClause)
      ? "#92400e"
      : /\b(silver|white|grey|gray)\b/.test(eyeClause)
      ? "#e2e8f0"
      : "#38bdf8";

  let outfitStyle: OutfitStyleType = "trench_coat";
  const charText = `${char.name} ${char.role} ${char.currentAttire} ${char.identity.facialFeatures} ${char.identity.hairAndEyes}`.toLowerCase();
  const isDemon = /\b(demon|devil|infernal|fiend|hell|horns|scythe|reaper|fallen|dante)\b/.test(charText);
  const isAngel = /\b(seraph|seraphina|angel|valkyrie|celestial|halo|wings|feathered wings|holy|divine|cleric|paladin)\b/.test(charText) && !isDemon;

  if (isAngel || charText.includes("royal") || charText.includes("cloak") || charText.includes("robe") || charText.includes("mage")) outfitStyle = "royal_cloak";
  else if (isDemon || charText.includes("wasteland") || charText.includes("plate") || charText.includes("armor") || charText.includes("knight")) outfitStyle = "wasteland_plate";
  else if (charText.includes("lab") || charText.includes("scientist") || charText.includes("doctor")) outfitStyle = "lab_coat";
  else if (charText.includes("military") || charText.includes("field jacket") || charText.includes("uniform") || charText.includes("olive") || charText.includes("commander")) outfitStyle = "military_armor";
  else if (charText.includes("samurai") || charText.includes("kimono") || charText.includes("ronin")) outfitStyle = "samurai_garb";
  else if (charText.includes("stealth") || charText.includes("assassin") || charText.includes("pilot")) outfitStyle = "stealth_suit";
  else if (charText.includes("cyber") || charText.includes("jacket") || isFemale) outfitStyle = "cyber_jacket";

  let outfitPrimary = "#18181b";
  let outfitDark = "#09090b";

  if (isDemon) {
    if (charText.includes("crimson") || charText.includes("red")) {
      outfitPrimary = "#881337";
      outfitDark = "#4c0519";
    } else {
      outfitPrimary = "#18181b";
      outfitDark = "#09090b";
    }
  } else if (isAngel) {
    if (charText.includes("purple") || charText.includes("royal") || charText.includes("violet")) {
      outfitPrimary = "#3b0764";
      outfitDark = "#1e1b4b";
    } else {
      outfitPrimary = "#f1f5f9";
      outfitDark = "#cbd5e1";
    }
  } else if (/\b(crimson|red|scarlet|ruby|maroon)\b/.test(attireText)) {
    outfitPrimary = "#881337";
    outfitDark = "#4c0519";
  } else if (/\b(gold|golden|yellow|amber)\b/.test(attireText)) {
    outfitPrimary = "#b45309";
    outfitDark = "#78350f";
  } else if (/\b(green|emerald|jade|lime)\b/.test(attireText)) {
    outfitPrimary = "#065f46";
    outfitDark = "#064e3b";
  } else if (/\b(olive|military|field jacket|uniform|camo)\b/.test(attireText)) {
    outfitPrimary = "#3f4f3c";
    outfitDark = "#232d21";
  } else if (/\b(blue|navy|cobalt|sapphire)\b/.test(attireText)) {
    outfitPrimary = "#1e3a8a";
    outfitDark = "#172554";
  } else if (/\b(white|silver|ivory|lab)\b/.test(attireText)) {
    outfitPrimary = "#e2e8f0";
    outfitDark = "#94a3b8";
  } else if (/\b(purple|violet|royal|plum)\b/.test(attireText)) {
    outfitPrimary = "#3b0764";
    outfitDark = "#1e1b4b";
  } else if (/\b(brown|leather|bronze|copper)\b/.test(attireText)) {
    outfitPrimary = "#5c2d16";
    outfitDark = "#3b1d0e";
  } else if (/\b(trench|dark|black|coat|obsidian)\b/.test(attireText)) {
    outfitPrimary = "#1e2536";
    outfitDark = "#0d111a";
  } else {
    const fallbackPalettes = [
      ["#18181b", "#09090b"],
      ["#312e81", "#1e1b4b"],
      ["#1e2536", "#0d111a"],
      ["#064e3b", "#022c22"],
      ["#1e3a8a", "#172554"],
      ["#27272a", "#18181b"]
    ];
    [outfitPrimary, outfitDark] = fallbackPalettes[h % fallbackPalettes.length];
  }

  const outfitSecondary =
    isDemon
      ? "#ef4444"
      : isAngel
      ? "#f59e0b"
      : charText.includes("cyan") || charText.includes("neon")
      ? "#00f5d4"
      : charText.includes("crimson") || charText.includes("scarlet")
      ? "#f43f5e"
      : charText.includes("royal") || charText.includes("mage") || charText.includes("purple")
      ? "#c084fc"
      : charText.includes("gold") || charText.includes("yellow")
      ? "#f59e0b"
      : isFemale
      ? "#f43f5e"
      : "#38bdf8";

  const faceAndHair = `${faceText} ${hairEyeText}`;
  let accessory: AccessoryType = "none";
  if (faceAndHair.includes("visor")) accessory = "visor";
  else if (faceAndHair.includes("eyepatch")) accessory = "eyepatch";
  else if (faceAndHair.includes("glasses") || faceAndHair.includes("goggles")) accessory = "glasses";
  else if (faceAndHair.includes("mask") || faceAndHair.includes("masked")) accessory = "mask";
  else if (faceAndHair.includes("headband")) accessory = "headband";

  const propType: CharacterRigVisuals["propType"] =
    attireText.includes("rifle") || attireText.includes("sniper") || attireText.includes("springfield")
      ? "rifle"
      : attireText.includes("katana") || attireText.includes("samurai")
      ? "katana"
      : attireText.includes("sword") || attireText.includes("blade")
      ? "blade"
      : attireText.includes("orb") || attireText.includes("magic") || attireText.includes("spell")
      ? "energy_orb"
      : attireText.includes("drive") || attireText.includes("data") || attireText.includes("blueprint") || attireText.includes("hologram") || attireText.includes("tablet")
      ? "holodrive"
      : attireText.includes("pistol") || attireText.includes("gun")
      ? "pistol"
      : "coat_collar";

  const finalHairColor = char.identity.customColors?.hair || hairColor;
  const finalHairHighlight = char.identity.customColors?.hairHighlight || hairHighlight;
  const finalEyeColor = char.identity.customColors?.eye || eyeColor;
  const finalOutfitPrimary = char.identity.customColors?.outfitPrimary || outfitPrimary;
  const finalOutfitSecondary = char.identity.customColors?.outfitSecondary || outfitSecondary;

  const procedural = buildProceduralUnstoredLayers(
    fullText,
    finalOutfitSecondary,
    finalHairColor,
    finalOutfitPrimary
  );

  return {
    skinColor,
    skinShadow,
    hairColor: finalHairColor,
    hairHighlight: finalHairHighlight,
    hairStyle,
    eyeColor: finalEyeColor,
    outfitStyle,
    outfitPrimary: finalOutfitPrimary,
    outfitDark,
    outfitSecondary: finalOutfitSecondary,
    accentGlow: finalOutfitSecondary,
    hasScar: faceText.includes("scar"),
    hasStubble: faceText.includes("stubble") || faceText.includes("beard") || faceText.includes("weathered"),
    accessory,
    isFemale,
    propType,
    customBackSvg: procedural.backSvg,
    customSvg: `${procedural.frontSvg}${char.identity.customSvg || ""}`
  };
}

export function selectBestBackground(
  sceneDescription: string,
  artStyle: string,
  editDirective?: string,
  sequenceIndex: number = 0,
  variationSeed: number = 0
): BackgroundDef {
  const query = `${sceneDescription} ${editDirective || ""} ${artStyle}`.toLowerCase();

  // Check if a specific background ID was explicitly chosen from the Vault
  const explicitMatch = BACKGROUND_CATALOG.find((b) => query.includes(b.id.toLowerCase()));
  if (explicitMatch) return explicitMatch;

  const styleArch = resolveStyleArchetype(artStyle);

  let preferredCat: BgCategory = "modern";
  if (query.includes("cyber") || query.includes("neon") || query.includes("sector") || query.includes("drone") || styleArch === "cyberpunk_neon") {
    preferredCat = "cyberpunk";
  } else if (query.includes("shonen") || query.includes("manga") || query.includes("anime") || styleArch === "manga_anime") {
    preferredCat = "anime";
  } else if (query.includes("wwii") || query.includes("beach") || query.includes("landing craft") || query.includes("miller") || query.includes("bunker") || query.includes("soldier") || query.includes("overlord")) {
    preferredCat = "military";
  } else if (query.includes("noir") || query.includes("detective") || query.includes("crime") || styleArch === "film_noir") {
    preferredCat = "noir";
  } else if (query.includes("watercolor") || query.includes("storybook") || query.includes("painterly") || query.includes("fantasy") || query.includes("castle") || query.includes("dragon") || query.includes("magic") || query.includes("throne") || styleArch === "watercolor_storyboard") {
    preferredCat = "fantasy";
  } else if (query.includes("space") || query.includes("starship") || query.includes("orbit")) {
    preferredCat = "space";
  } else if (query.includes("retro") || query.includes("pop art") || query.includes("superhero") || query.includes("metropolis") || styleArch === "retro_comic") {
    preferredCat = "superhero";
  } else if (query.includes("wasteland") || query.includes("apocalyp") || query.includes("ruins")) {
    preferredCat = "wasteland";
  } else if (query.includes("horror") || query.includes("haunted") || query.includes("crypt")) {
    preferredCat = "horror";
  } else if (query.includes("steampunk") || query.includes("brass") || query.includes("airship")) {
    preferredCat = "steampunk";
  } else if (query.includes("underwater") || query.includes("abyss") || query.includes("submarine")) {
    preferredCat = "underwater";
  } else if (query.includes("olympus") || query.includes("myth")) {
    preferredCat = "mythology";
  } else if (query.includes("western") || query.includes("cowboy") || query.includes("saloon")) {
    preferredCat = "western";
  } else if (query.includes("samurai") || query.includes("shogun")) {
    preferredCat = "historical";
  }

  const scored = BACKGROUND_CATALOG.map((bg) => {
    let score = bg.category === preferredCat ? 7 : 0;
    for (const kw of bg.keywords) {
      if (query.includes(kw)) {
        score += VARIANTS.some((v) => v.variant === bg.variant && v.tags.includes(kw)) ? 9 : 2;
      }
    }
    return { bg, score };
  }).sort((a, b) => b.score - a.score);

  const topPool = scored.filter((s) => s.score >= scored[0].score - 4);
  const poolSize = Math.max(1, Math.min(6, topPool.length));
  const pickIdx = (sequenceIndex + (variationSeed > 0 ? variationSeed : 0)) % poolSize;
  return (topPool[pickIdx] || scored[sequenceIndex % scored.length]).bg;
}

export function parseSceneLayersFromText(
  beatDescription: string,
  styleBible: StyleBible,
  characters: CharacterProfile[],
  editDirective?: string,
  sequenceIndex: number = 0,
  variationSeed: number = 0
) {
  const editLower = (editDirective || "").toLowerCase();
  const textPool = `${beatDescription} ${editDirective || ""}`.toLowerCase();
  // If the user's latest edit or beat requests plain background or clears weather, honor it over the initial story text
  const isPlainBg =
    textPool.includes("plain") ||
    textPool.includes("solid background") ||
    textPool.includes("flat background") ||
    textPool.includes("plain background") ||
    textPool.includes("solid color") ||
    textPool.includes("monochrome background") ||
    textPool.includes("blank background") ||
    /\b(plain|solid|flat)\s+(light\s+|dark\s+)?(green|white|black|yellow|cyan|teal|blue|pink|purple|red|orange|gray|grey)\b/.test(textPool) ||
    /\b(light\s+|dark\s+)?(green|white|black|yellow|cyan|teal|blue|pink|purple|red|orange|gray|grey)\s+background\b/.test(textPool);

  const noRainRequested =
    textPool.includes("no rain") ||
    textPool.includes("remove rain") ||
    textPool.includes("stop rain") ||
    textPool.includes("clear weather") ||
    isPlainBg;

  const combined = `${beatDescription} ${styleBible.visualTone} ${styleBible.lightingStyle} ${editDirective || ""}`.toLowerCase();

  const background = selectBestBackground(beatDescription, styleBible.artStyle, editDirective, sequenceIndex, variationSeed);

  let weather: WeatherType = "none";
  if (!noRainRequested) {
    if (combined.includes("heavy rain") || combined.includes("heavy_rain") || combined.includes("downpour") || combined.includes("storm")) {
      weather = "heavy_rain";
    } else if (combined.includes("rain") || combined.includes("wet") || combined.includes("drizzle") || combined.includes("spray")) {
      weather = "rain";
    } else if (combined.includes("ember") || combined.includes("fire") || combined.includes("burning")) {
      weather = "embers";
    } else if (combined.includes("fog") || combined.includes("mist") || combined.includes("haze")) {
      weather = "fog";
    } else if (combined.includes("smoke") || combined.includes("artillery")) {
      weather = "smoke";
    } else if (combined.includes("snow") || combined.includes("blizzard")) {
      weather = "snow";
    }
  }

  const vfx: VfxType[] = [];
  if (!isPlainBg || (editDirective && (editDirective.includes("spark") || editDirective.includes("laser") || editDirective.includes("explosion")))) {
    if (combined.includes("spark") || combined.includes("voltage") || combined.includes("transformer") || combined.includes("electric") || combined.includes("lightning") || combined.includes("coil")) {
      vfx.push("sparks");
    }
    if (combined.includes("laser") || combined.includes("drone") || combined.includes("red beam") || combined.includes("sights") || combined.includes("target")) {
      vfx.push("lasers");
    }
    if (combined.includes("explosion") || combined.includes("blast") || combined.includes("detonat")) {
      vfx.push("explosion");
    }
    if (combined.includes("hologram") || combined.includes("holographic") || combined.includes("blueprint") || combined.includes("projection") || combined.includes("drive")) {
      vfx.push("hologram");
    }
    if (combined.includes("lunging") || combined.includes("struck") || combined.includes("strikes") || combined.includes("leap") || combined.includes("action") || combined.includes("speed") || combined.includes("counter")) {
      vfx.push("speed_lines");
    }
    if (combined.includes("magic") || combined.includes("spell") || combined.includes("aura") || combined.includes("power")) {
      vfx.push("magic_aura");
    }
  }

  const cameraCycle: CameraShot[] = ["medium", "closeup", "wide", "low_angle", "dramatic_side"];
  let camera: CameraShot = variationSeed > 0 ? cameraCycle[variationSeed % cameraCycle.length] : "medium";
  if (editLower.includes("wider") || editLower.includes("wide") || editLower.includes("establishing")) {
    camera = "wide";
  } else if (editLower.includes("closer") || editLower.includes("closeup") || editLower.includes("close") || editLower.includes("zoom") || editLower.includes("face")) {
    camera = "closeup";
  } else if (editLower.includes("low-angle") || editLower.includes("low_angle") || editLower.includes("low angle") || editLower.includes("dramatic")) {
    camera = "low_angle";
  }

  let lighting: LightingMood = "default";
  if (editLower.includes("darker") || editLower.includes("shadow") || editLower.includes("night")) {
    lighting = "darker";
  } else if (editLower.includes("bright") || editLower.includes("daylight")) {
    lighting = "brighter";
  } else if (editLower.includes("red") || editLower.includes("crimson") || combined.includes("red laser")) {
    lighting = "crimson";
  } else if (editLower.includes("emerald") || editLower.includes("green")) {
    lighting = "emerald";
  } else if (editLower.includes("gold") || editLower.includes("sunset") || editLower.includes("warm")) {
    lighting = "golden";
  } else if (editLower.includes("neon") || editLower.includes("cyan")) {
    lighting = "neon";
  }

  const sceneChars = characters.filter((c) =>
    c.name
      .toLowerCase()
      .split(/\s+/)
      .filter((p) => p.length > 2)
      .some((p) => combined.includes(p))
  );
  const hasMultipleCue = /\b(they|them|both|two|confront|clash|together|duel|each other|vs|against|deflect)\b/.test(combined);
  const activeCharacters =
    sceneChars.length > 0
      ? hasMultipleCue && sceneChars.length === 1 && characters.length > 1
        ? [sceneChars[0], ...characters.filter((c) => c.id !== sceneChars[0].id).slice(0, 1)]
        : sceneChars.slice(0, 3)
      : characters.slice(0, Math.min(2, characters.length));

  const posePool: CharPose[] = ["standing", "action", "pointing", "crouching", "aiming", "crossed_arms", "blade_ready"];

  const charPlacements = activeCharacters.map((c, idx) => {
    let pose: CharPose = variationSeed > 0 ? posePool[(variationSeed + idx) % posePool.length] : "standing";
    if (combined.includes("crossed_arms") || combined.includes("crossed arms") || combined.includes("handsfolded") || combined.includes("arms folded")) {
      pose = "crossed_arms";
    } else if (combined.includes("thumbs_up") || combined.includes("thumbs up") || combined.includes("thumbsup")) {
      pose = "thumbs_up";
    } else if (combined.includes("thinking") || combined.includes("chin") || combined.includes("ponder")) {
      pose = "thinking";
    } else if (combined.includes("hand_on_hip") || combined.includes("hand on hip")) {
      pose = "hand_on_hip";
    } else if (combined.includes("crouch") || combined.includes("pinned") || combined.includes("cover") || combined.includes("duck")) {
      pose = "crouching";
    } else if (combined.includes("struck") || combined.includes("strikes") || combined.includes("fight") || combined.includes("counter") || combined.includes("leap") || combined.includes("action")) {
      pose = "action";
    } else if (combined.includes("run") || combined.includes("sprint") || combined.includes("lung") || combined.includes("move")) {
      pose = "running";
    } else if (combined.includes("hand") || combined.includes("point") || combined.includes("blueprint") || combined.includes("exchange") || combined.includes("drive")) {
      pose = "pointing";
    } else if (combined.includes("aim") || combined.includes("suppress") || combined.includes("rifle") || combined.includes("gun")) {
      pose = "aiming";
    } else if (combined.includes("sword") || combined.includes("katana") || combined.includes("blade") || combined.includes("blade_ready")) {
      pose = "blade_ready";
    }

    let expression: CharExpression = "determined";
    if (combined.includes("happy") || combined.includes("laugh") || combined.includes("joy") || combined.includes("grin")) {
      expression = "happy";
    } else if (combined.includes("sad") || combined.includes("cry") || combined.includes("grief") || combined.includes("sorrow")) {
      expression = "sad";
    } else if (combined.includes("wink")) {
      expression = "wink";
    } else if (combined.includes("worried") || combined.includes("nervous") || combined.includes("anxious") || combined.includes("sweat")) {
      expression = "worried";
    } else if (/\b(clash|strike|fight|collided|battle|combat|blades|furious|rage|angry|fierce|shout|yell)\b/.test(combined)) {
      expression = "angry";
    } else if (/\b(shocked|surprised|gasp|stunned|ambush|trap)\b/.test(combined)) {
      expression = "shocked";
    } else if (combined.includes("smirk") || combined.includes("confident") || combined.includes("smile")) {
      expression = "smirking";
    } else if (combined.includes("calm") || combined.includes("victorious") || combined.includes("watch")) {
      expression = "focused";
    }

    return {
      character: c,
      rig: deriveCharacterRig(c, styleBible.artStyle),
      pose,
      expression,
      slotIndex: idx,
      totalInScene: activeCharacters.length
    };
  });

  return {
    background,
    weather,
    vfx,
    camera,
    lighting,
    charPlacements
  };
}

export function generateStyleDefsSvg(style: StyleArchetype, uid: string): string {
  switch (style) {
    case "manga_anime":
      return `
        <!-- Manga / Anime Screentone Dots & Action Accents -->
        <pattern id="screentone_${uid}" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="0.9" fill="#000000" opacity="0.16"/>
        </pattern>
        <radialGradient id="animeStarburst_${uid}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
          <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0"/>
        </radialGradient>
      `;

    case "watercolor_storyboard":
      return `
        <!-- Fluid Watercolor Dispersion & Warm Sun Radiance -->
        <filter id="wcFilter_${uid}" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.8" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <radialGradient id="wcSunGlow_${uid}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fde047" stop-opacity="0.75"/>
          <stop offset="45%" stop-color="#fb923c" stop-opacity="0.32"/>
          <stop offset="100%" stop-color="#ea580c" stop-opacity="0"/>
        </radialGradient>
      `;

    case "cyberpunk_neon":
      return `
        <!-- Cyberpunk Neon Light Bloom & Hologram Ground Grid -->
        <filter id="neonBloom_${uid}" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <pattern id="cyberGrid_${uid}" width="40" height="20" patternUnits="userSpaceOnUse">
          <line x1="0" y1="20" x2="40" y2="20" stroke="#00f5d4" stroke-width="0.85" opacity="0.32"/>
          <line x1="20" y1="0" x2="20" y2="20" stroke="#f72585" stroke-width="0.85" opacity="0.22"/>
        </pattern>
      `;

    case "retro_comic":
      return `
        <!-- 1960s Pop-Art Ben-Day Halftone Dots -->
        <pattern id="bendedDots_${uid}" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2.2" fill="#e11d48" opacity="0.26"/>
        </pattern>
        <pattern id="bendedDotsCyan_${uid}" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2.2" fill="#0284c7" opacity="0.25"/>
        </pattern>
      `;

    case "film_noir":
      return `
        <!-- Film Noir Venetian Blind Diagonal Shadow Slits -->
        <pattern id="venetian_${uid}" width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
          <rect x="0" y="0" width="34" height="15" fill="#000000" opacity="0.42"/>
        </pattern>
      `;

    default: // gritty_graphic_novel
      return `
        <!-- Gritty 1990s Graphic Novel Ink Crosshatch -->
        <pattern id="crosshatch_${uid}" width="8" height="8" patternUnits="userSpaceOnUse">
          <line x1="0" y1="8" x2="8" y2="0" stroke="#09090b" stroke-width="1.2" opacity="0.35"/>
          <line x1="0" y1="0" x2="8" y2="8" stroke="#09090b" stroke-width="0.8" opacity="0.22"/>
        </pattern>
      `;
  }
}

export function renderStyleForegroundOverlay(style: StyleArchetype): string {
  switch (style) {
    case "manga_anime":
      return `
        <!-- Manga Dynamic Action Speedlines in Corners -->
        <g stroke="#ffffff" stroke-width="1.6" opacity="0.18" pointer-events="none">
          <line x1="0" y1="0" x2="160" y2="110"/>
          <line x1="0" y1="40" x2="120" y2="120"/>
          <line x1="1024" y1="0" x2="864" y2="110"/>
          <line x1="1024" y1="40" x2="904" y2="120"/>
        </g>
      `;

    case "watercolor_storyboard":
      return `
        <!-- Soft Golden Hour Sunlight Vignette -->
        <radialGradient id="wcWarmVignette" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stop-color="#fef08a" stop-opacity="0.08"/>
          <stop offset="80%" stop-color="#ea580c" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#451a03" stop-opacity="0.25"/>
        </radialGradient>
        <rect width="1024" height="576" fill="url(#wcWarmVignette)" pointer-events="none"/>
      `;

    case "cyberpunk_neon":
      return `
        <!-- Cyberpunk Hologram Scanlines & Lens Flares -->
        <g pointer-events="none">
          <line x1="0" y1="2" x2="1024" y2="2" stroke="#00f5d4" stroke-width="1.5" opacity="0.35"/>
          <line x1="0" y1="574" x2="1024" y2="574" stroke="#f72585" stroke-width="1.5" opacity="0.35"/>
          <circle cx="120" cy="80" r="3" fill="#00f5d4" opacity="0.8"/>
          <circle cx="910" cy="90" r="3" fill="#f72585" opacity="0.8"/>
        </g>
      `;

    case "retro_comic":
      return `
        <!-- Retro Comic Print Yellowing & Border Vignette -->
        <rect width="1024" height="576" fill="#fef08a" opacity="0.04" pointer-events="none"/>
      `;

    case "film_noir":
      return `
        <!-- Dramatic Venetian Blind Diagonal Shadow Overlay -->
        <g fill="#000000" opacity="0.12" pointer-events="none">
          <polygon points="0,0 1024,0 1024,35 0,165"/>
          <polygon points="0,220 1024,90 1024,125 0,255"/>
          <polygon points="0,310 1024,180 1024,215 0,345"/>
          <polygon points="0,400 1024,270 1024,305 0,435"/>
          <polygon points="0,490 1024,360 1024,395 0,525"/>
        </g>
      `;

    default: // gritty_graphic_novel
      return `
        <!-- Cold Overcast Ink Wash Vignette -->
        <rect width="1024" height="576" fill="#090d16" opacity="0.08" pointer-events="none"/>
      `;
  }
}

function renderStyleEyesSvg(
  style: StyleArchetype,
  uid: string,
  rig: CharacterRigVisuals,
  expression: CharExpression,
  browTilt: number,
  inkStroke: string
): string {
  if (style === "manga_anime") {
    return `
      <!-- Authentic Anime / Manga Expressive Eyes -->
      <g>
        <!-- Left Eye -->
        <path d="M -29 -4 Q -16 -13 -3 -3 L -1 -5" fill="none" stroke="${inkStroke}" stroke-width="3.2" stroke-linecap="round"/>
        <ellipse cx="-16" cy="-2" rx="7" ry="9" fill="#09090b"/>
        <ellipse cx="-16" cy="-1.5" rx="6" ry="8" fill="url(#eyeGrad_${uid})"/>
        <ellipse cx="-16" cy="-1.5" rx="3.5" ry="5" fill="#09090b"/>
        <circle cx="-18.5" cy="-5" r="2.8" fill="#ffffff"/>
        <circle cx="-13" cy="2" r="1.5" fill="#ffffff"/>
        <path d="M -22 6 Q -16 8 -10 6" fill="none" stroke="${inkStroke}" stroke-width="1.8" stroke-linecap="round"/>

        <!-- Right Eye -->
        ${
          expression === "wink"
            ? `<path d="M 4 -2 Q 16 -10 28 -2" fill="none" stroke="${inkStroke}" stroke-width="3.8" stroke-linecap="round"/>
               <path d="M 12 1 L 10 5" stroke="${inkStroke}" stroke-width="2" stroke-linecap="round"/>
               <path d="M 20 1 L 22 5" stroke="${inkStroke}" stroke-width="2" stroke-linecap="round"/>`
            : `<path d="M 3 -3 Q 16 -13 29 -4 L 31 -5" fill="none" stroke="${inkStroke}" stroke-width="3.2" stroke-linecap="round"/>
               <ellipse cx="16" cy="-2" rx="7" ry="9" fill="#09090b"/>
               <ellipse cx="16" cy="-1.5" rx="6" ry="8" fill="url(#eyeGrad_${uid})"/>
               <ellipse cx="16" cy="-1.5" rx="3.5" ry="5" fill="#09090b"/>
               <circle cx="13.5" cy="-5" r="2.8" fill="#ffffff"/>
               <circle cx="19" cy="2" r="1.5" fill="#ffffff"/>
               <path d="M 10 6 Q 16 8 22 6" fill="none" stroke="${inkStroke}" stroke-width="1.8" stroke-linecap="round"/>`
        }

        <!-- Anime Cheek Blush Ticks -->
        <g stroke="#f43f5e" stroke-width="1.6" opacity="0.65" stroke-linecap="round">
          <line x1="-24" y1="12" x2="-20" y2="15"/>
          <line x1="-20" y1="12" x2="-16" y2="15"/>
          <line x1="16" y1="12" x2="20" y2="15"/>
          <line x1="20" y1="12" x2="24" y2="15"/>
        </g>

        <!-- Eyebrows -->
        <path d="M -28 ${-14 - browTilt} Q -16 -18 -5 ${-13 + browTilt}" fill="none" stroke="${inkStroke}" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M 28 ${-14 - browTilt} Q 16 -18 5 ${-13 + browTilt}" fill="none" stroke="${inkStroke}" stroke-width="3.2" stroke-linecap="round"/>
      </g>
    `;
  }

  if (style === "cyberpunk_neon") {
    return `
      <!-- Cyberpunk HUD Targeting Eyes & Neon Cheek Traces -->
      <g>
        <path d="M -26 -3 Q -16 -10 -6 -2 Q -16 4 -26 -3 Z" fill="#ffffff" stroke="${inkStroke}" stroke-width="2"/>
        <circle cx="-15" cy="-3" r="5.5" fill="${rig.eyeColor}"/>
        <circle cx="-15" cy="-3" r="7.5" fill="none" stroke="#00f5d4" stroke-width="1" stroke-dasharray="3 2" opacity="0.8"/>
        <circle cx="-15" cy="-3" r="2.5" fill="#09090b"/>
        <circle cx="-17" cy="-5" r="1.6" fill="#ffffff"/>
        <path d="M -27 -4 Q -16 -11 -5 -2" fill="none" stroke="${inkStroke}" stroke-width="3.5" stroke-linecap="round"/>

        ${
          expression === "wink"
            ? `<path d="M 6 -2 Q 16 -9 26 -2" fill="none" stroke="${inkStroke}" stroke-width="3.5" stroke-linecap="round"/>`
            : `<path d="M 6 -2 Q 16 -10 26 -3 Q 16 4 6 -2 Z" fill="#ffffff" stroke="${inkStroke}" stroke-width="2"/>
               <circle cx="15" cy="-3" r="5.5" fill="${rig.eyeColor}"/>
               <circle cx="15" cy="-3" r="7.5" fill="none" stroke="#f72585" stroke-width="1" stroke-dasharray="3 2" opacity="0.8"/>
               <circle cx="15" cy="-3" r="2.5" fill="#09090b"/>
               <circle cx="13" cy="-5" r="1.6" fill="#ffffff"/>
               <path d="M 5 -2 Q 16 -11 27 -4" fill="none" stroke="${inkStroke}" stroke-width="3.5" stroke-linecap="round"/>`
        }

        <!-- Glowing Cyber Seam Traces -->
        <path d="M 27 -2 L 34 3 L 34 16" fill="none" stroke="#00f5d4" stroke-width="1.6" stroke-linecap="round" opacity="0.85"/>
        <path d="M -27 -2 L -34 3 L -34 16" fill="none" stroke="#f72585" stroke-width="1.6" stroke-linecap="round" opacity="0.85"/>

        <path d="M -28 ${-13 - browTilt} Q -16 -16 -5 ${-12 + browTilt}" fill="none" stroke="${inkStroke}" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M 28 ${-13 - browTilt} Q 16 -16 5 ${-12 + browTilt}" fill="none" stroke="${inkStroke}" stroke-width="3.5" stroke-linecap="round"/>
      </g>
    `;
  }

  if (style === "watercolor_storyboard") {
    return `
      <!-- Soft Painterly Watercolor Eyes with Rosy Cheek Wash -->
      <g>
        <path d="M -25 -3 Q -16 -9 -7 -2 Q -16 3 -25 -3 Z" fill="#ffffff" stroke="${inkStroke}" stroke-width="1.8"/>
        <ellipse cx="-15" cy="-2.5" rx="5" ry="5.5" fill="${rig.eyeColor}" opacity="0.85"/>
        <ellipse cx="-15" cy="-2.5" rx="2.5" ry="2.8" fill="#18181b"/>
        <circle cx="-17" cy="-4.5" r="1.8" fill="#ffffff" opacity="0.9"/>
        <path d="M -26 -4 Q -16 -10 -6 -2" fill="none" stroke="${inkStroke}" stroke-width="2.6" stroke-linecap="round"/>

        ${
          expression === "wink"
            ? `<path d="M 6 -2 Q 16 -8 26 -2" fill="none" stroke="${inkStroke}" stroke-width="2.6" stroke-linecap="round"/>`
            : `<path d="M 7 -2 Q 16 -9 25 -3 Q 16 3 7 -2 Z" fill="#ffffff" stroke="${inkStroke}" stroke-width="1.8"/>
               <ellipse cx="15" cy="-2.5" rx="5" ry="5.5" fill="${rig.eyeColor}" opacity="0.85"/>
               <ellipse cx="15" cy="-2.5" rx="2.5" ry="2.8" fill="#18181b"/>
               <circle cx="13" cy="-4.5" r="1.8" fill="#ffffff" opacity="0.9"/>
               <path d="M 6 -2 Q 16 -10 26 -4" fill="none" stroke="${inkStroke}" stroke-width="2.6" stroke-linecap="round"/>`
        }

        <!-- Soft Rosy Watercolor Cheek Blush -->
        <ellipse cx="-18" cy="11" rx="10" ry="4.5" fill="#f43f5e" opacity="0.25"/>
        <ellipse cx="18" cy="11" rx="10" ry="4.5" fill="#f43f5e" opacity="0.25"/>

        <path d="M -27 ${-12 - browTilt} Q -16 -15 -6 ${-11 + browTilt}" fill="none" stroke="${inkStroke}" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M 27 ${-12 - browTilt} Q 16 -15 6 ${-11 + browTilt}" fill="none" stroke="${inkStroke}" stroke-width="2.6" stroke-linecap="round"/>
      </g>
    `;
  }

  if (style === "retro_comic") {
    return `
      <!-- Bold Pop-Art 1960s Comic Eyes -->
      <g>
        <path d="M -26 -3 Q -16 -11 -6 -2 Q -16 4 -26 -3 Z" fill="#ffffff" stroke="#000000" stroke-width="2.8"/>
        <circle cx="-15" cy="-3" r="5" fill="${rig.eyeColor}"/>
        <circle cx="-15" cy="-3" r="2.8" fill="#000000"/>
        <circle cx="-17" cy="-5" r="1.8" fill="#ffffff"/>
        <path d="M -28 -4 Q -16 -12 -4 -2" fill="none" stroke="#000000" stroke-width="4.2" stroke-linecap="round"/>

        ${
          expression === "wink"
            ? `<path d="M 5 -2 Q 16 -10 27 -2" fill="none" stroke="#000000" stroke-width="4.2" stroke-linecap="round"/>`
            : `<path d="M 6 -2 Q 16 -11 26 -3 Q 16 4 6 -2 Z" fill="#ffffff" stroke="#000000" stroke-width="2.8"/>
               <circle cx="15" cy="-3" r="5" fill="${rig.eyeColor}"/>
               <circle cx="15" cy="-3" r="2.8" fill="#000000"/>
               <circle cx="13" cy="-5" r="1.8" fill="#ffffff"/>
               <path d="M 4 -2 Q 16 -12 28 -4" fill="none" stroke="#000000" stroke-width="4.2" stroke-linecap="round"/>`
        }

        <path d="M -29 ${-13 - browTilt} Q -16 -17 -4 ${-12 + browTilt}" fill="none" stroke="#000000" stroke-width="4.2" stroke-linecap="round"/>
        <path d="M 29 ${-13 - browTilt} Q 16 -17 4 ${-12 + browTilt}" fill="none" stroke="#000000" stroke-width="4.2" stroke-linecap="round"/>
      </g>
    `;
  }

  if (style === "film_noir") {
    return `
      <!-- Film Noir Chiaroscuro High-Contrast Eyes -->
      <g>
        <polygon points="-36,-18 -4,-18 -2,12 -36,12" fill="#000000" opacity="0.65"/>
        <path d="M -25 -3 Q -16 -9 -7 -2" fill="none" stroke="#ffffff" stroke-width="2"/>
        <circle cx="-15" cy="-3" r="2" fill="#ffffff"/>

        ${
          expression === "wink"
            ? `<path d="M 6 -2 Q 16 -9 26 -2" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>`
            : `<polygon points="6,-18 36,-18 36,12 6,12" fill="#000000" opacity="0.25"/>
               <path d="M 7 -2 Q 16 -10 25 -3 Q 16 4 7 -2 Z" fill="#ffffff" stroke="#000000" stroke-width="2"/>
               <circle cx="15" cy="-3" r="4.5" fill="#09090b"/>
               <circle cx="13" cy="-5" r="1.8" fill="#ffffff"/>
               <path d="M 5 -2 Q 16 -11 27 -4" fill="none" stroke="#000000" stroke-width="3.5" stroke-linecap="round"/>`
        }

        <path d="M -28 ${-13 - browTilt} Q -16 -16 -5 ${-12 + browTilt}" fill="none" stroke="#000000" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M 28 ${-13 - browTilt} Q 16 -16 5 ${-12 + browTilt}" fill="none" stroke="#000000" stroke-width="3.5" stroke-linecap="round"/>
      </g>
    `;
  }

  // Default: gritty_graphic_novel
  return `
    <g>
      <polygon points="-28,-14 -6,-14 -10,-4 -28,-4" fill="#09090b" opacity="0.55"/>
      <path d="M -26 -3 Q -16 -10 -6 -2 Q -16 4 -26 -3 Z" fill="#ffffff" stroke="#000000" stroke-width="2.2"/>
      <circle cx="-15" cy="-3" r="4.8" fill="${rig.eyeColor}"/>
      <circle cx="-15" cy="-3" r="2.4" fill="#000000"/>
      <circle cx="-17" cy="-5" r="1.6" fill="#ffffff"/>
      <path d="M -27 -4 Q -16 -11 -5 -2" fill="none" stroke="#000000" stroke-width="3.8" stroke-linecap="round"/>
      <line x1="-22" y1="5" x2="-16" y2="7" stroke="#000000" stroke-width="1.4"/>

      ${
        expression === "wink"
          ? `<path d="M 6 -2 Q 16 -9 26 -2" fill="none" stroke="#000000" stroke-width="3.8" stroke-linecap="round"/>`
          : `<polygon points="6,-14 28,-14 28,-4 10,-4" fill="#09090b" opacity="0.45"/>
             <path d="M 6 -2 Q 16 -10 26 -3 Q 16 4 6 -2 Z" fill="#ffffff" stroke="#000000" stroke-width="2.2"/>
             <circle cx="15" cy="-3" r="4.8" fill="${rig.eyeColor}"/>
             <circle cx="15" cy="-3" r="2.4" fill="#000000"/>
             <circle cx="13" cy="-5" r="1.6" fill="#ffffff"/>
             <path d="M 5 -2 Q 16 -11 27 -4" fill="none" stroke="#000000" stroke-width="3.8" stroke-linecap="round"/>
             <line x1="16" y1="7" x2="22" y2="5" stroke="#000000" stroke-width="1.4"/>`
      }

      <path d="M -28 ${-13 - browTilt} Q -16 -16 -5 ${-12 + browTilt}" fill="none" stroke="#000000" stroke-width="3.8" stroke-linecap="round"/>
      <path d="M 28 ${-13 - browTilt} Q 16 -16 5 ${-12 + browTilt}" fill="none" stroke="#000000" stroke-width="3.8" stroke-linecap="round"/>
    </g>
  `;
}

function renderBackgroundLayerSvg(
  bg: BackgroundDef,
  palette: string[],
  lighting: LightingMood,
  variationSeed: number = 0,
  editDirective?: string,
  beatDescription?: string,
  artStyle: string = ""
): string {
  const textPool = `${beatDescription || ""} ${editDirective || ""}`.toLowerCase();
  const isPlain =
    textPool.includes("plain") ||
    textPool.includes("solid background") ||
    textPool.includes("flat background") ||
    textPool.includes("plain background") ||
    textPool.includes("solid color") ||
    textPool.includes("monochrome background") ||
    textPool.includes("blank background") ||
    /\b(plain|solid|flat)\s+(light\s+|dark\s+)?(green|white|black|yellow|cyan|teal|blue|pink|purple|red|orange|gray|grey)\b/.test(textPool) ||
    /\b(light\s+|dark\s+)?(green|white|black|yellow|cyan|teal|blue|pink|purple|red|orange|gray|grey)\s+background\b/.test(textPool);

  // If user asked for plain / solid color background
  if (isPlain) {
    let plainColor = "#18181b"; // default dark slate
    if (textPool.includes("light green") || textPool.includes("mint") || textPool.includes("lime") || textPool.includes("pastel green")) {
      plainColor = "#86efac";
    } else if (textPool.includes("dark green") || textPool.includes("forest green")) {
      plainColor = "#14532d";
    } else if (textPool.includes("green") || textPool.includes("emerald")) {
      plainColor = "#4ade80";
    } else if (textPool.includes("white")) {
      plainColor = "#f8fafc";
    } else if (textPool.includes("black")) {
      plainColor = "#09090b";
    } else if (textPool.includes("yellow")) {
      plainColor = "#fde047";
    } else if (textPool.includes("cyan") || textPool.includes("teal")) {
      plainColor = "#67e8f9";
    } else if (textPool.includes("blue")) {
      plainColor = "#60a5fa";
    } else if (textPool.includes("pink")) {
      plainColor = "#f472b6";
    } else if (textPool.includes("purple") || textPool.includes("violet")) {
      plainColor = "#c084fc";
    } else if (textPool.includes("red") || textPool.includes("crimson")) {
      plainColor = "#f87171";
    } else if (textPool.includes("orange")) {
      plainColor = "#fb923c";
    } else if (textPool.includes("gray") || textPool.includes("grey")) {
      plainColor = "#71717a";
    }

    return `
      <rect width="1024" height="576" fill="${plainColor}"/>
      <line x1="0" y1="520" x2="1024" y2="520" stroke="#000000" stroke-width="3" opacity="0.15"/>
    `;
  }

  const style = resolveStyleArchetype(artStyle);
  const uid = `bgs_${(variationSeed + hashStr(bg.id)) % 99999}`;

  let skyTop: string;
  let skyMid: string;
  let skyBot: string;

  if (style === "watercolor_storyboard") {
    skyTop = palette[0] || "#fb923c";
    skyMid = palette[1] || "#f472b6";
    skyBot = palette[2] || "#fde047";
  } else if (style === "manga_anime") {
    skyTop = "#180b2b";
    skyMid = "#2e1065";
    skyBot = "#38bdf8";
  } else if (style === "cyberpunk_neon") {
    skyTop = "#04060d";
    skyMid = "#0f084b";
    skyBot = "#26063b";
  } else if (style === "retro_comic") {
    skyTop = "#fde047";
    skyMid = "#fef08a";
    skyBot = "#faf5eb";
  } else if (style === "film_noir") {
    skyTop = "#030305";
    skyMid = "#09090b";
    skyBot = "#18181b";
  } else {
    [skyTop, skyMid, skyBot] =
      lighting === "darker"
        ? ["#020308", "#060a12", "#0f172a"]
        : lighting === "crimson"
        ? ["#140307", "#2e0712", "#4c0519"]
        : lighting === "emerald"
        ? ["#02140e", "#062e22", "#064e3b"]
        : lighting === "golden"
        ? ["#1c1008", "#451a03", "#9a3412"]
        : lighting === "brighter"
        ? ["#1e293b", "#334155", "#64748b"]
        : bg.skyColors;
  }

  const accent = palette[3] || bg.accentColor;
  const secondaryAccent = palette[1] || bg.secondaryAccent || "#38bdf8";
  const seed = variationSeed + bg.editionIndex * 7;
  const moonX = 180 + ((seed * 173 + hashStr(bg.id)) % 680);
  const moonY = 85 + ((seed * 43) % 55);

  const windowGrid = (x: number, y: number, cols: number, rows: number, w: number, h: number, gapX: number, gapY: number, col: string) => {
    const rects: string[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if ((r * 7 + c * 5 + x + seed) % 3 !== 0) {
          rects.push(
            `<rect x="${x + c * (w + gapX)}" y="${y + r * (h + gapY)}" width="${w}" height="${h}" fill="${col}" opacity="${0.22 + ((r + c + seed) % 3) * 0.18}"/>`
          );
        }
      }
    }
    return rects.join("");
  };

  let sceneGeometry = "";
  const shift = (seed % 3) * 18;

  if (style === "watercolor_storyboard") {
    sceneGeometry = `
      <!-- Soft Watercolor Rolling Mountains & Hills -->
      <path d="M 0 310 Q 220 200 480 280 T 1024 220 L 1024 576 L 0 576 Z" fill="${palette[3] || "#2a9d8f"}" opacity="0.45"/>
      <path d="M 0 350 Q 310 260 620 330 T 1024 280 L 1024 576 L 0 576 Z" fill="${palette[4] || "#264653"}" opacity="0.6"/>
      <path d="M 0 410 Q 250 340 512 400 T 1024 360 L 1024 576 L 0 576 Z" fill="${palette[1] || "#f4a261"}" opacity="0.7"/>
      <!-- Quaint Storybook Cottage / Castle Silhouette -->
      <g fill="#1f2937" opacity="0.8">
        <rect x="${160 + shift}" y="250" width="130" height="190" rx="4"/>
        <polygon points="${150 + shift},250 ${225 + shift},170 ${300 + shift},250"/>
        <rect x="${215 + shift}" y="185" width="20" height="30"/>
        <circle cx="${225 + shift}" cy="280" r="14" fill="#fef08a" opacity="0.9"/>
        <rect x="${680 - shift}" y="230" width="115" height="210" rx="3"/>
        <polygon points="${670 - shift},230 ${737 - shift},155 ${805 - shift},230"/>
        <circle cx="${737 - shift}" cy="265" r="12" fill="#fef08a" opacity="0.9"/>
      </g>
      <!-- Painterly Watercolor Trees -->
      <g fill="#166534" opacity="0.75">
        <ellipse cx="120" cy="370" rx="52" ry="70"/>
        <ellipse cx="160" cy="350" rx="46" ry="60"/>
        <ellipse cx="860" cy="360" rx="56" ry="75"/>
        <ellipse cx="900" cy="380" rx="48" ry="65"/>
      </g>
      <polygon points="0,460 1024,440 1024,576 0,576" fill="#e9c46a" opacity="0.4"/>
    `;
  } else if (style === "film_noir") {
    sceneGeometry = `
      <!-- Film Noir Monochromatic Architecture -->
      <g fill="#050507">
        <rect x="0" y="20" width="240" height="556"/>
        <rect x="240" y="110" width="90" height="466"/>
        <rect x="680" y="80" width="110" height="496"/>
        <rect x="790" y="10" width="234" height="566"/>
      </g>
      <!-- Stark Chiaroscuro Fire Escape Shadows -->
      <g stroke="#ffffff" stroke-width="1.8" opacity="0.22">
        <line x1="40" y1="90" x2="190" y2="90"/>
        <line x1="40" y1="180" x2="190" y2="180"/>
        <line x1="40" y1="270" x2="190" y2="270"/>
        <line x1="190" y1="90" x2="40" y2="180"/>
        <line x1="40" y1="180" x2="190" y2="270"/>
        <line x1="820" y1="100" x2="970" y2="100"/>
        <line x1="820" y1="190" x2="970" y2="190"/>
        <line x1="820" y1="280" x2="970" y2="280"/>
        <line x1="970" y1="100" x2="820" y2="190"/>
        <line x1="820" y1="190" x2="970" y2="280"/>
      </g>
      <!-- Solitary Glowing Vintage Streetlamp with Conical Spotlight Beam -->
      <g>
        <line x1="285" y1="200" x2="285" y2="475" stroke="#18181b" stroke-width="8"/>
        <path d="M 270 200 Q 285 180 300 200 Z" fill="#27272a"/>
        <polygon points="275,200 295,200 300,225 270,225" fill="#fef08a" stroke="#18181b" stroke-width="2"/>
        <polygon points="275,225 295,225 480,576 90,576" fill="#fef08a" opacity="0.18"/>
      </g>
      <!-- Wet Reflective Asphalt Cobblestones -->
      <polygon points="0,465 1024,465 1024,576 0,576" fill="#09090b"/>
      <ellipse cx="285" cy="510" rx="160" ry="24" fill="#ffffff" opacity="0.14"/>
    `;
  } else if (style === "retro_comic") {
    sceneGeometry = `
      <!-- Bold 1960s Pop-Art Comic Skyline -->
      <g stroke="#000000" stroke-width="4" stroke-linejoin="round">
        <rect x="25" y="65" width="145" height="425" fill="#2563eb"/>
        <rect x="185" y="135" width="115" height="355" fill="#e11d48"/>
        <rect x="315" y="35" width="175" height="455" fill="#0284c7"/>
        <rect x="575" y="85" width="155" height="405" fill="#eab308"/>
        <rect x="745" y="125" width="115" height="365" fill="#e11d48"/>
        <rect x="875" y="55" width="125" height="435" fill="#2563eb"/>
      </g>
      <!-- Bold Pop-Art Window Panes -->
      ${windowGrid(40, 90, 3, 10, 26, 18, 12, 14, "#fef08a")}
      ${windowGrid(335, 60, 4, 11, 24, 18, 12, 14, "#ffffff")}
      ${windowGrid(595, 110, 3, 9, 28, 18, 14, 16, "#fafafa")}
      ${windowGrid(895, 80, 3, 10, 22, 18, 12, 14, "#fef08a")}
      <!-- Retro Comic Billboard Frame -->
      <g stroke="#000000" stroke-width="3.5">
        <rect x="175" y="305" width="135" height="72" fill="#facc15"/>
        <text x="242" y="348" fill="#000000" font-family="impact, sans-serif" font-weight="900" font-size="22" text-anchor="middle" letter-spacing="2">POW!</text>
      </g>
      <polygon points="0,480 1024,480 1024,576 0,576" fill="#18181b" stroke="#000000" stroke-width="4"/>
    `;
  } else if (style === "cyberpunk_neon") {
    sceneGeometry = `
      <!-- Cyberpunk Monolith Mega-Towers -->
      <g fill="#04060d" stroke="#00f5d4" stroke-width="2.5">
        <polygon points="20,110 160,40 160,490 20,490"/>
        <polygon points="180,75 310,15 310,490 180,490"/>
        <polygon points="560,85 700,25 700,490 560,490" stroke="#f72585"/>
        <polygon points="720,35 860,105 860,490 720,490" stroke="#00f5d4"/>
        <rect x="880" y="55" width="130" height="435" stroke="#f72585"/>
      </g>
      <!-- Glowing Kanji Signage Towers -->
      <g fill="#090d16">
        <rect x="165" y="75" width="32" height="150" rx="4" stroke="#00f5d4" stroke-width="2.5"/>
        <text x="181" y="108" fill="#00f5d4" font-family="monospace" font-size="16" font-weight="900" text-anchor="middle">光</text>
        <text x="181" y="141" fill="#00f5d4" font-family="monospace" font-size="16" font-weight="900" text-anchor="middle">電</text>
        <text x="181" y="174" fill="#00f5d4" font-family="monospace" font-size="16" font-weight="900" text-anchor="middle">網</text>
        <rect x="705" y="55" width="34" height="180" rx="4" stroke="#f72585" stroke-width="2.5"/>
        <text x="722" y="90" fill="#f72585" font-family="monospace" font-size="16" font-weight="900" text-anchor="middle">新</text>
        <text x="722" y="125" fill="#f72585" font-family="monospace" font-size="16" font-weight="900" text-anchor="middle">東</text>
        <text x="722" y="160" fill="#f72585" font-family="monospace" font-size="16" font-weight="900" text-anchor="middle">京</text>
        <text x="722" y="195" fill="#f72585" font-family="monospace" font-size="16" font-weight="900" text-anchor="middle">市</text>
      </g>
      <!-- Flying Spinner Vehicle Trails -->
      <line x1="0" y1="160" x2="420" y2="150" stroke="#00f5d4" stroke-width="3" opacity="0.85"/>
      <circle cx="420" cy="150" r="4.5" fill="#ffffff"/>
      <line x1="1024" y1="205" x2="680" y2="220" stroke="#f72585" stroke-width="3" opacity="0.9"/>
      <circle cx="680" cy="220" r="4.5" fill="#ffffff"/>
      <!-- Perspective Cyber Holographic Ground Grid -->
      <polygon points="0,470 1024,470 1024,576 0,576" fill="#03040a"/>
      <polygon points="0,470 1024,470 1024,576 0,576" fill="url(#cyberGrid_${uid})"/>
      <ellipse cx="512" cy="520" rx="420" ry="35" fill="#f72585" opacity="0.24"/>
    `;
  } else if (style === "manga_anime") {
    sceneGeometry = `
      <!-- Anime / Manga Tokyo Horizon & Gabled Rooftops -->
      <g fill="#110926" stroke="#38bdf8" stroke-width="2">
        <polygon points="10,130 90,65 170,130 170,480 10,480"/>
        <polygon points="180,95 270,30 360,95 360,480 180,480"/>
        <rect x="580" y="80" width="130" height="400"/>
        <polygon points="730,120 820,50 910,120 910,480 730,480"/>
        <rect x="920" y="100" width="94" height="380"/>
      </g>
      <!-- Slanted Telephone Poles with Overhead Cross Wires -->
      <g stroke="#ffffff" stroke-width="1.8" opacity="0.45">
        <line x1="210" y1="80" x2="210" y2="480" stroke-width="4"/>
        <line x1="180" y1="120" x2="240" y2="120" stroke-width="3"/>
        <line x1="175" y1="145" x2="245" y2="145" stroke-width="3"/>
        <line x1="0" y1="95" x2="1024" y2="155"/>
        <line x1="0" y1="120" x2="1024" y2="180"/>
        <line x1="0" y1="145" x2="1024" y2="205"/>
      </g>
      ${windowGrid(595, 110, 3, 11, 24, 12, 12, 14, "#38bdf8")}
      <polygon points="0,470 1024,470 1024,576 0,576" fill="#0c071e"/>
      <line x1="0" y1="470" x2="1024" y2="470" stroke="#38bdf8" stroke-width="2"/>
    `;
  } else {
    // Default: gritty_graphic_novel
    sceneGeometry = `
      <!-- Gritty Graphic Novel Heavy Black Ink Facades -->
      <g fill="#090b10" stroke="#000000" stroke-width="3.5">
        <rect x="15" y="40" width="165" height="440"/>
        <polygon points="15,40 97,5 180,40"/>
        <rect x="${200 + shift}" y="90" width="130" height="390"/>
        <rect x="${620 - shift}" y="70" width="150" height="410"/>
        <rect x="790" y="30" width="180" height="450"/>
        <polygon points="790,30 880,0 970,30"/>
      </g>
      <!-- Industrial Iron Fire Escape Framework -->
      <g stroke="#000000" stroke-width="2.5">
        <line x1="40" y1="120" x2="155" y2="120"/>
        <line x1="40" y1="210" x2="155" y2="210"/>
        <line x1="40" y1="300" x2="155" y2="300"/>
        <line x1="155" y1="120" x2="40" y2="210"/>
        <line x1="40" y1="210" x2="155" y2="300"/>
        <line x1="820" y1="110" x2="940" y2="110"/>
        <line x1="820" y1="200" x2="940" y2="200"/>
        <line x1="820" y1="290" x2="940" y2="290"/>
        <line x1="940" y1="110" x2="820" y2="200"/>
        <line x1="820" y1="200" x2="940" y2="290"/>
      </g>
      ${windowGrid(215 + shift, 115, 3, 10, 26, 12, 12, 16, accent)}
      ${windowGrid(640 - shift, 95, 3, 11, 28, 12, 14, 16, secondaryAccent)}
      <polygon points="0,465 1024,465 1024,576 0,576" fill="#040608" stroke="#000000" stroke-width="3"/>
    `;
  }

  let styleSkyExtras = "";
  if (style === "watercolor_storyboard") {
    styleSkyExtras = `
      <circle cx="${moonX}" cy="${moonY}" r="56" fill="url(#wcSunGlow_${uid})"/>
      <circle cx="${moonX}" cy="${moonY}" r="34" fill="#fef08a" opacity="0.85"/>
      <g fill="#ffffff" opacity="0.32">
        <ellipse cx="260" cy="115" rx="150" ry="24"/>
        <ellipse cx="740" cy="95" rx="170" ry="28"/>
      </g>
    `;
  } else if (style === "manga_anime") {
    styleSkyExtras = `
      <g stroke="#ffffff" stroke-width="1.2" opacity="0.22">
        <line x1="512" y1="576" x2="80" y2="0"/>
        <line x1="512" y1="576" x2="260" y2="0"/>
        <line x1="512" y1="576" x2="764" y2="0"/>
        <line x1="512" y1="576" x2="944" y2="0"/>
      </g>
      <rect width="1024" height="260" fill="url(#screentone_${uid})"/>
      <path d="M ${moonX} ${moonY - 28} A 28 28 0 1 0 ${moonX + 24} ${moonY + 20} A 22 22 0 1 1 ${moonX} ${moonY - 28} Z" fill="#fef08a"/>
    `;
  } else if (style === "cyberpunk_neon") {
    styleSkyExtras = `
      <ellipse cx="512" cy="510" rx="580" ry="110" fill="#f72585" opacity="0.18"/>
      <rect x="175" y="75" width="28" height="120" rx="4" fill="#090d16" stroke="#00f5d4" stroke-width="2.5"/>
      <text x="189" y="105" fill="#00f5d4" font-family="monospace" font-size="14" font-weight="900" text-anchor="middle">光</text>
      <text x="189" y="135" fill="#00f5d4" font-family="monospace" font-size="14" font-weight="900" text-anchor="middle">電</text>
      <text x="189" y="165" fill="#00f5d4" font-family="monospace" font-size="14" font-weight="900" text-anchor="middle">網</text>
      <rect x="745" y="55" width="34" height="150" rx="4" fill="#090d16" stroke="#f72585" stroke-width="2.5"/>
      <text x="762" y="90" fill="#f72585" font-family="monospace" font-size="14" font-weight="900" text-anchor="middle">シ</text>
      <text x="762" y="120" fill="#f72585" font-family="monospace" font-size="14" font-weight="900" text-anchor="middle">テ</text>
      <text x="762" y="150" fill="#f72585" font-family="monospace" font-size="14" font-weight="900" text-anchor="middle">ィ</text>
      <polygon points="0,475 1024,475 1024,576 0,576" fill="url(#cyberGrid_${uid})"/>
    `;
  } else if (style === "retro_comic") {
    styleSkyExtras = `
      <rect width="1024" height="300" fill="url(#bendedDots_${uid})"/>
      <polygon points="512,160 480,0 544,0" fill="#eab308" opacity="0.25"/>
      <circle cx="${moonX}" cy="${moonY}" r="45" fill="#fde047" stroke="#000000" stroke-width="3"/>
    `;
  } else if (style === "film_noir") {
    styleSkyExtras = `
      <polygon points="860,110 180,576 460,576 880,110" fill="#ffffff" opacity="0.16"/>
      <circle cx="870" cy="110" r="14" fill="#fef08a" opacity="0.9"/>
      <ellipse cx="320" cy="530" rx="160" ry="18" fill="#ffffff" opacity="0.18"/>
      <rect width="1024" height="576" fill="url(#venetian_${uid})"/>
    `;
  } else {
    // gritty_graphic_novel
    styleSkyExtras = `
      <circle cx="${moonX}" cy="${moonY}" r="48" fill="#f8fafc" opacity="0.14"/>
      <circle cx="${moonX}" cy="${moonY}" r="28" fill="#f8fafc" opacity="0.24"/>
      <rect y="380" width="1024" height="196" fill="url(#crosshatch_${uid})"/>
    `;
  }

  return `
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${skyTop}"/>
        <stop offset="55%" stop-color="${skyMid}"/>
        <stop offset="100%" stop-color="${skyBot}"/>
      </linearGradient>
      <radialGradient id="ambientGlow" cx="50%" cy="34%" r="58%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.32"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <pattern id="halftone" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#ffffff" opacity="0.035"/>
      </pattern>
    </defs>
    <rect width="1024" height="576" fill="url(#skyGrad)"/>
    ${styleSkyExtras}
    <rect width="1024" height="576" fill="url(#ambientGlow)"/>
    ${sceneGeometry}
    <rect width="1024" height="576" fill="url(#halftone)"/>
  `;
}

function renderBaseOutfitSvg(rig: CharacterRigVisuals, uid: string): string {
  if (rig.outfitStyle === "royal_cloak") {
    // Flowing celestial mantle/cloak, tunic underneath, golden embroidery, jeweled brooch
    return `
      <path d="M -54 54 C -72 65, -82 95, -88 255 L 88 255 C 82 95, 72 65, 54 54 Z"
            fill="${rig.outfitDark}" stroke="#09090b" stroke-width="3.5"/>
      <polygon points="-24,54 24,54 16,255 -16,255" fill="#0f172a" stroke="${rig.outfitSecondary}" stroke-width="2.5"/>
      <line x1="0" y1="58" x2="0" y2="255" stroke="${rig.outfitSecondary}" stroke-width="2" stroke-dasharray="8 4"/>
      <path d="M -56 50 C -82 78, -96 140, -90 230 L -54 230 L -46 95 L 46 95 L 54 230 L 90 230 C 96 140, 82 78, 56 50 Z"
            fill="url(#coatGrad_${uid})" stroke="#09090b" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M -48 46 Q 0 72 48 46" fill="none" stroke="${rig.outfitSecondary}" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="0" cy="58" r="7" fill="${rig.outfitSecondary}" stroke="#09090b" stroke-width="2"/>
      <circle cx="0" cy="58" r="3" fill="#ffffff"/>
    `;
  }

  if (rig.outfitStyle === "wasteland_plate") {
    // Demonic / Dark Warrior / Heavy Plate Armor with Spiked Pauldrons and Rune Core
    return `
      <path d="M -52 54 C -72 65, -80 95, -86 255 L 86 255 C 80 95, 72 65, 52 54 Z"
            fill="#09090b" stroke="#09090b" stroke-width="4"/>
      <polygon points="-46,58 46,58 38,155 0,185 -38,155" fill="url(#coatGrad_${uid})" stroke="#09090b" stroke-width="3.5"/>
      <polygon points="-48,46 -88,32 -96,78 -56,86" fill="${rig.outfitDark}" stroke="#09090b" stroke-width="3"/>
      <polygon points="-88,32 -106,18 -92,54" fill="${rig.outfitPrimary}" stroke="#09090b" stroke-width="2.5"/>
      <polygon points="48,46 88,32 96,78 56,86" fill="${rig.outfitDark}" stroke="#09090b" stroke-width="3"/>
      <polygon points="88,32 106,18 92,54" fill="${rig.outfitPrimary}" stroke="#09090b" stroke-width="2.5"/>
      <polygon points="0,85 -18,110 0,135 18,110" fill="${rig.outfitSecondary}" stroke="#09090b" stroke-width="2.2" opacity="0.9"/>
      <polygon points="-36,165 36,165 42,225 -42,225" fill="${rig.outfitDark}" stroke="#09090b" stroke-width="3"/>
      <line x1="-12" y1="165" x2="-14" y2="225" stroke="${rig.outfitSecondary}" stroke-width="2"/>
      <line x1="12" y1="165" x2="14" y2="225" stroke="${rig.outfitSecondary}" stroke-width="2"/>
    `;
  }

  if (rig.outfitStyle === "samurai_garb") {
    // Overlapping Crossed Kimono Robes with Obi Sash
    return `
      <path d="M -54 54 C -76 65, -88 95, -92 255 L 92 255 C 88 95, 76 65, 54 54 Z"
            fill="url(#coatGrad_${uid})" stroke="#09090b" stroke-width="4"/>
      <polygon points="-48,46 12,145 0,175 -58,95" fill="${rig.outfitDark}" stroke="#09090b" stroke-width="2.5"/>
      <polygon points="48,46 -24,145 0,175 58,95" fill="url(#coatGrad_${uid})" stroke="#09090b" stroke-width="3"/>
      <line x1="44" y1="48" x2="-16" y2="135" stroke="${rig.outfitSecondary}" stroke-width="3"/>
      <line x1="-44" y1="48" x2="16" y2="135" stroke="${rig.outfitSecondary}" stroke-width="2" opacity="0.7"/>
      <rect x="-42" y="160" width="84" height="42" rx="4" fill="#09090b" stroke="${rig.outfitSecondary}" stroke-width="2.5"/>
      <line x1="-42" y1="181" x2="42" y2="181" stroke="${rig.outfitSecondary}" stroke-width="2"/>
    `;
  }

  if (rig.outfitStyle === "military_armor") {
    // Tactical Combat Uniform with Utility Webbing and Pouches
    return `
      <path d="M -52 54 C -76 60, -88 82, -94 185 L -64 185 L -54 98 L -68 255 L 68 255 L 54 98 L 64 185 L 94 185 C 88 82, 76 60, 52 54 Z"
            fill="url(#coatGrad_${uid})" stroke="#09090b" stroke-width="4"/>
      <polygon points="-24,54 24,54 18,255 -18,255" fill="${rig.outfitDark}" stroke="#09090b" stroke-width="2.5"/>
      <line x1="0" y1="58" x2="0" y2="255" stroke="${rig.outfitSecondary}" stroke-width="2"/>
      <rect x="-42" y="95" width="28" height="38" rx="3" fill="#1e293b" stroke="#09090b" stroke-width="2"/>
      <line x1="-42" y1="108" x2="-14" y2="108" stroke="${rig.outfitSecondary}" stroke-width="1.8"/>
      <rect x="14" y="95" width="28" height="38" rx="3" fill="#1e293b" stroke="#09090b" stroke-width="2"/>
      <line x1="14" y1="108" x2="42" y2="108" stroke="${rig.outfitSecondary}" stroke-width="1.8"/>
      <polygon points="-48,46 -64,56 -48,64" fill="${rig.outfitSecondary}" stroke="#09090b" stroke-width="2"/>
      <polygon points="48,46 64,56 48,64" fill="${rig.outfitSecondary}" stroke="#09090b" stroke-width="2"/>
    `;
  }

  if (rig.outfitStyle === "lab_coat") {
    // Open Research Lab Coat with Shirt and Dark Tie
    return `
      <polygon points="-32,54 32,54 22,255 -22,255" fill="#1e293b" stroke="#09090b" stroke-width="2.5"/>
      <polygon points="-6,56 6,56 4,145 0,160 -4,145" fill="#09090b" stroke="${rig.outfitSecondary}" stroke-width="1.8"/>
      <path d="M -54 54 C -78 60, -90 85, -94 255 L -36 255 L -18 135 L -38 52 Z"
            fill="url(#coatGrad_${uid})" stroke="#09090b" stroke-width="3.5"/>
      <path d="M 54 54 C 78 60, 90 85, 94 255 L 36 255 L 18 135 L 38 52 Z"
            fill="url(#coatGrad_${uid})" stroke="#09090b" stroke-width="3.5"/>
      <polygon points="-44,35 -54,82 -18,125 -28,52" fill="#f8fafc" stroke="#09090b" stroke-width="2.2"/>
      <polygon points="44,35 54,82 18,125 28,52" fill="#f8fafc" stroke="#09090b" stroke-width="2.2"/>
    `;
  }

  if (rig.outfitStyle === "stealth_suit") {
    // Form-fitting Nano-Weave Bodysuit with Glowing Energy Lines
    return `
      <path d="M -48 54 C -68 62, -78 85, -82 255 L 82 255 C 78 85, 68 62, 48 54 Z"
            fill="url(#coatGrad_${uid})" stroke="#09090b" stroke-width="3.5"/>
      <polygon points="-36,65 0,82 -32,165 -42,125" fill="${rig.outfitDark}" stroke="#09090b" stroke-width="2"/>
      <polygon points="36,65 0,82 32,165 42,125" fill="${rig.outfitDark}" stroke="#09090b" stroke-width="2"/>
      <path d="M -36 68 Q 0 88 36 68" fill="none" stroke="${rig.outfitSecondary}" stroke-width="2.5"/>
      <path d="M 0 88 L 0 195" fill="none" stroke="${rig.outfitSecondary}" stroke-width="2.5"/>
      <circle cx="0" cy="88" r="4" fill="${rig.outfitSecondary}"/>
    `;
  }

  // Default: Trench Coat / High-Collar Cyber Jacket with Lapels
  return `
    <path d="M -52 54
             C -76 60, -88 82, -94 185
             L -64 185 L -54 98 L -68 255 L 68 255 L 54 98 L 64 185 L 94 185
             C 88 82, 76 60, 52 54 Z"
          fill="url(#coatGrad_${uid})" stroke="#09090b" stroke-width="4" stroke-linejoin="round"/>

    <polygon points="-28,54 28,54 18,195 -18,195" fill="#111520" stroke="#09090b" stroke-width="2.5"/>
    <line x1="0" y1="68" x2="0" y2="195" stroke="${rig.outfitSecondary}" stroke-width="2" opacity="0.75"/>

    <polygon points="-46,30 -58,78 -20,118 -28,52" fill="${rig.outfitDark}" stroke="${rig.outfitSecondary}" stroke-width="2.2" stroke-linejoin="round"/>
    <polygon points="46,30 58,78 20,118 28,52" fill="${rig.outfitDark}" stroke="${rig.outfitSecondary}" stroke-width="2.2" stroke-linejoin="round"/>
  `;
}

function renderOutfitSvg(rig: CharacterRigVisuals, uid: string, style: StyleArchetype = "gritty_graphic_novel"): string {
  const base = renderBaseOutfitSvg(rig, uid);
  let styleOutfitOverlay = "";
  if (style === "cyberpunk_neon") {
    styleOutfitOverlay = `
      <path d="M -52 54 L -24 54 L -18 195 L 0 215 L 18 195 L 24 54 L 52 54" fill="none" stroke="#00f5d4" stroke-width="2.5" opacity="0.9"/>
      <line x1="-54" y1="95" x2="-88" y2="120" stroke="#f72585" stroke-width="2.5" opacity="0.85"/>
      <line x1="54" y1="95" x2="88" y2="120" stroke="#f72585" stroke-width="2.5" opacity="0.85"/>
    `;
  } else if (style === "film_noir") {
    styleOutfitOverlay = `
      <polygon points="-95,140 95,80 95,255 -95,255" fill="#000000" opacity="0.65"/>
    `;
  } else if (style === "retro_comic") {
    styleOutfitOverlay = `
      <polygon points="12,54 52,54 88,185 54,255 18,255" fill="#000000" opacity="0.45"/>
    `;
  } else if (style === "manga_anime") {
    styleOutfitOverlay = `
      <line x1="-24" y1="90" x2="-8" y2="135" stroke="#09090b" stroke-width="2" stroke-linecap="round"/>
      <line x1="24" y1="90" x2="8" y2="135" stroke="#09090b" stroke-width="2" stroke-linecap="round"/>
    `;
  }
  return `${base}\n${styleOutfitOverlay}`;
}

function renderCharacterLayerSvg(
  char: CharacterProfile,
  rig: CharacterRigVisuals,
  pose: CharPose,
  expression: CharExpression,
  slotIndex: number,
  totalInScene: number,
  camera: CameraShot,
  artStyle: string = ""
): string {
  const style = resolveStyleArchetype(artStyle);
  const inkStroke =
    style === "watercolor_storyboard"
      ? "#332720"
      : style === "film_noir" || style === "retro_comic" || style === "gritty_graphic_novel"
      ? "#000000"
      : "#09090b";

  const strokeWidth =
    style === "retro_comic"
      ? 4.0
      : style === "gritty_graphic_novel"
      ? 3.6
      : style === "watercolor_storyboard"
      ? 2.0
      : style === "manga_anime"
      ? 2.4
      : 2.8;

  const xPositions =
    totalInScene === 1
      ? [512]
      : totalInScene === 2
      ? [320, 704]
      : [220, 512, 804];
  const cx = xPositions[slotIndex] || 512;

  const scale =
    camera === "closeup"
      ? slotIndex === 0
        ? 1.58
        : 1.15
      : camera === "wide"
      ? 0.82
      : camera === "low_angle"
      ? 1.25
      : 1.12;

  const baseY =
    camera === "closeup"
      ? 615
      : pose === "crouching"
      ? 600
      : 568;

  const flip = slotIndex === 1 ? -1 : 1;
  const uid = `ch_${slotIndex}_${hashStr(char.id || char.name) % 99999}`;

  const browTilt =
    expression === "angry" || expression === "fierce"
      ? 7
      : expression === "shocked" || expression === "sad" || expression === "worried"
      ? -6
      : expression === "happy" || expression === "wink"
      ? -2
      : 3;

  const mouthSvg =
    expression === "angry" || expression === "fierce"
      ? `<path d="M -11 26 Q 0 20 11 26 L 9 31 Q 0 28 -9 31 Z" fill="#ffffff" stroke="${inkStroke}" stroke-width="2"/>`
      : expression === "happy"
      ? `<path d="M -13 22 Q 0 36 13 22 Z" fill="#ffffff" stroke="${inkStroke}" stroke-width="2.2"/>
         <path d="M -9 27 Q 0 33 9 27" fill="#ef4444"/>`
      : expression === "sad"
      ? `<path d="M -11 29 Q 0 20 11 29" fill="none" stroke="${inkStroke}" stroke-width="2.6" stroke-linecap="round"/>
         <path d="M -18 4 Q -22 14 -18 18 Q -14 14 -18 4 Z" fill="#38bdf8" opacity="0.85"/>`
      : expression === "worried"
      ? `<path d="M -11 27 Q -5 23 0 27 Q 5 31 11 26" fill="none" stroke="${inkStroke}" stroke-width="2.4" stroke-linecap="round"/>
         <path d="M 28 -16 C 24 -4, 34 -4, 28 -16 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="1.2"/>`
      : expression === "shocked"
      ? `<path d="M -8 24 Q 0 21 8 24 Q 7 29 0 30 Q -7 29 -8 24 Z" fill="#3b0707" stroke="${inkStroke}" stroke-width="2"/>
         <line x1="-5" y1="24" x2="5" y2="24" stroke="#ffffff" stroke-width="1.5"/>`
      : expression === "smirking" || expression === "wink"
      ? `<path d="M -9 26 Q 4 29 14 20" fill="none" stroke="${inkStroke}" stroke-width="2.6" stroke-linecap="round"/>`
      : `<path d="M -10 26 Q 0 28 11 24" fill="none" stroke="${inkStroke}" stroke-width="2.6" stroke-linecap="round"/>
         <path d="M -5 31 Q 0 33 5 31" fill="none" stroke="${rig.skinShadow}" stroke-width="1.8" stroke-linecap="round"/>`;

  let backHairSvg = "";
  if (rig.hairStyle === "long" || rig.hairStyle === "braided" || rig.hairStyle === "crown") {
    backHairSvg = `
      <path d="M -46 -18 C -58 25, -64 95, -52 145 C -38 135, -32 95, -28 45 L 28 45 C 32 95, 38 135, 52 145 C 64 95, 58 25, 46 -18 Z" fill="url(#hairGrad_${uid})" stroke="${inkStroke}" stroke-width="${strokeWidth}"/>
    `;
  } else if (rig.hairStyle === "twin_tails") {
    backHairSvg = `
      <path d="M -42 -22 C -78 -10, -88 65, -72 135 C -52 120, -48 65, -38 5 Z" fill="url(#hairGrad_${uid})" stroke="${inkStroke}" stroke-width="${strokeWidth}"/>
      <path d="M 42 -22 C 78 -10, 88 65, 72 135 C 52 120, 48 65, 38 5 Z" fill="url(#hairGrad_${uid})" stroke="${inkStroke}" stroke-width="${strokeWidth}"/>
    `;
  } else if (rig.hairStyle === "ponytail") {
    backHairSvg = `
      <path d="M 18 -42 C 58 -55, 78 5, 68 85 C 48 75, 42 25, 22 -15 Z" fill="url(#hairGrad_${uid})" stroke="${inkStroke}" stroke-width="${strokeWidth}"/>
    `;
  } else if (rig.hairStyle === "spiky" || rig.hairStyle === "messy") {
    backHairSvg = `
      <path d="M -42 -12 L -62 -22 L -46 2 L -56 18 L -34 16 L 34 16 L 56 18 L 46 2 L 62 -22 L 42 -12 Z" fill="${rig.hairColor}" stroke="${inkStroke}" stroke-width="${strokeWidth}"/>
    `;
  } else if (rig.hairStyle === "hooded") {
    backHairSvg = `
      <path d="M -64 52 C -72 -72, 72 -72, 64 52 Z" fill="${rig.outfitDark}" stroke="${inkStroke}" stroke-width="${strokeWidth + 0.5}"/>
    `;
  }

  let frontHairSvg = "";
  if (rig.hairStyle === "helmet" || rig.hairStyle === "visor_helm") {
    frontHairSvg = `
      <path d="M -46 -14 C -50 -64, 50 -64, 46 -14 L 53 -6 C 20 -14, -20 -14, -53 -6 Z" fill="#3a4736" stroke="${inkStroke}" stroke-width="${strokeWidth}"/>
      <rect x="-6" y="-46" width="12" height="24" rx="2" fill="#e2e8f0" stroke="${inkStroke}" stroke-width="1.5"/>
      ${rig.hairStyle === "visor_helm" ? `<rect x="-34" y="-12" width="68" height="16" rx="4" fill="${rig.accentGlow}" opacity="0.8" stroke="${inkStroke}" stroke-width="2.5"/>` : ""}
    `;
  } else if (rig.hairStyle === "crown") {
    frontHairSvg = `
      <path d="M -40 -10 C -44 -56, 44 -56, 40 -10 C 26 -14, 12 -24, 0 -18 C -12 -24, -26 -14, -40 -10 Z" fill="url(#hairGrad_${uid})" stroke="${inkStroke}" stroke-width="${strokeWidth}"/>
      <polygon points="-32,-34 -24,-58 -10,-42 0,-64 10,-42 24,-58 32,-34" fill="#facc15" stroke="${inkStroke}" stroke-width="2.5"/>
    `;
  } else if (rig.hairStyle === "cowboy_hat") {
    frontHairSvg = `
      <path d="M -38 -12 C -38 -48, 38 -48, 38 -12 Z" fill="#451a03" stroke="${inkStroke}" stroke-width="${strokeWidth}"/>
      <ellipse cx="0" cy="-16" rx="68" ry="12" fill="#5c2406" stroke="${inkStroke}" stroke-width="${strokeWidth}"/>
    `;
  } else if (rig.hairStyle === "spiky" || rig.hairStyle === "messy") {
    frontHairSvg = `
      <path d="M -42 -10
               C -46 -32, -38 -52, -52 -46
               C -36 -58, -22 -56, -28 -72
               C -12 -60, -4 -58, 4 -78
               C 14 -58, 24 -60, 36 -70
               C 32 -52, 44 -54, 56 -42
               C 42 -36, 46 -20, 42 -8
               C 36 -2, 34 12, 32 18
               C 28 -4, 24 -16, 16 -22
               L 8 -8 L 2 -24 L -8 -6 L -16 -24
               C -24 -16, -28 -4, -32 18
               C -34 12, -36 -2, -42 -10 Z"
            fill="url(#hairGrad_${uid})" stroke="${inkStroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
      <path d="M -24 -42 Q 0 -54 24 -40" fill="none" stroke="${rig.hairHighlight}" stroke-width="${strokeWidth}" stroke-linecap="round" opacity="0.55"/>
    `;
  } else if (rig.hairStyle === "long" || rig.hairStyle === "twin_tails" || rig.hairStyle === "braided" || rig.hairStyle === "bob") {
    const sideLen = rig.hairStyle === "bob" ? 32 : 82;
    frontHairSvg = `
      <path d="M -42 -12
               C -44 -58, 44 -58, 42 -12
               C 44 18, 42 40, 36 ${sideLen}
               C 30 42, 32 14, 28 -10
               C 18 -22, 8 -14, 0 -6
               C -8 -16, -18 -22, -28 -10
               C -32 14, -30 42, -36 ${sideLen}
               C -42 40, -44 18, -42 -12 Z"
            fill="url(#hairGrad_${uid})" stroke="${inkStroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
      <path d="M -26 -38 Q 0 -48 26 -38" fill="none" stroke="${rig.hairHighlight}" stroke-width="${strokeWidth}" stroke-linecap="round" opacity="0.65"/>
    `;
  } else {
    frontHairSvg = `
      <path d="M -40 -10 C -44 -56, 44 -56, 40 -10 C 34 -4, 32 6, 30 12 C 26 -14, 12 -24, 0 -18 C -12 -24, -26 -14, -30 12 C -32 6, -34 -4, -40 -10 Z"
            fill="url(#hairGrad_${uid})" stroke="${inkStroke}" stroke-width="${strokeWidth}"/>
    `;
  }

  let accessorySvg = "";
  if (rig.accessory === "visor") {
    accessorySvg = `<polygon points="-34,-9 34,-9 28,4 -28,4" fill="${rig.accentGlow}" opacity="0.75" stroke="${inkStroke}" stroke-width="2.2"/>`;
  } else if (rig.accessory === "glasses") {
    accessorySvg = `
      <g stroke="#e2e8f0" stroke-width="2" fill="#38bdf8" fill-opacity="0.2">
        <rect x="-27" y="-9" width="20" height="12" rx="2"/>
        <rect x="7" y="-9" width="20" height="12" rx="2"/>
        <line x1="-7" y1="-3" x2="7" y2="-3"/>
      </g>
    `;
  } else if (rig.accessory === "eyepatch") {
    accessorySvg = `
      <line x1="-36" y1="-12" x2="34" y2="2" stroke="${inkStroke}" stroke-width="2.5"/>
      <ellipse cx="15" cy="-3" rx="10" ry="7" fill="#09090b"/>
    `;
  } else if (rig.accessory === "mask") {
    accessorySvg = `<polygon points="-34,6 0,2 34,6 26,34 0,42 -26,34" fill="#111827" stroke="${rig.outfitSecondary}" stroke-width="2"/>`;
  } else if (rig.accessory === "headband") {
    accessorySvg = `<rect x="-39" y="-24" width="78" height="8" rx="2" fill="${rig.outfitSecondary}" stroke="${inkStroke}" stroke-width="2"/>`;
  }

  let foregroundActionSvg = "";
  if (pose === "pointing" || rig.propType === "holodrive") {
    foregroundActionSvg = `
      <path d="M 42 82 L 98 36 L 80 16 L 26 62 Z" fill="url(#coatGrad_${uid})" stroke="${inkStroke}" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="92" cy="24" r="11" fill="${rig.skinColor}" stroke="${inkStroke}" stroke-width="2.8"/>
      <g transform="translate(94, -4)">
        <circle cx="0" cy="0" r="38" fill="#00f5d4" opacity="0.22"/>
        <ellipse cx="0" cy="12" rx="26" ry="8" fill="none" stroke="#00f5d4" stroke-width="2"/>
        <polygon points="-14,10 -6,-18 6,-18 14,10" fill="#00f5d4" opacity="0.45" stroke="#ffffff" stroke-width="1.5"/>
      </g>
    `;
  } else if (pose === "aiming" || rig.propType === "rifle") {
    foregroundActionSvg = `
      <path d="M -32 88 L 62 68 L 62 90 L -32 110 Z" fill="url(#coatGrad_${uid})" stroke="${inkStroke}" stroke-width="3.5"/>
      <g transform="translate(-25, 62) rotate(-6)">
        <rect x="0" y="0" width="145" height="12" rx="2" fill="#1e293b" stroke="${inkStroke}" stroke-width="3"/>
        <rect x="35" y="-9" width="44" height="8" rx="2" fill="#0f172a" stroke="${inkStroke}" stroke-width="2"/>
        <rect x="52" y="12" width="16" height="22" rx="2" fill="#0f172a" stroke="${inkStroke}" stroke-width="2.5"/>
        <circle cx="28" cy="8" r="10" fill="${rig.skinColor}" stroke="${inkStroke}" stroke-width="2.5"/>
      </g>
    `;
  } else if (pose === "blade_ready" || rig.propType === "katana" || rig.propType === "blade") {
    foregroundActionSvg = `
      <path d="M 35 78 L 88 42 L 74 22 L 22 58 Z" fill="url(#coatGrad_${uid})" stroke="${inkStroke}" stroke-width="3.5"/>
      <g transform="translate(82, 32) rotate(-32)">
        <rect x="-8" y="-6" width="16" height="32" rx="3" fill="#1e293b" stroke="${inkStroke}" stroke-width="2.5"/>
        <rect x="-16" y="-10" width="32" height="6" rx="2" fill="#f59e0b" stroke="${inkStroke}" stroke-width="2"/>
        <polygon points="-5,-10 -2,-155 6,-145 5,-10" fill="#e2e8f0" stroke="${rig.accentGlow}" stroke-width="2"/>
      </g>
      <circle cx="82" cy="32" r="10" fill="${rig.skinColor}" stroke="${inkStroke}" stroke-width="2.5"/>
    `;
  } else if (pose === "crossed_arms") {
    foregroundActionSvg = `
      <path d="M -52 92 L 42 108 L 42 128 L -52 112 Z" fill="url(#coatGrad_${uid})" stroke="${inkStroke}" stroke-width="3.5"/>
      <path d="M 52 92 L -42 108 L -42 128 L 52 112 Z" fill="url(#coatGrad_${uid})" stroke="${inkStroke}" stroke-width="3.5"/>
      <circle cx="-36" cy="104" r="9" fill="${rig.skinColor}" stroke="${inkStroke}" stroke-width="2.5"/>
      <circle cx="36" cy="104" r="9" fill="${rig.skinColor}" stroke="${inkStroke}" stroke-width="2.5"/>
    `;
  } else if (pose === "thumbs_up") {
    foregroundActionSvg = `
      <path d="M 38 92 L 84 52 L 68 36 L 24 76 Z" fill="url(#coatGrad_${uid})" stroke="${inkStroke}" stroke-width="3.5"/>
      <circle cx="78" cy="44" r="11" fill="${rig.skinColor}" stroke="${inkStroke}" stroke-width="2.5"/>
      <rect x="74" y="22" width="8" height="16" rx="4" fill="${rig.skinColor}" stroke="${inkStroke}" stroke-width="2.2"/>
    `;
  } else if (pose === "thinking") {
    foregroundActionSvg = `
      <path d="M 34 105 L 14 38 L -2 42 L 16 108 Z" fill="url(#coatGrad_${uid})" stroke="${inkStroke}" stroke-width="3.5"/>
      <circle cx="6" cy="36" r="9.5" fill="${rig.skinColor}" stroke="${inkStroke}" stroke-width="2.5"/>
    `;
  } else if (pose === "action" || rig.propType === "energy_orb") {
    foregroundActionSvg = `
      <path d="M 38 72 L 114 12 L 96 -8 L 22 52 Z" fill="url(#coatGrad_${uid})" stroke="${inkStroke}" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="108" cy="0" r="13" fill="${rig.skinColor}" stroke="${inkStroke}" stroke-width="3"/>
      <circle cx="108" cy="0" r="34" fill="${rig.accentGlow}" opacity="0.38"/>
      <polyline points="108,0 135,-24 118,-38 152,-62" fill="none" stroke="#e0f2fe" stroke-width="3.5"/>
    `;
  }

  let styleAccentsSvg = "";
  if (style === "manga_anime") {
    styleAccentsSvg = `
      <!-- Anime Angel-Ring Hair Sheen Band -->
      <ellipse cx="0" cy="-38" rx="26" ry="3.5" fill="#ffffff" opacity="0.6"/>
      <!-- Screentone Shadow on Neck -->
      <polygon points="-14,24 14,24 18,52 -18,52" fill="url(#screentone_${uid})" opacity="0.6"/>
    `;
  } else if (style === "cyberpunk_neon") {
    styleAccentsSvg = `
      <!-- Dual Neon Rim Lighting (Cyan on left, Magenta on right) -->
      <path d="M -38 -16 C -40 4, -30 22, -16 34 L -24 58 L -72 245" fill="none" stroke="#00f5d4" stroke-width="2.5" opacity="0.85"/>
      <path d="M 38 -16 C 40 4, 30 22, 16 34 L 24 58 L 72 245" fill="none" stroke="#f72585" stroke-width="2.5" opacity="0.85"/>
    `;
  } else if (style === "gritty_graphic_novel") {
    styleAccentsSvg = `
      <!-- Heavy Solid Black Shadow Polygon & Ink Crosshatching -->
      <polygon points="-16,22 16,22 20,38 0,44 -20,38" fill="#000000"/>
      <g stroke="#000000" stroke-width="1.2" opacity="0.6">
        <line x1="12" y1="6" x2="26" y2="20"/>
        <line x1="18" y1="4" x2="30" y2="16"/>
        <line x1="24" y1="2" x2="34" y2="12"/>
      </g>
    `;
  } else if (style === "retro_comic") {
    styleAccentsSvg = `
      <!-- Pop-Art Ben-Day Dot Shading on Neck and Face -->
      <polygon points="6,-10 26,-10 24,32 6,36" fill="url(#bendedDots_${uid})" opacity="0.7"/>
    `;
  } else if (style === "film_noir") {
    styleAccentsSvg = `
      <!-- Dramatic Venetian Blind Shadow Slits -->
      <rect x="-42" y="-48" width="84" height="290" fill="url(#venetian_${uid})"/>
    `;
  }

  return `
    <g transform="translate(${cx}, ${baseY}) scale(${scale * flip}, ${scale})">
      <defs>
        <linearGradient id="skinGrad_${uid}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${rig.skinColor}"/>
          <stop offset="70%" stop-color="${rig.skinColor}"/>
          <stop offset="100%" stop-color="${rig.skinShadow}"/>
        </linearGradient>
        <linearGradient id="hairGrad_${uid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${rig.hairHighlight}"/>
          <stop offset="25%" stop-color="${rig.hairColor}"/>
          <stop offset="100%" stop-color="#09090b"/>
        </linearGradient>
        <linearGradient id="coatGrad_${uid}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${rig.outfitPrimary}"/>
          <stop offset="65%" stop-color="${rig.outfitDark}"/>
          <stop offset="100%" stop-color="#05070c"/>
        </linearGradient>
        <linearGradient id="eyeGrad_${uid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3"/>
          <stop offset="35%" stop-color="${rig.eyeColor}"/>
          <stop offset="100%" stop-color="#05070c"/>
        </linearGradient>
      </defs>

      <ellipse cx="0" cy="-135" rx="92" ry="155" fill="${rig.accentGlow}" opacity="0.14"/>

      <g transform="translate(0, -255)">
        ${rig.customBackSvg || ""}
        ${backHairSvg}

        ${renderOutfitSvg(rig, uid, style)}

        <path d="M -16 20 Q -16 44 -24 58 L 24 58 Q 16 44 16 20 Z" fill="url(#skinGrad_${uid})" stroke="${inkStroke}" stroke-width="${strokeWidth}"/>
        <path d="M -15 22 Q 0 42 15 22 L 15 34 Q 0 48 -15 34 Z" fill="#09090b" opacity="0.38"/>

        <path d="M -37 -8 C -45 -8, -45 12, -35 14" fill="${rig.skinColor}" stroke="${inkStroke}" stroke-width="${Math.max(2, strokeWidth - 0.5)}"/>
        <path d="M 37 -8 C 45 -8, 45 12, 35 14" fill="${rig.skinColor}" stroke="${inkStroke}" stroke-width="${Math.max(2, strokeWidth - 0.5)}"/>

        ${
          style === "manga_anime"
            ? `<!-- Sharp Tapered Manga / Anime Jaw -->
               <path d="M -35 -16 C -37 -50, 37 -50, 35 -16 C 35 6, 22 24, 0 39 C -22 24, -35 6, -35 -16 Z" fill="url(#skinGrad_${uid})" stroke="${inkStroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
               <ellipse cx="0" cy="-38" rx="26" ry="5" fill="#ffffff" opacity="0.6"/>`
            : style === "watercolor_storyboard"
            ? `<!-- Soft Storybook Watercolor Jaw & Rosy Cheek Wash -->
               <path d="M -37 -16 C -39 -50, 39 -50, 37 -16 C 37 4, 28 22, 14 34 C 4 41, -4 41, -14 34 C -28 22, -37 4, -37 -16 Z" fill="url(#skinGrad_${uid})" stroke="${inkStroke}" stroke-width="2" stroke-linejoin="round"/>
               <ellipse cx="-18" cy="11" rx="10" ry="4.5" fill="#f43f5e" opacity="0.25"/>
               <ellipse cx="18" cy="11" rx="10" ry="4.5" fill="#f43f5e" opacity="0.25"/>`
            : style === "cyberpunk_neon"
            ? `<!-- Cybernetic Jaw & Glowing Neural Circuit Seams -->
               <path d="M -37 -16 C -39 -50, 39 -50, 37 -16 C 37 4, 28 20, 16 34 C 6 42, -6 42, -16 34 C -28 20, -37 4, -37 -16 Z" fill="url(#skinGrad_${uid})" stroke="${inkStroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
               <path d="M 27 -2 L 34 3 L 34 16" fill="none" stroke="#00f5d4" stroke-width="1.8" stroke-linecap="round" opacity="0.9"/>
               <path d="M -27 -2 L -34 3 L -34 16" fill="none" stroke="#f72585" stroke-width="1.8" stroke-linecap="round" opacity="0.9"/>`
            : style === "retro_comic"
            ? `<!-- Bold 1960s Pop-Art Comic Jaw & Solid Black Cheek Wedge -->
               <path d="M -38 -16 C -40 -52, 40 -52, 38 -16 C 38 4, 30 22, 16 34 C 6 42, -6 42, -16 34 C -30 22, -38 4, -38 -16 Z" fill="url(#skinGrad_${uid})" stroke="#000000" stroke-width="4" stroke-linejoin="round"/>
               <path d="M 16 4 C 28 12, 28 26, 12 36 L 16 34 C 28 22, 36 6, 36 -12 Z" fill="#000000" opacity="0.45"/>`
            : style === "film_noir"
            ? `<!-- Film Noir Stark Chiaroscuro Half-Face Shadow Mask -->
               <path d="M -38 -16 C -40 -52, 40 -52, 38 -16 C 38 4, 30 22, 16 34 C 6 42, -6 42, -16 34 C -30 22, -38 4, -38 -16 Z" fill="url(#skinGrad_${uid})" stroke="#000000" stroke-width="3" stroke-linejoin="round"/>
               <polygon points="0,-48 38,-28 35,22 14,35 0,40" fill="#000000" opacity="0.6"/>`
            : `<!-- Gritty Graphic Novel Jaw & Shadow -->
               <path d="M -38 -16 C -40 -52, 40 -52, 38 -16 C 38 4, 30 22, 16 34 C 6 42, -6 42, -16 34 C -30 22, -38 4, -38 -16 Z" fill="url(#skinGrad_${uid})" stroke="#000000" stroke-width="3.5" stroke-linejoin="round"/>
               <path d="M 18 -6 C 32 4, 26 22, 8 36 C 24 26, 35 10, 35 -6 Z" fill="${rig.skinShadow}" opacity="0.55"/>`
        }

        ${styleAccentsSvg}

        ${
          rig.hasScar
            ? `<path d="M 11 -12 L 22 18" stroke="#991b1b" stroke-width="2.5" stroke-linecap="round"/>
               <line x1="13" y1="-4" x2="19" y2="-6" stroke="#991b1b" stroke-width="1.5"/>
               <line x1="15" y1="6" x2="21" y2="4" stroke="#991b1b" stroke-width="1.5"/>`
            : ""
        }
        ${
          rig.hasStubble
            ? `<path d="M -28 14 C -18 34, 18 34, 28 14 C 22 28, 10 38, 0 38 C -10 38, -22 28, -28 14 Z" fill="#0f172a" opacity="0.28"/>`
            : ""
        }

        ${renderStyleEyesSvg(style, uid, rig, expression, browTilt, inkStroke)}

        ${
          style === "manga_anime"
            ? `<circle cx="0" cy="8" r="1.6" fill="${inkStroke}"/>`
            : style === "watercolor_storyboard"
            ? `<path d="M -1 2 L -3 12 L 2 13" fill="none" stroke="${inkStroke}" stroke-width="1.8" stroke-linecap="round"/>`
            : style === "film_noir"
            ? `<line x1="0" y1="1" x2="-4" y2="14" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>`
            : style === "retro_comic"
            ? `<path d="M -2 0 L -5 13 L 2 14" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
            : `<polygon points="0,-2 -4,13 0,15" fill="${rig.skinShadow}"/>
               <path d="M -1 0 L -4 13 L 2 14" fill="none" stroke="${inkStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
        }

        ${mouthSvg}
        ${accessorySvg}
        ${frontHairSvg}
        ${foregroundActionSvg}
        ${rig.customSvg || ""}
      </g>
    </g>
  `;
}

function renderAtmosphericBackVfxSvg(vfx: VfxType[], accentColor: string): string {
  let out = "";

  if (vfx.includes("sparks")) {
    out += `
      <g fill="none" stroke-linejoin="round" stroke-linecap="round">
        <!-- Cloud discharge in upper sky (away from character faces) -->
        <circle cx="512" cy="75" r="140" fill="#38bdf8" opacity="0.15"/>
        <polyline points="480,0 512,45 465,95 520,135 485,170" stroke="#e0f2fe" stroke-width="4" opacity="0.9"/>
        <polyline points="480,0 535,50 495,100 550,135" stroke="${accentColor}" stroke-width="2.5" opacity="0.85"/>
        <!-- Left sky horizon bolt -->
        <polyline points="140,0 180,65 145,120 210,185 175,245 220,310" stroke="#38bdf8" stroke-width="3" opacity="0.85"/>
        <polyline points="180,65 240,110 215,150" stroke="#facc15" stroke-width="2" opacity="0.8"/>
        <!-- Right sky horizon bolt -->
        <polyline points="880,0 835,70 875,130 820,195 865,260" stroke="#38bdf8" stroke-width="3" opacity="0.85"/>
        <polyline points="835,70 780,115 805,155" stroke="${accentColor}" stroke-width="2" opacity="0.8"/>
      </g>
    `;
  }

  if (vfx.includes("lasers")) {
    out += `
      <g>
        <g fill="#090d16" stroke="#ef4444" stroke-width="2">
          <polygon points="150,98 230,98 215,114 165,114"/>
          <circle cx="190" cy="106" r="6" fill="#ef4444"/>
          <polygon points="790,88 870,88 855,104 805,104"/>
          <circle cx="830" cy="96" r="6" fill="#ef4444"/>
        </g>
        <g stroke="#ef4444" stroke-width="2" opacity="0.85">
          <line x1="190" y1="106" x2="380" y2="395"/>
          <line x1="830" y1="96" x2="640" y2="375"/>
        </g>
      </g>
    `;
  }

  if (vfx.includes("explosion")) {
    out += `
      <g>
        <circle cx="760" cy="225" r="140" fill="#ea580c" opacity="0.32"/>
        <polygon points="760,110 788,190 868,165 810,235 882,285 792,275 760,355 728,275 650,285 712,235 665,165 732,190" fill="#f97316" opacity="0.8"/>
        <circle cx="760" cy="225" r="42" fill="#fef08a" opacity="0.92"/>
      </g>
    `;
  }

  if (vfx.includes("magic_aura")) {
    out += `
      <g fill="none" stroke="${accentColor}" stroke-width="2.5" opacity="0.35">
        <circle cx="320" cy="300" r="130" stroke-dasharray="8 6"/>
        <circle cx="704" cy="300" r="130" stroke-dasharray="8 6"/>
      </g>
    `;
  }

  return out;
}

function renderForegroundWeatherSvg(weather: WeatherType, vfx: VfxType[]): string {
  let out = "";

  if (weather === "rain" || weather === "heavy_rain") {
    const count = weather === "heavy_rain" ? 110 : 58;
    const len = weather === "heavy_rain" ? 38 : 22;
    const angle = weather === "heavy_rain" ? 14 : 9;
    const streaks: string[] = [];
    for (let i = 0; i < count; i++) {
      const x1 = (i * 37 + (i % 7) * 19) % 1024;
      const y1 = (i * 29 + (i % 5) * 43) % 560;
      const x2 = x1 - angle;
      const y2 = y1 + len;
      streaks.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
    }
    out += `
      <g stroke="#93c5fd" stroke-width="1.3" opacity="${weather === "heavy_rain" ? "0.45" : "0.28"}">
        ${streaks.join("")}
      </g>
    `;
  }

  if (weather === "fog" || weather === "smoke") {
    const color = weather === "smoke" ? "#52525b" : "#cbd5e1";
    out += `
      <g fill="${color}" opacity="0.18">
        <ellipse cx="260" cy="510" rx="350" ry="60"/>
        <ellipse cx="780" cy="520" rx="370" ry="70"/>
        <ellipse cx="512" cy="460" rx="460" ry="45" opacity="0.12"/>
      </g>
    `;
  }

  if (weather === "snow" || weather === "ash" || weather === "embers") {
    const flakes: string[] = [];
    for (let i = 0; i < 42; i++) {
      const x = (i * 89) % 1024;
      const y = (i * 53) % 560;
      const r = 2 + (i % 3);
      flakes.push(`<circle cx="${x}" cy="${y}" r="${r}"/>`);
    }
    const col = weather === "embers" ? "#f97316" : weather === "ash" ? "#fb923c" : "#f8fafc";
    out += `<g fill="${col}" opacity="0.7">${flakes.join("")}</g>`;
  }

  if (vfx.includes("speed_lines")) {
    out += `
      <g stroke="#ffffff" stroke-width="1.6" opacity="0.2">
        <line x1="0" y1="35" x2="270" y2="215"/>
        <line x1="0" y1="155" x2="225" y2="255"/>
        <line x1="0" y1="485" x2="255" y2="345"/>
        <line x1="1024" y1="55" x2="755" y2="215"/>
        <line x1="1024" y1="185" x2="785" y2="265"/>
        <line x1="1024" y1="495" x2="755" y2="345"/>
      </g>
    `;
  }

  return out;
}

export function composeLayeredSceneDataUri(
  beatDescription: string,
  styleBible: StyleBible,
  characters: CharacterProfile[],
  editDirective?: string,
  sequenceIndex: number = 0,
  variationSeed: number = 0
): { imageUrl: string; promptUsed: string; summary: string } {
  const parsed = parseSceneLayersFromText(
    beatDescription,
    styleBible,
    characters,
    editDirective,
    sequenceIndex,
    variationSeed
  );

  const style = resolveStyleArchetype(styleBible.artStyle);
  const styleDefs = generateStyleDefsSvg(style, `scene_${sequenceIndex}_${variationSeed}`);
  const styleOverlay = renderStyleForegroundOverlay(style);

  const bgSvg = renderBackgroundLayerSvg(
    parsed.background,
    styleBible.colorPalette,
    parsed.lighting,
    variationSeed,
    editDirective,
    beatDescription,
    styleBible.artStyle
  );

  const bgVfxSvg = renderAtmosphericBackVfxSvg(
    parsed.vfx,
    parsed.background.accentColor
  );

  const charsSvg = parsed.charPlacements
    .map((p) =>
      renderCharacterLayerSvg(
        p.character,
        p.rig,
        p.pose,
        p.expression,
        p.slotIndex,
        p.totalInScene,
        parsed.camera,
        styleBible.artStyle
      )
    )
    .join("\n");

  const fgWeatherSvg = renderForegroundWeatherSvg(
    parsed.weather,
    parsed.vfx
  );

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 576" width="1024" height="576">
    <defs>
      ${styleDefs}
    </defs>
    ${bgSvg}
    ${bgVfxSvg}
    ${charsSvg}
    ${fgWeatherSvg}
    ${styleOverlay}
    <rect width="1024" height="576" fill="none" stroke="#09090b" stroke-width="14"/>
  </svg>`;

  const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  const charList = parsed.charPlacements.map((p) => `${p.character.name} (${p.pose}, ${p.expression})`).join(", ");
  const summary = `Style: ${styleBible.artStyle} | Background: ${parsed.background.name} | Cast: ${charList || "None"} | Camera: ${parsed.camera} | Weather: ${parsed.weather}${parsed.vfx.length ? ` | VFX: ${parsed.vfx.join(", ")}` : ""}`;

  return {
    imageUrl: dataUri,
    promptUsed: summary,
    summary
  };
}

export function renderCharacterPortraitDataUri(
  char: CharacterProfile,
  artStyle: string
): string {
  const rig = deriveCharacterRig(char, artStyle);
  const charSvg = renderCharacterLayerSvg(
    char,
    rig,
    "standing",
    "determined",
    0,
    1,
    "closeup",
    artStyle
  );

  const style = resolveStyleArchetype(artStyle);
  const styleDefs = generateStyleDefsSvg(style, "port");

  let backdropSvg = `<rect x="256" y="60" width="512" height="512" fill="#070a12"/>`;
  if (style === "manga_anime") {
    backdropSvg = `
      <rect x="256" y="60" width="512" height="512" fill="#180b2b"/>
      <circle cx="512" cy="280" r="220" fill="#2e1065" opacity="0.8"/>
      <circle cx="512" cy="280" r="160" fill="#38bdf8" opacity="0.22"/>
      <g stroke="#ffffff" stroke-width="1.2" opacity="0.25">
        <line x1="512" y1="280" x2="256" y2="60"/>
        <line x1="512" y1="280" x2="768" y2="60"/>
        <line x1="512" y1="280" x2="256" y2="500"/>
        <line x1="512" y1="280" x2="768" y2="500"/>
      </g>
    `;
  } else if (style === "watercolor_storyboard") {
    backdropSvg = `
      <rect x="256" y="60" width="512" height="512" fill="#faf5eb"/>
      <circle cx="512" cy="270" r="210" fill="#fde047" opacity="0.35"/>
      <circle cx="512" cy="270" r="150" fill="#fb923c" opacity="0.25"/>
      <ellipse cx="512" cy="320" rx="230" ry="140" fill="#f472b6" opacity="0.18"/>
    `;
  } else if (style === "cyberpunk_neon") {
    backdropSvg = `
      <rect x="256" y="60" width="512" height="512" fill="#050711"/>
      <circle cx="512" cy="270" r="190" fill="#0f084b" opacity="0.8"/>
      <circle cx="512" cy="270" r="140" fill="none" stroke="#00f5d4" stroke-width="2" stroke-dasharray="6 4" opacity="0.5"/>
      <circle cx="512" cy="270" r="180" fill="none" stroke="#f72585" stroke-width="2" stroke-dasharray="12 6" opacity="0.4"/>
      <rect x="256" y="60" width="512" height="512" fill="url(#cyberGrid_port)"/>
    `;
  } else if (style === "retro_comic") {
    backdropSvg = `
      <rect x="256" y="60" width="512" height="512" fill="#faf5eb"/>
      <rect x="256" y="60" width="512" height="512" fill="url(#bendedDots_port)"/>
      <circle cx="512" cy="270" r="180" fill="#fde047" stroke="#000000" stroke-width="4"/>
    `;
  } else if (style === "film_noir") {
    backdropSvg = `
      <rect x="256" y="60" width="512" height="512" fill="#000000"/>
      <polygon points="680,60 340,572 560,572 768,60" fill="#ffffff" opacity="0.16"/>
      <rect x="256" y="60" width="512" height="512" fill="url(#venetian_port)"/>
    `;
  } else {
    backdropSvg = `
      <rect x="256" y="60" width="512" height="512" fill="#090d16"/>
      <rect x="256" y="60" width="512" height="512" fill="url(#crosshatch_port)"/>
      <circle cx="512" cy="280" r="190" fill="${rig.accentGlow}" opacity="0.22"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="256 60 512 512" width="512" height="512">
    <defs>
      ${styleDefs}
      <radialGradient id="portGlow" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stop-color="${rig.accentGlow}" stop-opacity="0.38"/>
        <stop offset="100%" stop-color="#070a12" stop-opacity="1"/>
      </radialGradient>
    </defs>
    ${backdropSvg}
    ${charSvg}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
