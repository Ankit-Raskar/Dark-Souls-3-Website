// Dark Souls III — Shared TypeScript Types
// Permissive but strongly-typed data contracts for the DS3 companion data layer.

export type Weather = "Ash" | "Snow" | "Fog" | "Fire" | "Dark" | "Rain" | "Clear";

export type BossCategory = "Main" | "Optional" | "DLC" | "Secret";

export type MagicType = "Sorcery" | "Miracle" | "Pyromancy";

export type UpgradeMaterial = "Titanite" | "Twinkling" | "Boss" | "Infusion";

export type RingCategory = "Utility" | "Defense" | "Offense" | "Covenant";

export type GalleryCategory =
  | "Wallpapers"
  | "Bosses"
  | "Characters"
  | "Landscapes"
  | "Artwork"
  | "Screenshots";

export type VideoCategory =
  | "Launch Trailer"
  | "Gameplay"
  | "Bosses"
  | "Lore"
  | "Music"
  | "Developer";

export type Aspect = "portrait" | "landscape" | "square";

export interface Boss {
  id: string;
  name: string;
  title: string;
  location: string;
  souls: number;
  hp: number;
  difficulty: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  phases: 1 | 2;
  weaknesses: string[];
  resistances: string[];
  drops: string[];
  transposition: string[];
  lore: string;
  strategy: string;
  arena: string;
  moveset: string[];
  category: BossCategory;
  image?: string;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  role: string;
  location: string;
  bio: string;
  dialogue: string[];
  relationships: string[];
  questline: string[];
  trivia: string[];
  image?: string;
}

export interface Weapon {
  id: string;
  name: string;
  category: string;
  damage: number;
  scaling: string;
  requirements: string;
  weight: number;
  location: string;
  upgrade: UpgradeMaterial;
  lore: string;
  weaponArt: string;
  image?: string;
}

export interface ArmorSet {
  id: string;
  name: string;
  pieces: string[];
  weight: number;
  poise: number;
  physicalDef: number;
  location: string;
  lore: string;
  image?: string;
}

export interface Ring {
  id: string;
  name: string;
  effect: string;
  location: string;
  lore: string;
  variants: string;
  category: RingCategory;
}

export interface Spell {
  id: string;
  name: string;
  type: MagicType;
  fpCost: number;
  slots: number;
  requirements: string;
  effect: string;
  lore: string;
}

export interface QuestStep {
  step: number;
  action: string;
  result: string;
  reward: string;
}

export interface NPC {
  id: string;
  name: string;
  title: string;
  location: string;
  questline: QuestStep[];
  dialogue: string[];
  choices: string[];
  death: string;
}

export interface CovenantRank {
  rank: number;
  requirement: string;
  reward: string;
}

export interface Covenant {
  id: string;
  name: string;
  description: string;
  leader: string;
  location: string;
  ranks: CovenantRank[];
  lore: string;
}

export interface Enemy {
  id: string;
  name: string;
  location: string;
  hp: number;
  drops: string[];
  weaknesses: string[];
  lore: string;
  threat: 1 | 2 | 3 | 4 | 5;
  image?: string;
}

export interface Area {
  id: string;
  name: string;
  subtitle: string;
  lore: string;
  bosses: string[];
  npcs: string[];
  bonfires: string[];
  items: string[];
  secrets: string[];
  weather: Weather;
  image?: string;
}

export interface DLC {
  id: string;
  name: string;
  release: string;
  areas: string[];
  bosses: string[];
  npcs: string[];
  weapons: string[];
  armor: string[];
  lore: string;
  highlights: string[];
}

export interface LoreArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  body: string[];
}

export interface TimelineEvent {
  id: string;
  era: string;
  title: string;
  description: string;
  year: string;
}

export interface StoryChapter {
  id: string;
  title: string;
  eyebrow: string;
  body: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  caption: string;
  image: string;
  aspect: Aspect;
}

export interface VideoItem {
  id: string;
  title: string;
  category: VideoCategory;
  youtubeId: string;
  description: string;
  duration: string;
}

export interface BuildStats {
  vigor: number;
  attunement: number;
  endurance: number;
  vitality: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  faith: number;
  luck: number;
}

export interface BuildClass {
  id: string;
  name: string;
  level: number;
  stats: BuildStats;
  startingGear: string[];
  description: string;
}
