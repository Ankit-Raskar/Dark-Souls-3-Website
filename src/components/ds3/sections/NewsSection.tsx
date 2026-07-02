"use client";

import { Newspaper, MessageCircle, Users, Github, Twitter, Youtube, Twitch, Flame } from "lucide-react";
import { PageShell, ParchmentCard, Tag } from "../primitives";
import { SectionReveal } from "../SectionReveal";
import { useSound } from "../SoundManager";

const DISPATCHES = [
  {
    date: "Year of the Bells",
    tag: "World",
    title: "The Bells of Awakening Toll Once More",
    body: "The unkindled rise. The Lords of Cinder have abandoned their thrones, and Lothric bleeds. The Ashen One is summoned to seek them out and return them — willing or no.",
  },
  {
    date: "Age of Ash",
    tag: "Patch",
    title: "Regulation 1.15 — The Final Adjustment",
    body: "FromSoftware issues the final balance pass: weapon arts refined, poise revisited, and the Hollow Arena opens for undead-versus-undead trials. The compendium is updated accordingly.",
  },
  {
    date: "Cycle's End",
    tag: "Lore",
    title: "On the Nature of the Dark Soul",
    body: "Scholars of the Grand Archives confirm what the slaves of the Ringed City long suspected — the Dark Soul is not merely pigment, but the inheritance of all who bear humanity.",
  },
];

const COMMUNITY_LINKS = [
  { icon: Users, label: "Reddit — r/darksouls3", href: "#", tone: "ember" },
  { icon: MessageCircle, label: "Discord — The Bonfire", href: "#", tone: "gold" },
  { icon: Github, label: "GitHub — Open Compendium", href: "#", tone: "muted" },
  { icon: Twitter, label: "X — @DarkSouls", href: "#", tone: "muted" },
  { icon: Youtube, label: "YouTube — FromSoftware", href: "#", tone: "blood" },
  { icon: Twitch, label: "Twitch — Souls Streams", href: "#", tone: "ember" },
];

export function NewsSection() {
  const { play } = useSound();
  return (
    <PageShell
      id="news"
      eyebrow="Word from the Shrine"
      title="Dispatches"
      intro="Bulletins from the fading kingdom — world events, patch notes, and scholarly lore findings."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {DISPATCHES.map((d, i) => (
          <SectionReveal key={i} delay={i * 0.08}>
            <ParchmentCard className="h-full p-6">
              <div className="flex items-center justify-between">
                <Tag variant={d.tag === "Lore" ? "gold" : d.tag === "Patch" ? "ember" : "blood"}>
                  {d.tag}
                </Tag>
                <span className="flex items-center gap-1 font-serif text-[0.65rem] text-muted-foreground">
                  <Newspaper className="h-3 w-3" /> {d.date}
                </span>
              </div>
              <h3 className="mt-3 font-display text-base text-gold-bright">{d.title}</h3>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ash/75">{d.body}</p>
              <button
                onMouseEnter={() => play("hover")}
                className="mt-4 font-display text-[0.65rem] tracking-[0.2em] text-ember/80 uppercase hover:text-ember"
              >
                Read More →
              </button>
            </ParchmentCard>
          </SectionReveal>
        ))}
      </div>
    </PageShell>
  );
}

export function CommunitySection() {
  const { play } = useSound();
  return (
    <PageShell
      id="community"
      eyebrow="Gather at the Bonfire"
      title="Community"
      intro="The flame is best kindled together. Join fellow Ashen Ones across the realms — share builds, trade lore, and answer the call of cooperation."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMMUNITY_LINKS.map((c, i) => {
          const Icon = c.icon;
          return (
            <SectionReveal key={i} delay={i * 0.05}>
              <a
                href={c.href}
                onMouseEnter={() => play("hover")}
                onClick={(e) => e.preventDefault()}
                className="parchment lift group flex items-center gap-4 rounded-sm border border-gold/15 p-5 hover:border-ember/50"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-sm border border-gold/20 bg-soot transition-colors group-hover:border-ember">
                  <Icon className="h-5 w-5 text-gold group-hover:text-ember" />
                </span>
                <span className="flex-1">
                  <span className="block font-display text-sm text-gold-bright group-hover:text-ember">
                    {c.label.split(" — ")[0]}
                  </span>
                  <span className="block font-serif text-xs text-ash/60">
                    {c.label.split(" — ")[1]}
                  </span>
                </span>
                <Flame className="h-4 w-4 text-ember opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </SectionReveal>
          );
        })}
      </div>
    </PageShell>
  );
}

export default NewsSection;
