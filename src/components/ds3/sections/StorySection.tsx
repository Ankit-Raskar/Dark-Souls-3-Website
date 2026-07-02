"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Crown, Skull, Sunset } from "lucide-react";
import { PageShell, ParchmentCard, Tag } from "../primitives";
import { SectionReveal } from "../SectionReveal";
import { storyChapters } from "@/data/ds3";
import { useSound } from "../SoundManager";

const ENDINGS = [
  {
    icon: Flame,
    name: "Link the First Flame",
    desc: "The Ashen One takes up the mantle of the Lord of Cinder, sacrificing themselves to rekindle the dying flame and prolong the Age of Fire — for a time.",
    tone: "ember",
  },
  {
    icon: Sunset,
    name: "The End of Fire",
    desc: "The Fire Keeper takes the last embers. The age of fire ends, and an age of darkness begins — but one day, a tiny flame will return.",
    tone: "muted",
  },
  {
    icon: Crown,
    name: "Lord of Hollows",
    desc: "Having usurped the flame, the Ashen One becomes the Lord of Hollows, sovereign of the age of men — the true heir to the Dark Soul.",
    tone: "gold",
  },
  {
    icon: Skull,
    name: "Usurpation of Fire",
    desc: "With Anri's sacrifice and the power of the Dark Sigils, the flame is claimed not by lords but by the hollows, ending the cycle of sacrifice.",
    tone: "blood",
  },
];

export function StorySection() {
  const [active, setActive] = useState(0);
  const { play } = useSound();
  const chapter = storyChapters[active];

  return (
    <PageShell
      id="story"
      eyebrow="The Tale of Lothric"
      title="The Story"
      intro="The flame is fading. The bell of awakening tolls for the Lords of Cinder, who have abandoned their thrones. You are the Ashen One — undead, accursed, and unkindled. Rise, and journey to the kiln of the first flame."
      className="bg-gradient-to-b from-transparent via-black/40 to-transparent"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        {/* Chapter list */}
        <div className="flex flex-col gap-2">
          {storyChapters.map((c, i) => (
            <button
              key={c.id}
              onClick={() => {
                setActive(i);
                play("click");
              }}
              onMouseEnter={() => play("hover")}
              className={`group flex items-center gap-4 border-l-2 px-4 py-3 text-left transition-all ${
                active === i
                  ? "border-ember bg-ember/5 text-gold-bright"
                  : "border-gold/15 text-ash/60 hover:border-gold/40 hover:text-ash"
              }`}
            >
              <span className="font-display text-sm text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-serif text-sm tracking-wide">{c.title}</span>
            </button>
          ))}
        </div>

        {/* Chapter body */}
        <ParchmentCard interactive={false} className="min-h-[24rem] p-8 sm:p-10">
          <SectionReveal key={chapter.id}>
            <span className="section-eyebrow">{chapter.eyebrow}</span>
            <h3 className="mt-3 font-display text-2xl text-gold-bright sm:text-3xl">
              {chapter.title}
            </h3>
            <div className="mt-6 flex flex-col gap-4 font-serif text-base leading-relaxed text-ash/80">
              {chapter.body.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className={i === 0 ? "text-lg first-letter:font-display first-letter:text-4xl first-letter:font-bold first-letter:text-ember" : ""}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </SectionReveal>
        </ParchmentCard>
      </div>

      {/* Endings */}
      <SectionReveal className="mt-16">
        <div className="ornament mb-10">
          <span className="font-display text-sm tracking-[0.3em] text-gold/70">
            THE FOUR ENDINGS
          </span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ENDINGS.map((e, i) => {
            const Icon = e.icon;
            return (
              <ParchmentCard key={e.name} className="p-6">
                <Icon className="h-8 w-8 text-ember animate-flicker" />
                <h4 className="mt-4 font-display text-base text-gold-bright">{e.name}</h4>
                <p className="mt-3 font-serif text-sm leading-relaxed text-ash/70">
                  {e.desc}
                </p>
                <Tag variant={e.tone as "ember" | "gold" | "blood" | "muted"} className="mt-4">
                  Ending {i + 1}
                </Tag>
              </ParchmentCard>
            );
          })}
        </div>
      </SectionReveal>
    </PageShell>
  );
}

export default StorySection;
