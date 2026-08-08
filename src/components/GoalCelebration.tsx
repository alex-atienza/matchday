import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const COLORS = ["#FFB800", "#FF4D00", "#3DBB6E", "#F5F7F4", "#8CA3B8"];

type Particle = {
  id: number;
  color: string;
  w: number;
  h: number;
  round: boolean;
  xEnd: number;
  rise: number;
  fall: number;
  rot: number;
  delay: number;
  dur: number;
};

function makeParticles(n: number): Particle[] {
  return Array.from({ length: n }).map((_, i) => {
    const w = 5 + Math.random() * 5;
    return {
      id: i,
      color: COLORS[i % COLORS.length],
      w,
      h: 8 + Math.random() * 9,
      round: Math.random() < 0.3,
      xEnd: (Math.random() - 0.5) * 330,
      rise: 60 + Math.random() * 150,
      fall: 320 + Math.random() * 300,
      rot: (Math.random() - 0.5) * 760,
      delay: Math.random() * 0.12,
      dur: 1.6 + Math.random() * 1,
    };
  });
}

export default function GoalCelebration({
  headline,
  line2,
  sub,
  accent = "var(--amber)",
  confetti = true,
  originX = "50%",
  originY = "30%",
}: {
  headline: string;
  line2?: string;
  sub?: string;
  accent?: string;
  confetti?: boolean;
  originX?: string;
  originY?: string;
}) {
  const reduce = useReducedMotion();
  const parts = useMemo(() => makeParticles(reduce || !confetti ? 0 : 58), [reduce, confetti]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{ position: "absolute", inset: 0, zIndex: 40, pointerEvents: "none", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% 34%, rgba(5,7,10,0.35), rgba(5,7,10,0.72))" }} />

      {/* shockwave rings */}
      {!reduce &&
        [0, 1].map((i) => (
          <motion.span
            key={i}
            initial={{ scale: 0.2, opacity: 0.55 }}
            animate={{ scale: 6.5, opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut", delay: i * 0.18 }}
            style={{ position: "absolute", left: originX, top: originY, width: 64, height: 64, marginLeft: -32, marginTop: -32, borderRadius: "50%", border: `2px solid ${accent}` }}
          />
        ))}

      {parts.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: [0, p.xEnd * 0.5, p.xEnd], y: [0, -p.rise, p.fall], rotate: [0, p.rot * 0.5, p.rot], opacity: [1, 1, 0] }}
          transition={{ duration: p.dur, delay: p.delay, ease: [0.16, 0.7, 0.4, 1], times: [0, 0.32, 1] }}
          style={{ position: "absolute", left: originX, top: originY, width: p.w, height: p.round ? p.w : p.h, borderRadius: p.round ? "50%" : 1, background: p.color }}
        />
      ))}

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 24, textAlign: "center" }}>
        <motion.div
          initial={{ scale: reduce ? 1 : 0.5, opacity: 0, rotate: reduce ? 0 : -6 }}
          animate={{ scale: 1, opacity: 1, rotate: -3 }}
          transition={{ type: "spring", stiffness: 460, damping: 15, delay: 0.05 }}
          className="display"
          style={{ fontSize: headline.length > 9 ? 46 : 66, lineHeight: 0.9, color: accent, textShadow: `0 0 26px ${accent}66` }}
        >
          {headline}
        </motion.div>
        {line2 && (
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="display"
            style={{ fontSize: 32, lineHeight: 1, color: "var(--ink)" }}
          >
            {line2}
          </motion.div>
        )}
        {sub && (
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="eyebrow"
            style={{ color: "var(--body)", fontSize: 12, letterSpacing: "0.16em" }}
          >
            {sub}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
