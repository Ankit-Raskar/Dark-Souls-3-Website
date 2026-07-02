"use client";

import { cn } from "@/lib/utils";

interface FogLayerProps {
  intensity?: "subtle" | "normal" | "heavy";
  className?: string;
}

const OPACITY: Record<NonNullable<FogLayerProps["intensity"]>, number> = {
  subtle: 0.4,
  normal: 0.7,
  heavy: 0.95,
};

/**
 * CSS-based drifting fog overlay. Two-to-three absolutely-positioned, heavily
 * blurred radial-gradient layers animated with the `fog-drift` keyframe
 * (defined in globals.css) at different speeds and directions.
 *
 * `pointer-events-none`, low opacity, `mix-blend-mode: screen` so it layers
 * atmospherically over content without blocking interaction.
 */
export function FogLayer({ intensity = "normal", className }: FogLayerProps) {
  const opacity = OPACITY[intensity];
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      style={{ opacity, mixBlendMode: "screen" }}
    >
      <div
        className="absolute inset-[-20%] blur-2xl"
        style={{
          background:
            "radial-gradient(closest-side at 30% 40%, rgba(180,170,150,0.10), transparent 70%), radial-gradient(closest-side at 70% 60%, rgba(120,110,90,0.08), transparent 70%)",
          animation: "fog-drift 28s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-[-20%] blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side at 60% 30%, rgba(200,180,140,0.07), transparent 70%), radial-gradient(closest-side at 20% 70%, rgba(90,80,60,0.09), transparent 70%)",
          animation: "fog-drift 40s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute inset-[-25%] blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side at 50% 80%, rgba(160,140,110,0.06), transparent 70%)",
          animation: "fog-drift 52s ease-in-out infinite",
          animationDelay: "-10s",
        }}
      />
    </div>
  );
}

export default FogLayer;
