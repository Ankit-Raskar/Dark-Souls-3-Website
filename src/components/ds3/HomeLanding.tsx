"use client";

import { motion } from "framer-motion";
import {
  Flame, BookOpen, Skull, Swords, Shield, Gem, Sparkles, Users, MapPin,
  Newspaper, Image as ImageIcon, Video, Crosshair, Clock, Package, Crown, Eye, ScrollText,
  ChevronRight,
} from "lucide-react";
import { useDS3Store, type DS3Page } from "./useDS3Store";
import { SectionReveal } from "./SectionReveal";
import { OrnamentHeading } from "./OrnamentHeading";
import { ParchmentCard, Tag } from "./primitives";
import { EntityImage } from "./EntityImage";
import { useSound } from "./SoundManager";
import { bosses, areas, characters } from "@/data/ds3";

type Card = {
  page: DS3Page;
  label: string;
  desc: string;
  icon: typeof Flame;
  count?: string;
};

const GROUPS: { label: string; cards: Card[] }[] = [
  {
    label: "The Tale",
    cards: [
      { page: "story", label: "Story", desc: "The fading flame and the Lords of Cinder.", icon: ScrollText },
      { page: "lore", label: "Lore", desc: "Deep articles on fire, dark, and the soul.", icon: BookOpen },
      { page: "timeline", label: "Timeline", desc: "Chronicle of the ages of fire.", icon: Clock },
    ],
  },
  {
    label: "Bestiary",
    cards: [
      { page: "bosses", label: "Bosses", desc: "Twenty-seven encounters with fate.", icon: Skull, count: `${bosses.length}` },
      { page: "enemies", label: "Enemies", desc: "The hollowed host of Lothric.", icon: Eye },
      { page: "areas", label: "Areas", desc: "Every region, bonfire, and secret.", icon: MapPin, count: `${areas.length}` },
      { page: "map", label: "World Map", desc: "Interactive cartography of the kingdom.", icon: Crosshair },
    ],
  },
  {
    label: "Arsenal",
    cards: [
      { page: "weapons", label: "Weapons", desc: "Every blade that tasted god-blood.", icon: Swords },
      { page: "armor", label: "Armor", desc: "Garb of knights and kings.", icon: Shield },
      { page: "rings", label: "Rings", desc: "Bands of binding power.", icon: Gem },
      { page: "magic", label: "Magic", desc: "Sorcery, miracles, and pyromancy.", icon: Sparkles },
    ],
  },
  {
    label: "Inhabitants",
    cards: [
      { page: "characters", label: "Characters", desc: "Souls bound in flesh.", icon: Users, count: `${characters.length}` },
      { page: "npcs", label: "NPCs", desc: "Voices in the hollow, with quest tracker.", icon: Users },
      { page: "covenants", label: "Covenants", desc: "Oaths of the accursed.", icon: Crown },
    ],
  },
  {
    label: "Beyond & Tools",
    cards: [
      { page: "dlc", label: "DLC", desc: "Ashes of Ariandel & The Ringed City.", icon: Package },
      { page: "gallery", label: "Gallery", desc: "Visions of Lothric in ash and ember.", icon: ImageIcon },
      { page: "videos", label: "Videos", desc: "Official trailers and gameplay.", icon: Video },
      { page: "build", label: "Build Calc", desc: "Forge your Ashen One.", icon: Swords },
      { page: "news", label: "Dispatches", desc: "Word from the shrine.", icon: Newspaper },
      { page: "community", label: "Community", desc: "Gather at the bonfire.", icon: Users },
    ],
  },
];

const FEATURED_BOSSES = ["soul-of-cinder", "nameless-king", "abyss-watchers", "pontiff-sulyvahn"];
const FEATURED_AREAS = ["irithyll-of-the-boreal-valley", "anor-londo", "lothric-castle", "firelink-shrine"];

export function HomeLanding() {
  const { setPage } = useDS3Store();
  const { play } = useSound();

  return (
    <div className="relative z-10">
      {/* Featured bosses */}
      <section className="relative border-t border-gold/10 bg-gradient-to-b from-transparent via-black/50 to-transparent py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal>
            <OrnamentHeading eyebrow="Lords Without Thrones" title="Featured Bosses" />
          </SectionReveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_BOSSES.map((id, i) => {
              const boss = bosses.find((b) => b.id === id);
              if (!boss) return null;
              return (
                <SectionReveal key={id} delay={i * 0.08}>
                  <button
                    onClick={() => { setPage("bosses"); play("click"); }}
                    onMouseEnter={() => play("hover")}
                    className="group block w-full text-left"
                  >
                    <ParchmentCard className="h-full p-0">
                      <div className="relative h-56 overflow-hidden border-b border-gold/15">
                        <EntityImage
                          src={boss.image}
                          alt={boss.name}
                          className="absolute inset-0 h-full w-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-soot via-soot/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <Tag variant={boss.category === "DLC" ? "ember" : "blood"} className="mb-1">
                            {boss.category}
                          </Tag>
                          <h3 className="font-display text-lg leading-tight text-gold-bright text-glow-gold">
                            {boss.name}
                          </h3>
                          <p className="font-serif text-xs italic text-ash/60">{boss.title}</p>
                        </div>
                      </div>
                      <p className="line-clamp-2 p-4 font-serif text-sm text-ash/70">{boss.lore}</p>
                      <div className="flex items-center gap-1 px-4 pb-4 font-display text-[0.65rem] tracking-[0.2em] text-ember uppercase">
                        View Bestiary <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </ParchmentCard>
                  </button>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Compendium — grouped cards */}
      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal>
            <OrnamentHeading eyebrow="Enter the Compendium" title="Explore the Kingdom" />
            <p className="mx-auto mt-6 max-w-2xl text-center font-serif text-base leading-relaxed text-muted-foreground">
              Choose a path. Each hall holds its own lore, its own dead.
            </p>
          </SectionReveal>

          {GROUPS.map((group, gi) => (
            <SectionReveal key={group.label} delay={gi * 0.05} className="mt-14">
              <div className="mb-6 flex items-center gap-4">
                <span className="section-eyebrow">{group.label}</span>
                <span className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.cards.map((card, ci) => {
                  const Icon = card.icon;
                  return (
                    <motion.button
                      key={card.page}
                      onClick={() => { setPage(card.page); play("click"); }}
                      onMouseEnter={() => play("hover")}
                      whileHover={{ y: -4 }}
                      className="parchment lift group flex h-full items-start gap-4 rounded-sm border border-gold/15 p-5 text-left hover:border-ember/50"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-gold/20 bg-soot transition-colors group-hover:border-ember">
                        <Icon className="h-5 w-5 text-gold transition-colors group-hover:text-ember" />
                      </span>
                      <span className="flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-display text-base text-gold-bright group-hover:text-ember">
                            {card.label}
                          </span>
                          {card.count && <Tag variant="muted">{card.count}</Tag>}
                        </span>
                        <span className="mt-1 block font-serif text-sm leading-relaxed text-ash/65">
                          {card.desc}
                        </span>
                      </span>
                      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-ember" />
                    </motion.button>
                  );
                })}
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* Featured areas */}
      <section className="relative border-t border-gold/10 bg-gradient-to-b from-transparent via-black/50 to-transparent py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal>
            <OrnamentHeading eyebrow="A Kingdom in Ruin" title="Featured Realms" />
          </SectionReveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_AREAS.map((id, i) => {
              const area = areas.find((a) => a.id === id);
              if (!area) return null;
              return (
                <SectionReveal key={id} delay={i * 0.08}>
                  <button
                    onClick={() => { setPage("areas"); play("click"); }}
                    onMouseEnter={() => play("hover")}
                    className="group block w-full text-left"
                  >
                    <ParchmentCard className="h-full p-0">
                      <div className="relative h-44 overflow-hidden">
                        <EntityImage src={area.image} alt={area.name} className="absolute inset-0 h-full w-full" />
                        <div className="absolute inset-0 bg-gradient-to-t from-soot via-soot/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="font-display text-base text-gold-bright text-glow-gold">{area.name}</h3>
                          <p className="font-serif text-xs italic text-ash/60">{area.subtitle}</p>
                        </div>
                      </div>
                    </ParchmentCard>
                  </button>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing call */}
      <section className="relative py-24 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <Flame className="mx-auto h-8 w-8 text-ember animate-flicker" />
          <p className="mt-6 font-display text-2xl text-gold-bright text-glow-gold sm:text-3xl">
            &ldquo;Don&apos;t you dare go hollow.&rdquo;
          </p>
          <p className="mt-4 font-serif text-sm italic text-muted-foreground">
            Press <kbd className="rounded-sm border border-gold/20 px-1.5 py-0.5 text-ash">⌘K</kbd> to search the
            compendium · toggle music &amp; sound in the bar above
          </p>
        </div>
      </section>
    </div>
  );
}

export default HomeLanding;
