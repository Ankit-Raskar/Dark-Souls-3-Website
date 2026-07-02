import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface OrnamentHeadingProps {
  /** Small all-caps eyebrow label above the title (uses `.section-eyebrow`). */
  eyebrow?: string;
  /** Heading title (uses `.font-display` + `.shimmer-gold`). */
  title: ReactNode;
  align?: "center" | "left";
  className?: string;
}

/**
 * Presentational section heading: medieval eyebrow + gold shimmer title +
 * ornament divider. Server-renderable (no client interactivity).
 */
export function OrnamentHeading({
  eyebrow,
  title,
  align = "center",
  className,
}: OrnamentHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}

      <h2 className="font-display text-2xl font-semibold text-gold-bright shimmer-gold sm:text-3xl md:text-4xl">
        {title}
      </h2>

      {align === "center" ? (
        <div className="ornament w-full max-w-md">
          <span aria-hidden className="text-sm text-gold">
            ✦
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span aria-hidden className="text-sm text-gold">
            ✦
          </span>
          <span className="h-px w-20 bg-gradient-to-r from-gold/50 to-transparent" />
        </div>
      )}
    </div>
  );
}

export default OrnamentHeading;
