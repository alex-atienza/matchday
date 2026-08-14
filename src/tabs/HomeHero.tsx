import { motion, useReducedMotion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import { img, matches } from "../data";
import { useTheme } from "../theme";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function HomeHero() {
  const nav = useNav();
  const reduce = useReducedMotion();
  const { theme, setPickerOpen } = useTheme();
  const draft = theme === "draft";
  const last = matches[0];

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: EASE },
  });

  return (
    <div style={{ position: "relative", height: 400, flexShrink: 0, overflow: "hidden" }}>
      {/* photo */}
      <motion.img
        src={img(800, 900, 77)}
        alt=""
        initial={{ scale: reduce ? 1 : 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* floodlit scrim — fades into the app background so the list flows out of it */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(5,7,10,0.62) 0%, rgba(5,7,10,0.12) 30%, rgba(12,14,16,0.82) 74%, var(--bg) 100%)",
        }}
      />
      {/* floodlight bloom — Direction A only; Sunday Draft's scrim is neutral */}
      {!draft && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(70% 45% at 50% 6%, rgba(255,184,0,0.16), transparent 70%)",
          }}
        />
      )}

      {/* wordmark + avatar */}
      <div className="on-media" style={{ position: "absolute", top: "calc(18px + env(safe-area-inset-top, 0px))", left: 20, right: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="display" style={{ fontSize: 17, letterSpacing: "0.06em", color: "var(--ink)" }}>
          Matchday
        </span>
        {/* doubles as the prototype's direction picker */}
        <button
          className="avatar press"
          aria-label="Design direction"
          onClick={() => setPickerOpen(true)}
          style={{ width: 34, height: 34, fontSize: 15 }}
        >
          M
        </button>
      </div>

      {/* headline block */}
      <div className="on-media" style={{ position: "absolute", left: 20, right: 20, bottom: 20 }}>
        <motion.div {...rise(0.1)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: 4, background: "var(--amber)", boxShadow: "0 0 8px 1px rgba(255,184,0,0.8)" }} />
          <span className="eyebrow" style={{ color: "var(--amber)" }}>
            Full-time · Saturday
          </span>
        </motion.div>

        <motion.h1
          {...rise(0.18)}
          className="display"
          style={{ margin: "10px 0 0", fontSize: 54, lineHeight: 0.86 }}
        >
          Maya scored
          <br />
          twice
        </motion.h1>

        <motion.p
          {...rise(0.26)}
          style={{ margin: "10px 0 0", fontSize: 14.5, fontWeight: 500, color: "var(--body)" }}
        >
          Ravens {last.score} {last.opponent.split(" ")[0]} · {last.moments.length} key moments
        </motion.p>

        <motion.button
          {...rise(0.34)}
          whileTap={{ scale: 0.97 }}
          onClick={() => nav.push({ screen: "replay", params: { id: last.id, min: 58 } })}
          className="btn btn-primary"
          style={{ marginTop: 16 }}
        >
          <Icon name="play" size={16} color="var(--on-accent)" />
          Watch the replay
        </motion.button>
      </div>
    </div>
  );
}
