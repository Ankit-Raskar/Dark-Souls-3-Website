"use client";

import { motion } from "framer-motion";

/**
 * Loading screen: a coiled-sword bonfire silhouette (inline SVG) with an
 * animated ember glow and "Kindling the flame..." text. Intended for use as a
 * Suspense / route fallback.
 *
 * Fades out on unmount when wrapped in a parent `<AnimatePresence>` (the
 * `exit` prop is defined here).
 */
export function BonfireLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-soot"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      role="status"
      aria-live="polite"
    >
      <div className="animate-pulse-glow rounded-full">
        <svg
          width="140"
          height="180"
          viewBox="0 0 140 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient id="ds3-flame" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#c2410c" />
              <stop offset="0.55" stopColor="#ff7a18" />
              <stop offset="1" stopColor="#ffd9a0" />
            </linearGradient>
            <linearGradient id="ds3-flame2" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#8b0000" />
              <stop offset="1" stopColor="#ff7a18" />
            </linearGradient>
            <radialGradient id="ds3-ash-glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#ff7a18" stopOpacity="0.4" />
              <stop offset="1" stopColor="#ff7a18" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ground glow */}
          <ellipse cx="70" cy="158" rx="60" ry="16" fill="url(#ds3-ash-glow)" />

          {/* Ash mound / bonfire pile */}
          <path
            d="M28 158 Q 44 140 58 150 Q 70 132 82 148 Q 96 138 112 158 L 112 166 Q 70 174 28 166 Z"
            fill="#1a1208"
            stroke="#3a2a18"
            strokeWidth="1"
          />
          {/* Bones / kindling crossing the pile */}
          <path
            d="M40 152 L 100 148"
            stroke="#4a3a28"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M44 158 L 96 154"
            stroke="#3a2a18"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Flames behind the sword (flicker via class) */}
          <g className="animate-flicker">
            <path
              d="M55 30 C 48 50, 62 58, 52 80 C 45 95, 60 100, 50 120 C 62 110, 68 90, 60 70 C 70 80, 66 55, 55 30 Z"
              fill="url(#ds3-flame)"
              opacity="0.8"
            />
            <path
              d="M85 35 C 92 55, 78 62, 88 82 C 95 96, 80 102, 90 120 C 78 110, 72 90, 80 70 C 70 80, 74 55, 85 35 Z"
              fill="url(#ds3-flame2)"
              opacity="0.7"
            />
            <path
              d="M70 18 C 64 45, 76 52, 68 75 C 60 92, 74 98, 66 118 C 78 108, 82 85, 74 65 C 84 76, 80 48, 70 18 Z"
              fill="url(#ds3-flame)"
              opacity="0.92"
            />
          </g>

          {/* Coiled sword */}
          <g>
            {/* Blade */}
            <path d="M67 40 L 73 40 L 73 130 L 67 130 Z" fill="#d8d2c4" />
            <path d="M67 40 L 73 40 L 70 26 Z" fill="#a8a29e" />
            <path
              d="M67 40 L 70 26 L 70 130 L 67 130 Z"
              fill="#8a8174"
              opacity="0.6"
            />
            {/* Crossguard */}
            <rect x="50" y="127" width="40" height="6" fill="#c5a059" rx="1" />
            <rect
              x="50"
              y="127"
              width="40"
              height="2"
              fill="#e8c878"
              opacity="0.7"
            />
            {/* Grip (wrapped) */}
            <rect x="67.5" y="133" width="5" height="22" fill="#5c3a21" />
            <path
              d="M67 137 Q 70 139 73 137 M67 142 Q 70 144 73 142 M67 147 Q 70 149 73 147 M67 152 Q 70 154 73 152"
              stroke="#3a2410"
              strokeWidth="0.7"
              fill="none"
            />
            {/* Pommel */}
            <circle cx="70" cy="158" r="4" fill="#c5a059" />
            <circle cx="70" cy="158" r="4" fill="none" stroke="#8a6a2a" strokeWidth="0.6" />
          </g>
        </svg>
      </div>

      <p className="mt-6 animate-flicker font-display text-xs smallcaps text-gold tracking-[0.4em]">
        Kindling the flame…
      </p>
    </motion.div>
  );
}

export default BonfireLoader;
