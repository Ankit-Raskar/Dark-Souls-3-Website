"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Quote, Users, ScrollText, Sparkles } from "lucide-react";
import { PageShell, ParchmentCard, Tag } from "../primitives";
import { EntityImage } from "../EntityImage";
import { SectionReveal } from "../SectionReveal";
import { DetailDialog } from "../DetailDialog";
import { characters, type Character } from "@/data/ds3";
import { useSound } from "../SoundManager";

export function CharactersSection() {
  const [selected, setSelected] = useState<Character | null>(null);
  const { play } = useSound();

  return (
    <PageShell
      id="characters"
      eyebrow="Souls Bound in Flesh"
      title="Characters"
      intro="From the ever-kind Fire Keeper to the consumed Scholar of the Grand Archives — the figures of Lothric each carry a burden, a secret, and a fate entwined with the fading flame."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {characters.map((c, i) => (
          <SectionReveal key={c.id} delay={(i % 4) * 0.05}>
            <ParchmentCard className="h-full p-5">
              {/* Portrait — real image with monogram fallback */}
              <div className="group/img relative mb-4 h-44 overflow-hidden rounded-sm border border-gold/15">
                <EntityImage
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full"
                  fallback={
                    <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-b from-charcoal to-soot">
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          background:
                            "radial-gradient(60% 80% at 50% 30%, rgba(255,122,24,0.25), transparent 70%)",
                        }}
                      />
                      <span className="font-display text-6xl font-black text-gold/30 transition-all group-hover:text-gold/50 group-hover:text-glow-gold">
                        {c.name.charAt(0)}
                      </span>
                    </div>
                  }
                />
                <span className="absolute bottom-2 left-2 z-10">
                  <Tag variant="ember">{c.role}</Tag>
                </span>
              </div>

              <h3 className="font-display text-base text-gold-bright">{c.name}</h3>
              {c.title ? (
                <p className="font-serif text-xs italic text-muted-foreground">{c.title}</p>
              ) : null}
              <p className="mt-3 line-clamp-3 font-serif text-sm leading-relaxed text-ash/70">
                {c.bio}
              </p>

              <button
                onClick={() => {
                  setSelected(c);
                  play("menu");
                }}
                onMouseEnter={() => play("hover")}
                className="mt-4 w-full border border-gold/20 py-2 font-display text-xs tracking-[0.2em] text-ash/70 uppercase transition-all hover:border-ember/50 hover:text-ember"
              >
                Read Chronicle
              </button>
            </ParchmentCard>
          </SectionReveal>
        ))}
      </div>

      <DetailDialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        label={selected?.name}
      >
        {selected && (
          <div>
            <span className="section-eyebrow">{selected.role}</span>
            <h3 className="mt-2 font-display text-3xl text-gold-bright text-glow-gold">
              {selected.name}
            </h3>
            {selected.title ? (
              <p className="mt-1 font-serif italic text-muted-foreground">{selected.title}</p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Tag variant="gold">
                <MapPin className="h-3 w-3" /> {selected.location}
              </Tag>
              <Tag variant="muted">
                <Users className="h-3 w-3" /> {selected.relationships.length} ties
              </Tag>
            </div>

            <div className="mt-6 space-y-6">
              <Block icon={ScrollText} title="Biography">
                <p className="font-serif text-sm leading-relaxed text-ash/80">{selected.bio}</p>
              </Block>

              <Block icon={Quote} title="Dialogue">
                <ul className="space-y-2">
                  {selected.dialogue.map((d, i) => (
                    <li
                      key={i}
                      className="border-l-2 border-ember/40 pl-3 font-serif text-sm italic text-ash/75"
                    >
                      &ldquo;{d}&rdquo;
                    </li>
                  ))}
                </ul>
              </Block>

              <Block icon={Sparkles} title="Questline">
                <ol className="space-y-2">
                  {selected.questline.map((q, i) => (
                    <li key={i} className="flex gap-3 font-serif text-sm text-ash/75">
                      <span className="font-display text-ember">{i + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ol>
              </Block>

              {selected.relationships.length > 0 && (
                <Block icon={Users} title="Relationships">
                  <div className="flex flex-wrap gap-2">
                    {selected.relationships.map((r, i) => (
                      <Tag key={i} variant="muted">
                        {r}
                      </Tag>
                    ))}
                  </div>
                </Block>
              )}

              {selected.trivia.length > 0 && (
                <Block icon={Sparkles} title="Trivia">
                  <ul className="space-y-1 font-serif text-sm text-ash/70">
                    {selected.trivia.map((t, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-ember">◆</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </Block>
              )}
            </div>
          </div>
        )}
      </DetailDialog>
    </PageShell>
  );
}

function Block({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof ScrollText;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-ember" />
        <h4 className="font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
          {title}
        </h4>
      </div>
      {children}
    </div>
  );
}

export default CharactersSection;
