"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrnamentHeading } from "./OrnamentHeading";
import { SectionReveal } from "./SectionReveal";
import { useDS3Store, type DS3Page } from "./useDS3Store";

/**
 * Consistent vertical rhythm + max-width wrapper for every major section.
 */
export function SectionShell({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  headingAlign = "center",
  wide = false,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
  headingAlign?: "center" | "left";
  wide?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 py-20 sm:py-28 md:py-32",
        className
      )}
    >
      <div
        className={cn(
          "relative z-10 mx-auto px-5 sm:px-8",
          wide ? "max-w-7xl" : "max-w-6xl"
        )}
      >
        {(title || eyebrow) && (
          <SectionReveal className="mb-12 sm:mb-16">
            <OrnamentHeading
              eyebrow={eyebrow}
              title={title}
              align={headingAlign}
            />
            {intro ? (
              <p
                className={cn(
                  "mx-auto mt-6 max-w-2xl font-serif text-base leading-relaxed text-muted-foreground sm:text-lg",
                  headingAlign === "center" && "text-center"
                )}
              >
                {intro}
              </p>
            ) : null}
          </SectionReveal>
        )}
        {children}
      </div>
    </section>
  );
}

/**
 * Parchment surface card with hover lift + ember border on hover.
 */
export function ParchmentCard({
  children,
  className,
  interactive = true,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "parchment lift group relative overflow-hidden rounded-sm",
        interactive &&
          "hover:border-gold/40 hover:shadow-[0_0_30px_rgba(255,122,24,0.18)]",
        className
      )}
    >
      {interactive && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 0%, rgba(255,122,24,0.10), transparent 60%)",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Small gold/ember tag chip.
 */
export function Tag({
  children,
  variant = "gold",
  className,
}: {
  children: ReactNode;
  variant?: "gold" | "ember" | "blood" | "muted";
  className?: string;
}) {
  const styles: Record<string, string> = {
    gold: "border-gold/40 text-gold-bright bg-gold/5",
    ember: "border-ember/40 text-ember bg-ember/5",
    blood: "border-blood-bright/40 text-blood-bright bg-blood/10",
    muted: "border-white/10 text-muted-foreground bg-white/5",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 font-serif text-xs tracking-wide",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * Animated stat bar with label + value.
 */
export function StatLine({
  label,
  value,
  max,
  suffix,
}: {
  label: string;
  value: number;
  max: number;
  suffix?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 font-serif text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="stat-bar flex-1">
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </div>
      <span className="w-16 shrink-0 text-right font-display text-sm text-gold-bright">
        {value}
        {suffix}
      </span>
    </div>
  );
}

/**
 * Difficulty skull meter (1-10).
 */
export function DifficultyMeter({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1" title={`Difficulty ${value}/10`}>
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-2 w-2 rotate-45",
            i < value
              ? "bg-ember shadow-[0_0_6px_rgba(255,122,24,0.8)]"
              : "bg-white/10"
          )}
        />
      ))}
    </div>
  );
}

/**
 * Page wrapper for the multi-page architecture. Renders a cinematic page
 * header (breadcrumb back-to-home, eyebrow, title, intro) and the page body.
 * Scrolls the user to top on mount (also handled in store.setPage).
 */
export function PageShell({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  wide = false,
  headerImage,
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
  wide?: boolean;
  headerImage?: string;
}) {
  const { setPage } = useDS3Store();
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-[calc(100svh-4rem)] pt-16"
    >
      {/* Page header — clean dark gradient (no image; wallpaper is home-only) */}
      <header className="vignette relative overflow-hidden border-b border-gold/15">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-soot/80 to-soot" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40"
          style={{
            background:
              "radial-gradient(80% 100% at 50% 0%, rgba(255,122,24,0.08), transparent 70%)",
          }}
        />
        <div
          className={cn(
            "relative z-10 mx-auto px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-20",
            wide ? "max-w-7xl" : "max-w-6xl"
          )}
        >
          {/* Breadcrumb */}
          <button
            onClick={() => setPage("home" as DS3Page)}
            className="group mb-6 inline-flex items-center gap-2 font-display text-xs tracking-[0.2em] text-ash/60 uppercase transition-colors hover:text-ember"
          >
            <ChevronLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
            Return to the Shrine
          </button>
          <OrnamentHeading eyebrow={eyebrow} title={title} align="left" />
          {intro ? (
            <p className="mt-5 max-w-2xl font-serif text-base leading-relaxed text-ash/70 sm:text-lg">
              {intro}
            </p>
          ) : null}
        </div>
      </header>

      {/* Page body */}
      <div
        className={cn(
          "relative z-10 mx-auto px-5 py-16 sm:px-8 sm:py-20",
          wide ? "max-w-7xl" : "max-w-6xl",
          className
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}
