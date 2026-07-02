"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, MapPin, MessageSquare, GitBranch, Skull, CheckCircle2, Circle } from "lucide-react";
import { PageShell, ParchmentCard, Tag } from "../primitives";
import { SectionReveal } from "../SectionReveal";
import { DetailDialog } from "../DetailDialog";
import { npcs, type NPC } from "@/data/ds3";
import { useSound } from "../SoundManager";

export function NPCsSection() {
  const [selected, setSelected] = useState<NPC | null>(null);
  const [progress, setProgress] = useState<Record<string, Set<number>>>({});
  const { play } = useSound();

  const toggleStep = (npcId: string, step: number) => {
    setProgress((prev) => {
      const next = { ...prev };
      const set = new Set(next[npcId] ?? []);
      if (set.has(step)) set.delete(step);
      else set.add(step);
      next[npcId] = set;
      return next;
    });
    play("click");
  };

  return (
    <PageShell
      id="npcs"
      eyebrow="Voices in the Hollow"
      title="NPCs"
      intro="The undead you meet along the way will ask for help, offer secrets, or betray you to the abyss. Track their fates — your choices determine who survives to the kiln."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {npcs.map((n, i) => {
          const done = progress[n.id]?.size ?? 0;
          const total = n.questline.length;
          const pct = total ? Math.round((done / total) * 100) : 0;
          return (
            <SectionReveal key={n.id} delay={(i % 4) * 0.04}>
              <ParchmentCard className="h-full p-5">
                <div className="mb-3 flex h-20 items-center justify-center overflow-hidden rounded-sm border border-gold/10 bg-gradient-to-b from-charcoal to-soot">
                  <span className="font-display text-4xl font-black text-gold/25">
                    {n.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-display text-sm text-gold-bright">{n.name}</h3>
                <p className="font-serif text-xs italic text-muted-foreground">{n.title}</p>
                <p className="mt-1 flex items-center gap-1 font-serif text-[0.7rem] text-ash/60">
                  <MapPin className="h-3 w-3 text-ember" /> {n.location}
                </p>

                {/* Progress */}
                <div className="mt-3">
                  <div className="flex items-center justify-between font-serif text-[0.65rem] text-ash/60">
                    <span>Quest progress</span>
                    <span className="text-gold-bright">
                      {done}/{total}
                    </span>
                  </div>
                  <div className="stat-bar mt-1">
                    <motion.span
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelected(n);
                    play("menu");
                  }}
                  onMouseEnter={() => play("hover")}
                  className="mt-3 w-full border border-gold/20 py-1.5 font-display text-[0.65rem] tracking-[0.2em] text-ash/70 uppercase transition-all hover:border-ember/50 hover:text-ember"
                >
                  Open Questline
                </button>
              </ParchmentCard>
            </SectionReveal>
          );
        })}
      </div>

      <DetailDialog open={Boolean(selected)} onClose={() => setSelected(null)} label={selected?.name} className="max-w-3xl">
        {selected && (
          <NPCDetail npc={selected} progress={progress[selected.id] ?? new Set()} onToggle={(s) => toggleStep(selected.id, s)} />
        )}
      </DetailDialog>
    </PageShell>
  );
}

function NPCDetail({
  npc,
  progress,
  onToggle,
}: {
  npc: NPC;
  progress: Set<number>;
  onToggle: (step: number) => void;
}) {
  return (
    <div>
      <span className="section-eyebrow">{npc.title}</span>
      <h3 className="mt-2 font-display text-3xl text-gold-bright text-glow-gold">{npc.name}</h3>
      <p className="mt-1 flex items-center gap-1 font-serif text-sm text-ash/60">
        <MapPin className="h-3 w-3 text-ember" /> {npc.location}
      </p>

      {/* Questline tracker */}
      <div className="mt-6">
        <h4 className="mb-3 flex items-center gap-2 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
          <GitBranch className="h-4 w-4 text-ember" /> Questline Tracker
        </h4>
        <ol className="space-y-2">
          {npc.questline.map((q) => {
            const done = progress.has(q.step);
            return (
              <li key={q.step}>
                <button
                  onClick={() => onToggle(q.step)}
                  className={`flex w-full items-start gap-3 border-l-2 p-3 text-left transition-all ${
                    done
                      ? "border-ember bg-ember/5"
                      : "border-gold/15 hover:border-gold/40 hover:bg-white/[0.02]"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-xs text-gold-bright">
                        Step {q.step}
                      </span>
                      {done && <Tag variant="ember">Completed</Tag>}
                    </div>
                    <p className="mt-1 font-serif text-sm text-ash/80">{q.action}</p>
                    <p className="mt-1 font-serif text-xs italic text-ash/60">→ {q.result}</p>
                    {q.reward && (
                      <p className="mt-1 font-serif text-xs text-gold-bright">
                        Reward: {q.reward}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Dialogue */}
      {npc.dialogue.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 flex items-center gap-2 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
            <MessageSquare className="h-4 w-4 text-ember" /> Dialogue
          </h4>
          <ul className="space-y-2">
            {npc.dialogue.map((d, i) => (
              <li
                key={i}
                className="border-l-2 border-ember/40 pl-3 font-serif text-sm italic text-ash/75"
              >
                &ldquo;{d}&rdquo;
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Choices */}
      {npc.choices.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-2 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
            Choices
          </h4>
          <div className="flex flex-wrap gap-2">
            {npc.choices.map((c, i) => (
              <Tag key={i} variant="blood">
                {c}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {/* Fate */}
      <div className="mt-6 rounded-sm border border-blood/20 bg-blood/5 p-4">
        <h4 className="mb-1 flex items-center gap-2 font-display text-sm tracking-[0.2em] text-blood-bright uppercase">
          <Skull className="h-4 w-4" /> Fate
        </h4>
        <p className="font-serif text-sm italic text-ash/75">{npc.death}</p>
      </div>
    </div>
  );
}

export default NPCsSection;
