"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDS3Store } from "./useDS3Store";
import { Hero } from "./Hero";
import { StorySection } from "./sections/StorySection";
import { LoreSection } from "./sections/LoreSection";
import { CharactersSection } from "./sections/CharactersSection";
import { BossesSection } from "./sections/BossesSection";
import { AreasSection } from "./sections/AreasSection";
import { WeaponsSection } from "./sections/WeaponsSection";
import { ArmorSection } from "./sections/ArmorSection";
import { RingsSection } from "./sections/RingsSection";
import { MagicSection } from "./sections/MagicSection";
import { NPCsSection } from "./sections/NPCsSection";
import { CovenantsSection } from "./sections/CovenantsSection";
import { EnemiesSection } from "./sections/EnemiesSection";
import { DLCSection } from "./sections/DLCSection";
import { GallerySection } from "./sections/GallerySection";
import { VideosSection } from "./sections/VideosSection";
import { MapSection } from "./sections/MapSection";
import { TimelineSection } from "./sections/TimelineSection";
import { BuildCalculator } from "./sections/BuildCalculator";
import { NewsSection, CommunitySection } from "./sections/NewsSection";
import { HomeLanding } from "./HomeLanding";

const PAGES: Record<string, React.ComponentType> = {
  story: StorySection,
  lore: LoreSection,
  characters: CharactersSection,
  bosses: BossesSection,
  areas: AreasSection,
  weapons: WeaponsSection,
  armor: ArmorSection,
  rings: RingsSection,
  magic: MagicSection,
  npcs: NPCsSection,
  covenants: CovenantsSection,
  enemies: EnemiesSection,
  dlc: DLCSection,
  gallery: GallerySection,
  videos: VideosSection,
  map: MapSection,
  timeline: TimelineSection,
  build: BuildCalculator,
  news: NewsSection,
  community: CommunitySection,
};

export function PageRouter() {
  const page = useDS3Store((s) => s.page);

  if (page === "home") {
    return (
      <motion.div
        key="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Hero />
        <HomeLanding />
      </motion.div>
    );
  }

  const PageComponent = PAGES[page] ?? HomeLanding;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <PageComponent />
      </motion.div>
    </AnimatePresence>
  );
}

export default PageRouter;
