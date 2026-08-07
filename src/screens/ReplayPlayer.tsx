import { Fragment, useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import Pitch from "../components/Pitch";
import GoalCelebration from "../components/GoalCelebration";
import { matches } from "../data";

const EASE = [0.22, 1, 0.36, 1] as const;

// Shot choreography (seconds)
const BALL_DELAY = 0.1;
const BUILDUP = 0.9; // ball rolls up to Maya
const HOLD = 0.16; // a beat at her feet
const SHOT = 0.36; // the strike into the net
const BALL_DUR = BUILDUP + HOLD + SHOT;
const SHOT_START = BALL_DELAY + BUILDUP + HOLD;
const ARRIVAL = BALL_DELAY + BALL_DUR;

export default function ReplayPlayer({ params }: { params: { id: string } }) {
  const nav = useNav();
  const match = matches.find((m) => m.id === params.id) ?? matches[0];
  const reduce = useReducedMotion();
  const cid = "rclip-" + useId().replace(/[:]/g, "");

  const [runId, setRunId] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setCelebrate(false);
    setEnded(false);
    const fireAt = reduce ? 350 : ARRIVAL * 1000;
    const t1 = setTimeout(() => setCelebrate(true), fireAt);
    const t2 = setTimeout(() => {
      setCelebrate(false);
      setEnded(true);
    }, fireAt + 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [runId, reduce]);

  const watchAgain = () => setRunId((r) => r + 1);

  return (
    <div className="screen" style={{ background: "var(--tunnel)", position: "relative" }}>
      {/* top bar */}
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : -12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "calc(18px + env(safe-area-inset-top, 0px)) 16px 12px", flexShrink: 0, zIndex: 41 }}
      >
        <motion.button whileTap={{ scale: 0.9 }} onClick={nav.back} aria-label="Close" style={{ display: "flex" }}>
          <Icon name="x" size={22} color="var(--body)" />
        </motion.button>
        <span className="eyebrow" style={{ color: "var(--body)", fontSize: 12 }}>REPLAY · 2ND HALF</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <AnimatePresence>{celebrate && !muted && <Equalizer key="eq" />}</AnimatePresence>
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"} style={{ display: "flex" }}>
            <Icon name={muted ? "volumeOff" : "volume"} size={20} color={muted ? "var(--mist)" : "var(--body)"} />
          </motion.button>
          <span className="chip" style={{ padding: "5px 11px", fontSize: 12 }}>1×</span>
        </div>
      </motion.div>

      {/* pitch */}
      <div style={{ flex: 1, minHeight: 0, padding: "0 16px" }}>
        <Pitch lines radius={18} style={{ height: "100%" }}>
          {/* goal net (ripples on impact) */}
          <svg viewBox="0 0 100 150" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <motion.g
              stroke="#fff"
              fill="none"
              style={{ transformBox: "fill-box", transformOrigin: "center top" }}
              initial={{ opacity: 0.22, scaleY: 1 }}
              animate={celebrate ? { opacity: [0.22, 0.65, 0.34], scaleY: [1, 1.4, 1] } : { opacity: 0.22, scaleY: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <rect x="34" y="6" width="32" height="12" strokeWidth="0.6" />
              {[38, 42, 46, 50, 54, 58, 62].map((x) => (
                <line key={x} x1={x} y1="6" x2={x} y2="18" strokeWidth="0.3" />
              ))}
              {[9, 12, 15].map((y) => (
                <line key={y} x1="34" y1={y} x2="66" y2={y} strokeWidth="0.3" />
              ))}
            </motion.g>
          </svg>

          <Fragment key={runId}>
            {/* run (dashed, revealed during the buildup) + shot line (drawn at the strike) */}
            <svg viewBox="0 0 100 150" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <defs>
                <clipPath id={cid}>
                  <motion.rect y="0" height="150" initial={{ width: reduce ? 100 : 0 }} animate={{ width: 52 }} transition={{ duration: reduce ? 0 : BUILDUP, delay: BALL_DELAY, ease: "easeOut" }} />
                </clipPath>
              </defs>
              <g clipPath={`url(#${cid})`}>
                <path d="M22 120 L46 78" fill="none" stroke="#FFB800" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="1.5 4" opacity="0.85" />
              </g>
              <motion.path
                d="M46 78 L60 14"
                fill="none"
                stroke="#FF4D00"
                strokeWidth="2.2"
                strokeLinecap="round"
                initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: reduce ? 0 : SHOT_START, duration: reduce ? 0 : SHOT, ease: "easeOut" }}
                style={{ filter: "drop-shadow(0 0 3px rgba(255,77,0,0.7))" }}
              />
            </svg>

            {/* strike burst at Maya's feet as the shot leaves */}
            {!reduce && (
              <motion.span
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [0.3, 2.4], opacity: [0.8, 0] }}
                transition={{ delay: SHOT_START, duration: 0.5, ease: "easeOut" }}
                style={{ position: "absolute", left: "46%", top: "52%", width: 26, height: 26, marginLeft: -13, marginTop: -13, borderRadius: "50%", border: "2px solid var(--amber)" }}
              />
            )}

            {/* the ball: rolls up to Maya, a beat, then a fast strike into the net */}
            <motion.span
              initial={{ left: reduce ? "60%" : "22%", top: reduce ? "9.3%" : "80%", opacity: reduce ? 1 : 0 }}
              animate={{ left: ["22%", "46%", "46%", "60%"], top: ["80%", "52%", "52%", "9.3%"], opacity: [1, 1, 1, 1] }}
              transition={{
                delay: BALL_DELAY,
                duration: reduce ? 0 : BALL_DUR,
                times: [0, BUILDUP / BALL_DUR, (BUILDUP + HOLD) / BALL_DUR, 1],
                ease: ["easeOut", "linear", "easeOut"],
              }}
              style={{ position: "absolute", width: 10, height: 10, borderRadius: 5, transform: "translate(-50%,-50%)", background: "#fff", boxShadow: "0 0 7px 1px rgba(255,255,255,0.7)" }}
            />

            {/* speed pill (bottom) */}
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 8, scale: reduce ? 1 : 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.5, duration: 0.4, ease: EASE } }}
              style={{ position: "absolute", left: "50%", bottom: 16, transform: "translateX(-50%)", background: "var(--amber)", color: "var(--bg)", borderRadius: 20, padding: "8px 14px", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}
            >
              MAYA · {match.topKmh} KM/H
              <Icon name="bolt" size={13} color="var(--bg)" />
            </motion.div>
          </Fragment>

          {/* teammates + opponents */}
          {[
            { x: 52, y: 26 }, { x: 30, y: 36 }, { x: 68, y: 32 }, { x: 24, y: 54 },
            { x: 72, y: 50 }, { x: 40, y: 64 }, { x: 60, y: 72 }, { x: 36, y: 80 },
          ].map((d, i) => (
            <span key={i} style={{ position: "absolute", left: `${d.x}%`, top: `${d.y}%`, width: 13, height: 13, borderRadius: 7, transform: "translate(-50%,-50%)", background: "#e9efe9" }} />
          ))}
          {[{ x: 54, y: 20 }, { x: 66, y: 40 }].map((d, i) => (
            <span key={i} style={{ position: "absolute", left: `${d.x}%`, top: `${d.y}%`, width: 13, height: 13, borderRadius: 7, transform: "translate(-50%,-50%)", background: "var(--away)" }} />
          ))}

          {/* maya (flares when the goal lands) */}
          <motion.span
            className="pulse-glow"
            animate={{ scale: celebrate ? [1, 1.75, 1.15] : 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ position: "absolute", left: "46%", top: "52%", width: 22, height: 22, borderRadius: 11, marginLeft: -11, marginTop: -11, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 12, color: "var(--bg)" }}
          >
            9
          </motion.span>
        </Pitch>
      </div>

      {/* controls */}
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 16 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.4, ease: EASE } }}
        style={{ padding: "16px 16px calc(20px + env(safe-area-inset-bottom,8px))", flexShrink: 0, position: "relative", zIndex: 41 }}
      >
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <motion.span whileTap={{ scale: 0.97 }} className="btn btn-primary" style={{ flex: 1, fontSize: 14, padding: "12px" }}>
            <Icon name="target" size={16} color="var(--bg)" />
            Following Maya
          </motion.span>
          <motion.span whileTap={{ scale: 0.97 }} className="btn btn-secondary" style={{ flex: 1, fontSize: 14, padding: "12px" }}>
            All 22 players
          </motion.span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <motion.button whileTap={{ scale: 0.92 }} onClick={watchAgain} aria-label={ended ? "Watch again" : "Pause"} style={{ width: 44, height: 44, borderRadius: 22, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {ended ? (
              <Icon name="replays" size={18} color="var(--bg)" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--bg)">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            )}
          </motion.button>
          <div style={{ flex: 1 }}>
            <div style={{ position: "relative", height: 4, borderRadius: 2, background: "var(--line)" }}>
              <motion.div key={"f" + runId} initial={{ width: reduce ? "84%" : "0%" }} animate={{ width: "84%" }} transition={{ duration: reduce ? 0 : BALL_DUR, delay: BALL_DELAY, ease: "easeOut" }} style={{ position: "absolute", left: 0, top: 0, bottom: 0, background: "var(--amber)", borderRadius: 2 }} />
              {[20, 44, 62].map((p) => (
                <span key={p} style={{ position: "absolute", left: `${p}%`, top: "50%", width: 7, height: 7, borderRadius: 4, transform: "translate(-50%,-50%)", background: "var(--amber)", border: "1.5px solid var(--tunnel)" }} />
              ))}
              <motion.span key={"p" + runId} initial={{ left: reduce ? "84%" : "0%" }} animate={{ left: "84%" }} transition={{ duration: reduce ? 0 : BALL_DUR, delay: BALL_DELAY, ease: "easeOut" }} style={{ position: "absolute", top: "50%", width: 13, height: 13, borderRadius: 7, transform: "translate(-50%,-50%)", background: "var(--amber)", border: "2px solid var(--tunnel)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span className="mono" style={{ fontSize: 11, color: "var(--body)" }}>58:12</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--mist)" }}>70:00</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* haptic-style screen flash on impact */}
      <AnimatePresence>
        {celebrate && !reduce && (
          <motion.div
            key={"flash" + runId}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, times: [0, 0.28, 1], ease: "easeOut" }}
            style={{ position: "absolute", inset: 0, zIndex: 48, pointerEvents: "none", background: "radial-gradient(65% 50% at 60% 11%, rgba(255,244,214,0.95), rgba(255,184,0,0.25) 45%, transparent 72%)" }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {celebrate && <GoalCelebration key={runId} score={match.score} originX="60%" originY="11%" />}
      </AnimatePresence>
    </div>
  );
}

function Equalizer() {
  return (
    <motion.div
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: "auto" }}
      exit={{ opacity: 0, width: 0 }}
      transition={{ duration: 0.25 }}
      style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 16, overflow: "hidden" }}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ height: [4, 15, 6, 16, 5] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
          style={{ width: 3, borderRadius: 2, background: "var(--amber)" }}
        />
      ))}
    </motion.div>
  );
}
