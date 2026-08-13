import type { CardTier } from "./data";

/* Six collectible finishes — all drawn from the "Under the Lights" palette. */
export type TierStyle = {
  bg: string;
  border: string;
  ink: string;
  accent: string;
  sub: string;
  glow?: string;
  foil?: boolean;
  /** ink-on-light finishes need dark chrome */
  light?: boolean;
};

export const TIER_STYLE: Record<CardTier, TierStyle> = {
  legendary: {
    bg: "linear-gradient(150deg,#6b4e12 0%,#33260a 46%,#120d04 100%)",
    border: "#FFB800",
    ink: "#FFF3D4",
    accent: "#FFB800",
    sub: "rgba(255,243,212,0.62)",
    glow: "0 0 24px -6px rgba(255,184,0,0.55)",
    foil: true,
  },
  heat: {
    bg: "linear-gradient(150deg,#FFB800 0%,#FF4D00 100%)",
    border: "transparent",
    ink: "#0C0E10",
    accent: "#0C0E10",
    sub: "rgba(12,14,16,0.72)",
    glow: "0 0 24px -8px rgba(255,77,0,0.6)",
    light: true,
  },
  clean: {
    bg: "linear-gradient(160deg,#14301f 0%,#08150e 100%)",
    border: "#3DBB6E",
    ink: "#F5F7F4",
    accent: "#3DBB6E",
    sub: "rgba(215,222,218,0.6)",
  },
  playmaker: {
    bg: "linear-gradient(160deg,#1a2a63 0%,#0E1633 100%)",
    border: "#3d4f92",
    ink: "#F5F7F4",
    accent: "#8FB0FF",
    sub: "rgba(143,176,255,0.68)",
  },
  debut: {
    bg: "linear-gradient(160deg,#EDF1EC 0%,#B9C3BC 100%)",
    border: "#F5F7F4",
    ink: "#0C0E10",
    accent: "#14201A",
    sub: "rgba(12,14,16,0.6)",
    light: true,
  },
  standard: {
    bg: "linear-gradient(160deg,#1b2431 0%,#0d1219 100%)",
    border: "#2b3644",
    ink: "#F5F7F4",
    accent: "#8CA3B8",
    sub: "rgba(140,163,184,0.7)",
  },
};

/**
 * Sunday Draft leaves the collectible finishes undesigned on purpose.
 *
 * The six tiers above are the most speculative idea in the product, and dressing
 * them in foil and glow oversold them — people reacted to the finishes rather
 * than to whether a card is worth having at all. Here every tier collapses to
 * the same light grey block. The concept stays legible (cards exist, they have
 * tiers, they carry a rating and a headline) while the design plainly announces
 * that it has not been resolved.
 *
 * `light: true` keeps the rarity chip's border dark enough to read on grey.
 */
export const DRAFT_TIER_STYLE: TierStyle = {
  bg: "var(--elevated)",
  border: "var(--line)",
  ink: "var(--ink)",
  accent: "var(--mist)",
  sub: "var(--faint)",
  light: true,
};

export function tierStyle(tier: CardTier, draft: boolean): TierStyle {
  return draft ? DRAFT_TIER_STYLE : TIER_STYLE[tier];
}
