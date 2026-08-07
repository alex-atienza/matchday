import type { Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Staggered list: container reveals children one after another. */
export const listContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055, delayChildren: 0.03 },
  },
};

export const listItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } },
};

/* Simple entrance for a single block. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

/* Grid tiles pop in with a touch of scale. */
export const tilePop: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.38, ease: EASE } },
};

export const springy = { type: "spring", stiffness: 500, damping: 30 } as const;
