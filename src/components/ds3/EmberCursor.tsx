"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE_SELECTOR =
  'a, button, [data-cursor="hover"], input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])';

/**
 * Custom glowing ember cursor.
 *
 * Two layers: a small bright core (follows the pointer instantly) and a larger
 * soft trailing glow (lags via Framer Motion spring physics). On mousedown the
 * ember flares; hovering interactive elements grows the glow ring and tints it
 * gold. Trailing ember sparks flicker out behind the pointer.
 *
 * Hidden on touch / coarse pointers and when prefers-reduced-motion is set.
 * Adds `ember-cursor-active` to `document.body` (globals.css hides the native
 * cursor on fine pointers when this class is present).
 */
export function EmberCursor() {
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [flaring, setFlaring] = useState(false);

  const sparkLayerRef = useRef<HTMLDivElement>(null);
  const lastSparkRef = useRef(0);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Glow lags behind the core using softer spring physics.
  const glowX = useSpring(x, { stiffness: 140, damping: 22, mass: 0.6 });
  const glowY = useSpring(y, { stiffness: 140, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mqFine = window.matchMedia("(pointer: fine)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mqFine.matches || mqReduced.matches) return;

    // Client-capability detection cannot run during SSR — must happen on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(true);
    document.body.classList.add("ember-cursor-active");

    const spawnSpark = (cx: number, cy: number) => {
      const layer = sparkLayerRef.current;
      if (!layer) return;
      const spark = document.createElement("span");
      spark.className = "ember-dot";
      spark.style.position = "fixed";
      spark.style.left = "0px";
      spark.style.top = "0px";
      spark.style.transform = `translate(${cx}px, ${cy}px)`;
      const driftX = (Math.random() - 0.5) * 50;
      const driftY = -25 - Math.random() * 45;
      const dur = 650 + Math.random() * 350;
      const anim = spark.animate(
        [
          {
            transform: `translate(${cx}px, ${cy}px) scale(1)`,
            opacity: 0.9,
          },
          {
            transform: `translate(${cx + driftX}px, ${cy + driftY}px) scale(0.2)`,
            opacity: 0,
          },
        ],
        { duration: dur, easing: "ease-out" }
      );
      anim.onfinish = () => spark.remove();
      layer.appendChild(spark);
      // Safety cleanup in case onfinish doesn't fire.
      window.setTimeout(() => spark.remove(), dur + 200);
    };

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const now = performance.now();
      if (now - lastSparkRef.current > 55) {
        lastSparkRef.current = now;
        if (Math.random() > 0.5) spawnSpark(e.clientX, e.clientY);
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest && t.closest(INTERACTIVE_SELECTOR)) setHovering(true);
    };
    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest && t.closest(INTERACTIVE_SELECTOR)) setHovering(false);
    };

    const onDown = () => setFlaring(true);
    const onUp = () => setFlaring(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mouseout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      document.body.classList.remove("ember-cursor-active");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [x, y]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]" aria-hidden>
      {/* Soft trailing glow (lags behind) */}
      <motion.div className="absolute top-0 left-0" style={{ x: glowX, y: glowY }}>
        <div
          className="absolute rounded-full"
          style={{
            width: hovering ? 60 : 34,
            height: hovering ? 60 : 34,
            transform: "translate(-50%, -50%)",
            background: hovering
              ? "radial-gradient(circle, rgba(232,200,120,0.32), rgba(197,160,89,0.10) 50%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,122,24,0.30), rgba(194,65,12,0.10) 50%, transparent 70%)",
            filter: "blur(5px)",
            transition:
              "width 0.25s ease, height 0.25s ease, background 0.25s ease",
          }}
        />
      </motion.div>

      {/* Bright core (instant) */}
      <motion.div className="absolute top-0 left-0" style={{ x, y }}>
        <div
          className="absolute rounded-full"
          style={{
            width: flaring ? 14 : 8,
            height: flaring ? 14 : 8,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, #ffe2b0 0%, #ff7a18 50%, #c2410c 100%)",
            boxShadow: flaring
              ? "0 0 18px rgba(255,170,60,0.95), 0 0 36px rgba(255,122,24,0.7)"
              : "0 0 8px rgba(255,122,24,0.85), 0 0 18px rgba(255,122,24,0.4)",
            transition:
              "width 0.12s ease, height 0.12s ease, box-shadow 0.12s ease",
          }}
        />
      </motion.div>

      {/* Trailing ember sparks (direct DOM, no React re-renders) */}
      <div ref={sparkLayerRef} className="absolute inset-0" />
    </div>
  );
}

export default EmberCursor;
