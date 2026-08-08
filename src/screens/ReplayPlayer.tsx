import { Fragment, useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import Pitch from "../components/Pitch";
import GoalCelebration from "../components/GoalCelebration";
import { matches, type Moment } from "../data";
import { getPlay, ballFrames, mayaFrames, playDuration, strikeEnd, toD, pctX, pctY, BUILD } from "../plays";
import { getPlayer } from "../squad";

const EASE = [0.22, 1, 0.36, 1] as const;
const DELAY = 0.12;

export default function ReplayPlayer({ params }: { params: { id: string; min?: number } }) {
  const nav = useNav();
  const reduce = useReducedMotion();
  const cid = "rclip-" + useId().replace(/[:]/g, "");

  const match = matches.find((m) => m.id === params.id) ?? matches[0];
  const moment: Moment | undefined = useMemo(() => {
    if (params.min != null) return match.moments.find((m) => m.min === params.min);
    return match.moments.find((m) => m.kind === "our") ?? match.moments[0];
  }, [match, params.min]);

  const play = getPlay(moment?.play, moment?.kind ?? "our");
  const ball = ballFrames(play);
  const maya = mayaFrames(play);
  const dur = playDuration(play);
  const end = strikeEnd(play);
  const isSprint = play.kind === "sprint";

  const [runId, setRunId] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);

  const arrival = reduce ? 0.35 : DELAY + dur;

  useEffect(() => {
    setCelebrate(false);
    setEnded(false);
    const t1 = setTimeout(() => setCelebrate(true), arrival * 1000);
    const t2 = setTimeout(() => {
      setCelebrate(false);
      setEnded(true);
    }, arrival * 1000 + 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [runId, arrival]);

  const min = moment?.min ?? 58;
  const half = min > 40 ? "2ND HALF" : "1ST HALF";
  const clock = `${min}:12`;
  const progress = Math.min(0.94, min / 80);
  const scorer = moment?.who ? getPlayer(moment.who) : null;

  /* celebration copy varies by outcome */
  const cel = (() => {
    switch (play.kind) {
      case "goal":
        return { headline: "GOAL!", line2: `RAVENS ${match.score}`, sub: `${scorer?.name ?? "Maya"} · #${scorer?.num ?? 9} · ${min}'`, accent: "var(--amber)", confetti: true };
      case "assist":
        return { headline: "ASSIST!", line2: `RAVENS ${match.score}`, sub: `Maya set it up · ${min}'`, accent: "var(--amber)", confetti: true };
      case "save":
        return { headline: "SAVED!", sub: `${scorer?.name ?? "Ivy"} keeps it out · ${min}'`, accent: "var(--away)", confetti: false };
      case "conceded":
        return { headline: "THEY SCORED", line2: `RAVENS ${match.score}`, sub: `${match.opponent} · ${min}'`, accent: "var(--their)", confetti: false };
      default:
        return { headline: `${match.topKmh} KM/H`, sub: `Maya's top speed · ${min}'`, accent: "var(--amber)", confetti: false };
    }
  })();

  const netEnd: "top" | "bottom" | null = end ? (end[1] > 75 ? "bottom" : "top") : null;

  return (
    <div className="screen" style={{ background: "var(--tunnel)", position: "relative" }}>
      {/* top bar */}
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : -12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "calc(18px + env(safe-area-inset-top, 0px)) 16px 12px", flexShrink: 0, zIndex: 41, gap: 10 }}
      >
        <motion.button whileTap={{ scale: 0.9 }} onClick={nav.back} aria-label="Close" style={{ display: "flex", flexShrink: 0 }}>
          <Icon name="x" size={22} color="var(--body)" />
        </motion.button>
        <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
          <div className="eyebrow" style={{ color: "var(--body)", fontSize: 11.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {min}' · {(moment?.title ?? "REPLAY").split(" · ")[0]}
          </div>
          <div className="muted" style={{ fontSize: 10.5, marginTop: 1 }}>{half}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <AnimatePresence>{celebrate && !muted && cel.confetti && <Equalizer key="eq" />}</AnimatePresence>
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"} style={{ display: "flex" }}>
            <Icon name={muted ? "volumeOff" : "volume"} size={20} color={muted ? "var(--mist)" : "var(--body)"} />
          </motion.button>
        </div>
      </motion.div>

      {/* pitch */}
      <div style={{ flex: 1, minHeight: 0, padding: "0 16px" }}>
        <Pitch lines radius={18} style={{ height: "100%" }}>
          {/* nets, both ends */}
          <svg viewBox="0 0 100 150" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            {(["top", "bottom"] as const).map((side) => {
              const y = side === "top" ? 6 : 132;
              const live = celebrate && netEnd === side && play.kind !== "save";
              return (
                <motion.g
                  key={side}
                  stroke="#fff"
                  fill="none"
                  style={{ transformBox: "fill-box", transformOrigin: side === "top" ? "center top" : "center bottom" }}
                  initial={{ opacity: 0.2, scaleY: 1 }}
                  animate={live ? { opacity: [0.2, 0.65, 0.32], scaleY: [1, 1.4, 1] } : { opacity: 0.2, scaleY: 1 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <rect x="34" y={y} width="32" height="12" strokeWidth="0.6" />
                  {[38, 42, 46, 50, 54, 58, 62].map((x) => (
                    <line key={x} x1={x} y1={y} x2={x} y2={y + 12} strokeWidth="0.3" />
                  ))}
                  {[3, 6, 9].map((d) => (
                    <line key={d} x1="34" y1={y + d} x2="66" y2={y + d} strokeWidth="0.3" />
                  ))}
                </motion.g>
              );
            })}
          </svg>

          {/* other players */}
          {play.mates.map((p, i) => (
            <span key={"m" + i} style={{ position: "absolute", left: pctX(p[0]), top: pctY(p[1]), width: 13, height: 13, borderRadius: 7, transform: "translate(-50%,-50%)", background: "#e9efe9" }} />
          ))}
          {play.foes.map((p, i) => (
            <span key={"f" + i} style={{ position: "absolute", left: pctX(p[0]), top: pctY(p[1]), width: 13, height: 13, borderRadius: 7, transform: "translate(-50%,-50%)", background: "var(--away)" }} />
          ))}

          <Fragment key={runId}>
            {/* paths */}
            <svg viewBox="0 0 100 150" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <defs>
                <clipPath id={cid}>
                  <motion.circle
                    cx={play.run[0][0]}
                    cy={play.run[0][1]}
                    initial={{ r: reduce ? 260 : 0 }}
                    animate={{ r: 260 }}
                    transition={{ duration: reduce ? 0 : BUILD * 1.05, delay: DELAY, ease: "linear" }}
                  />
                </clipPath>
              </defs>
              <g clipPath={`url(#${cid})`}>
                <path d={toD(play.run)} fill="none" stroke="#FFB800" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.5 4" opacity="0.9" />
              </g>
              {play.strike && play.strike.length > 1 && (
                <motion.path
                  d={toD(play.strike)}
                  fill="none"
                  stroke={play.kind === "conceded" ? "#E5484D" : "#FF4D00"}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: reduce ? 0 : DELAY + dur - 0.4, duration: reduce ? 0 : 0.4, ease: "easeOut" }}
                  style={{ filter: "drop-shadow(0 0 3px rgba(255,77,0,0.7))" }}
                />
              )}
            </svg>

            {/* strike burst where the ball is struck */}
            {!reduce && play.strike && (
              <motion.span
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [0.3, 2.4], opacity: [0.8, 0] }}
                transition={{ delay: DELAY + dur - 0.4, duration: 0.5, ease: "easeOut" }}
                style={{ position: "absolute", left: pctX(play.strike[0][0]), top: pctY(play.strike[0][1]), width: 26, height: 26, marginLeft: -13, marginTop: -13, borderRadius: "50%", border: "2px solid var(--amber)" }}
              />
            )}

            {/* the ball (hidden on sprint replays — Maya is the subject) */}
            {!isSprint && (
              <motion.span
                initial={{ left: ball.xs[0], top: ball.ys[0], opacity: reduce ? 1 : 0 }}
                animate={{ left: ball.xs, top: ball.ys, opacity: 1 }}
                transition={{ delay: DELAY, duration: reduce ? 0 : dur, times: ball.times, ease: "easeOut" }}
                style={{ position: "absolute", width: 10, height: 10, borderRadius: 5, transform: "translate(-50%,-50%)", background: "#fff", boxShadow: "0 0 7px 1px rgba(255,255,255,0.7)" }}
              />
            )}

            {/* Maya */}
            {play.mayaFollows ? (
              <motion.span
                className="pulse-glow"
                initial={{ left: maya.xs[0], top: maya.ys[0] }}
                animate={{ left: maya.xs, top: maya.ys }}
                transition={{ delay: DELAY, duration: reduce ? 0 : dur, times: maya.times, ease: "easeOut" }}
                style={{ position: "absolute", width: 22, height: 22, borderRadius: 11, marginLeft: -11, marginTop: -11, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 12, color: "var(--bg)" }}
              >
                9
              </motion.span>
            ) : (
              <motion.span
                className="pulse-glow"
                animate={{ scale: celebrate && cel.confetti ? [1, 1.7, 1.15] : 1 }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{ position: "absolute", left: pctX(play.maya[0]), top: pctY(play.maya[1]), width: 22, height: 22, borderRadius: 11, marginLeft: -11, marginTop: -11, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 12, color: "var(--bg)" }}
              >
                9
              </motion.span>
            )}

            {/* speed pill — the payoff on sprint replays */}
            {isSprint && (
              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 8, scale: reduce ? 1 : 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.45, duration: 0.4, ease: EASE } }}
                style={{ position: "absolute", left: "50%", bottom: 16, transform: "translateX(-50%)", background: "var(--amber)", color: "var(--bg)", borderRadius: 20, padding: "8px 14px", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}
              >
                MAYA · {match.topKmh} KM/H
                <Icon name="bolt" size={13} color="var(--bg)" />
              </motion.div>
            )}
          </Fragment>
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
          <motion.button whileTap={{ scale: 0.92 }} onClick={() => setRunId((r) => r + 1)} aria-label={ended ? "Watch again" : "Pause"} style={{ width: 44, height: 44, borderRadius: 22, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
              <motion.div key={"f" + runId} initial={{ width: reduce ? `${progress * 100}%` : "0%" }} animate={{ width: `${progress * 100}%` }} transition={{ duration: reduce ? 0 : dur, delay: DELAY, ease: "easeOut" }} style={{ position: "absolute", left: 0, top: 0, bottom: 0, background: "var(--amber)", borderRadius: 2 }} />
              {match.moments.map((m) => (
                <span key={m.min} style={{ position: "absolute", left: `${Math.min(94, (m.min / 80) * 100)}%`, top: "50%", width: 7, height: 7, borderRadius: 4, transform: "translate(-50%,-50%)", background: m.min === min ? "var(--ink)" : "var(--faint)", border: "1.5px solid var(--tunnel)" }} />
              ))}
              <motion.span key={"p" + runId} initial={{ left: reduce ? `${progress * 100}%` : "0%" }} animate={{ left: `${progress * 100}%` }} transition={{ duration: reduce ? 0 : dur, delay: DELAY, ease: "easeOut" }} style={{ position: "absolute", top: "50%", width: 13, height: 13, borderRadius: 7, transform: "translate(-50%,-50%)", background: "var(--amber)", border: "2px solid var(--tunnel)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span className="mono" style={{ fontSize: 11, color: "var(--body)" }}>{clock}</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--mist)" }}>80:00</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* impact flash */}
      <AnimatePresence>
        {celebrate && !reduce && end && (
          <motion.div
            key={"flash" + runId}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, times: [0, 0.28, 1], ease: "easeOut" }}
            style={{ position: "absolute", inset: 0, zIndex: 48, pointerEvents: "none", background: `radial-gradient(65% 50% at ${end[0]}% ${(end[1] / 150) * 100}%, ${cel.accent}, transparent 62%)` }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {celebrate && (
          <GoalCelebration
            key={runId}
            headline={cel.headline}
            line2={cel.line2}
            sub={cel.sub}
            accent={cel.accent}
            confetti={cel.confetti}
            originX={end ? pctX(end[0]) : "50%"}
            originY={end ? pctY(end[1]) : "40%"}
          />
        )}
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
