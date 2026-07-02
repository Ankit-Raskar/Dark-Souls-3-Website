"use client";

import { type ElementType, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  /** Delay (seconds) before the reveal animation begins. */
  delay?: number;
  /** Initial vertical offset in pixels (default 28). */
  y?: number;
  /** Tag to render. Defaults to "div". */
  as?:
    | "div"
    | "section"
    | "article"
    | "header"
    | "footer"
    | "nav"
    | "main"
    | "aside"
    | "ul"
    | "ol"
    | "li"
    | "p"
    | "span";
  /** Whether the reveal should only happen once (default true). */
  once?: boolean;
}

const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  footer: motion.footer,
  nav: motion.nav,
  main: motion.main,
  aside: motion.aside,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  p: motion.p,
  span: motion.span,
} as const;

type TagName = keyof typeof MOTION_TAGS;

/**
 * Reusable scroll-into-view reveal wrapper. Fades children in with a slight
 * upward translate and blur using Framer Motion `whileInView`.
 *
 * Respects `prefers-reduced-motion`: renders plain children with no transform
 * or animation.
 */
export function SectionReveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
  once = true,
}: SectionRevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = MOTION_TAGS[as as TagName] ?? motion.div;

  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </MotionTag>
  );
}

export default SectionReveal;
