import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Pt = [number, number];

/* A goal trail that draws itself left→right (dashes preserved via a growing
   clip) while the ball rolls along a → b → c. */
export default function GoalTrail({
  w,
  h,
  a,
  b,
  c,
  duration = 0.95,
  delay = 0.15,
}: {
  w: number;
  h: number;
  a: Pt;
  b: Pt;
  c: Pt;
  duration?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const cid = "clip-" + useId().replace(/[:]/g, "");
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <defs>
        <clipPath id={cid}>
          <motion.rect
            x="0"
            y="0"
            height={h}
            initial={{ width: reduce ? w : 0 }}
            animate={{ width: w }}
            transition={{ duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease }}
          />
        </clipPath>
      </defs>
      <g clipPath={`url(#${cid})`}>
        <path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} fill="none" stroke="#FFB800" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 6" />
        <path d={`M${b[0]} ${b[1]} L${c[0]} ${c[1]}`} fill="none" stroke="#FF4D00" strokeWidth="3" strokeLinecap="round" />
      </g>
      <motion.circle
        r="5"
        fill="#fff"
        initial={{ cx: reduce ? c[0] : a[0], cy: reduce ? c[1] : a[1], opacity: reduce ? 1 : 0 }}
        animate={{ cx: [a[0], b[0], c[0]], cy: [a[1], b[1], c[1]], opacity: 1 }}
        transition={{ duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease, times: [0, 0.5, 1] }}
      />
    </svg>
  );
}
