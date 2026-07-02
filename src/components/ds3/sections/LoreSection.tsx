"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, Flame, Moon, Sparkles, Skull } from "lucide-react";
import { PageShell, ParchmentCard, Tag } from "../primitives";
import { SectionReveal } from "../SectionReveal";
import { loreArticles } from "@/data/ds3";
import { useSound } from "../SoundManager";

const ICONS: Record<string, typeof Flame> = {
  fire: Flame,
  dark: Moon,
  soul: Sparkles,
  abyss: Skull,
};

export function LoreSection() {
  const [open, setOpen] = useState<string | null>(loreArticles[0]?.id ?? null);
  const { play } = useSound();

  return (
    <PageShell
      id="lore"
      eyebrow="The Fading Mythos"
      title="The Lore"
      intro="The world of Dark Souls is told not in cutscenes but in fragments — item descriptions, forgotten dialogue, and the silence between. Read the chronicles of fire, dark, and the soul."
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {loreArticles.map((article, i) => {
          const isOpen = open === article.id;
          const Icon = ICONS[article.id] ?? BookOpen;
          return (
            <SectionReveal key={article.id} delay={i * 0.05}>
              <ParchmentCard className="flex h-full flex-col p-6">
                <div className="flex items-start justify-between">
                  <Icon className="h-7 w-7 text-ember animate-flicker" />
                  <Tag variant="muted">{article.category}</Tag>
                </div>
                <h3 className="mt-4 font-display text-lg text-gold-bright">
                  {article.title}
                </h3>
                <p className="mt-2 font-serif text-sm italic leading-relaxed text-muted-foreground">
                  {article.summary}
                </p>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 flex flex-col gap-3 border-t border-gold/10 pt-4 font-serif text-sm leading-relaxed text-ash/75">
                        {article.body.map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => {
                    setOpen(isOpen ? null : article.id);
                    play("menu");
                  }}
                  onMouseEnter={() => play("hover")}
                  className="mt-auto flex items-center gap-2 pt-5 font-display text-xs tracking-[0.2em] text-ember/80 uppercase transition-colors hover:text-ember"
                >
                  {isOpen ? "Seal the Tome" : "Open the Tome"}
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </ParchmentCard>
            </SectionReveal>
          );
        })}
      </div>
    </PageShell>
  );
}

export default LoreSection;
