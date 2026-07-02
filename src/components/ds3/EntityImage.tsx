"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders a real remote image with a graceful fallback to the provided
 * procedural fallback (children) if the image fails to load or is absent.
 */
export function EntityImage({
  src,
  alt,
  className,
  fallback,
  imgClassName,
}: {
  src?: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {fallback ?? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-charcoal to-soot">
            <span className="font-display text-4xl font-black text-gold/20">
              {alt.charAt(0)}
            </span>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn(
          "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105",
          imgClassName
        )}
      />
      {/* cinematic dark gradient for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-soot/85 via-soot/10 to-transparent" />
    </div>
  );
}

export default EntityImage;
