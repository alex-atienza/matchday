import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import Pitch from "../components/Pitch";
import GoalCelebration from "../components/GoalCelebration";
import { matches, type Moment } from "../data";
import {
  getPlay, ballFrames, mayaFrames, playDuration, strikeEnd, toD, pctX, pctY, BUILD,
  FILL_OURS, FILL_THEIRS,
} from "../plays";
import { getPlayer, squad } from "../squad";

const EASE = [0.22, 1, 0.36, 1] as const;
const DELAY = 0.12;
const FULL = 80; // minutes on the timeline

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** A moment somewhere in the season. */
export type Cue = { id: string; min: number };

export type ReplayParams = {
  id: string;
  min?: number;
  /** the run of moments this replay belongs to — a game, or a player's highlights */
  queue?: Cue[];
  queueLabel?: string;
};

export default function ReplayPlayer({ params }: { params: ReplayParams }) {
  const nav = useNav();
  const reduce = useReducedMotion();
  const cid = "rclip-" + useId().replace(/[:]/g, "");

  const first = matches.find((m) => m.id === params.id) ?? matches[0];
  const [cursor, setCursor] = useState<Cue>({
    id: first.id,
    min: params.min ?? (first.moments.find((m) => m.kind === "our") ?? first.moments[0])?.min ?? 58,
  });

  const [runId, setRunId] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [followMaya, setFollowMaya] = useState(true);

  const match = matches.find((m) => m.id === cursor.id) ?? matches[0];
  const moment: Moment | undefined = useMemo(
    () => match.moments.find((m) => m.min === cursor.min) ?? match.moments[0],
    [match, cursor.min],
  );

  /* ---------- the queue ---------- */
  const queue: Cue[] = params.queue?.length
    ? params.queue
    : match.moments.map((m) => ({ id: match.id, min: m.min }));
  const queueLabel = params.queueLabel ?? `${match.home ? "vs" : "@"} ${match.opponent}`;
  const idx = queue.findIndex((q) => q.id === cursor.id && q.min === cursor.min);
  const next = idx >= 0 ? queue[idx + 1] : queue[0];
  const prev = idx > 0 ? queue[idx - 1] : undefined;

  const cueInfo = (c?: Cue) => {
    if (!c) return null;
    const m = matches.find((x) => x.id === c.id);
    const mo = m?.moments.find((x) => x.min === c.min);
    return mo ? { match: m!, moment: mo } : null;
  };
  const nextInfo = cueInfo(next);

  const go = (c: Cue) => setCursor(c);

  /* ---------- scrubbing (within the current match) ---------- */
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrubMin, setScrubMin] = useState<number | null>(null);
  const scrubRef = useRef<number | null>(null);
  const setScrub = (v: number | null) => {
    scrubRef.current = v;
    setScrubMin(v);
  };

  const nearestMoment = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return cursor.min;
    const r = el.getBoundingClientRect();
    const t = clamp((clientX - r.left) / r.width, 0, 1) * FULL;
    return match.moments.reduce((a, b) => (Math.abs(b.min - t) < Math.abs(a.min - t) ? b : a)).min;
  };

  const onDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setScrub(nearestMoment(e.clientX));
  };
  const onMove = (e: React.PointerEvent) => {
    if (scrubRef.current === null) return;
    setScrub(nearestMoment(e.clientX));
  };
  const onUp = () => {
    const v = scrubRef.current;
    if (v === null) return;
    if (v !== cursor.min) setCursor({ id: match.id, min: v });
    else setRunId((r) => r + 1);
    setScrub(null);
  };

  /* ---------- playback ---------- */
  const play = getPlay(moment?.play, moment?.kind ?? "our");
  const ball = ballFrames(play);
  const maya = mayaFrames(play);
  const dur = playDuration(play);
  const end = strikeEnd(play);
  const isSprint = play.kind === "sprint";
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
  }, [runId, cursor.id, cursor.min, arrival]);

  const min = moment?.min ?? cursor.min;
  const half = min > 40 ? "2ND HALF" : "1ST HALF";
  const scorer = moment?.who ? getPlayer(moment.who) : null;
  const pctOf = (m: number) => clamp((m / FULL) * 100, 1, 97);
  const headMin = scrubMin ?? min;
  const scrubbing = scrubMin !== null;
  const scrubMoment = scrubbing ? match.moments.find((m) => m.min === scrubMin) : null;
  const glide = scrubbing
    ? ({ duration: 0 } as const)
    : ({ type: "spring", stiffness: 420, damping: 36 } as const);

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
  const mates = followMaya ? play.mates : [...play.mates, ...FILL_OURS];
  const foes = followMaya ? play.foes : [...play.foes, ...FILL_THEIRS];
  const outfield = squad.filter((p) => !p.isMaya);
  const animKey = `${cursor.id}:${cursor.min}:${runId}`;

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
          <div className="muted" style={{ fontSize: 10.5, marginTop: 1 }}>
            {queueLabel} · {half}
          </div>
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

          {mates.map((p, i) => (
            <motion.span
              key={"m" + i}
              initial={false}
              animate={{ opacity: followMaya ? 0.85 : 1, width: followMaya ? 13 : 19, height: followMaya ? 13 : 19 }}
              transition={{ duration: 0.25, ease: EASE }}
              style={{ position: "absolute", left: pctX(p[0]), top: pctY(p[1]), borderRadius: 12, transform: "translate(-50%,-50%)", background: "#e9efe9", color: "#0C0E10", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 10 }}
            >
              {!followMaya && outfield[i % outfield.length]?.num}
            </motion.span>
          ))}
          {foes.map((p, i) => (
            <motion.span
              key={"f" + i}
              initial={false}
              animate={{ opacity: followMaya ? 0.85 : 1, width: followMaya ? 13 : 19, height: followMaya ? 13 : 19 }}
              transition={{ duration: 0.25, ease: EASE }}
              style={{ position: "absolute", left: pctX(p[0]), top: pctY(p[1]), borderRadius: 12, transform: "translate(-50%,-50%)", background: "var(--away)", color: "#0C0E10", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 10 }}
            >
              {!followMaya && i + 2}
            </motion.span>
          ))}

          <Fragment key={animKey}>
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

            {!reduce && play.strike && (
              <motion.span
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [0.3, 2.4], opacity: [0.8, 0] }}
                transition={{ delay: DELAY + dur - 0.4, duration: 0.5, ease: "easeOut" }}
                style={{ position: "absolute", left: pctX(play.strike[0][0]), top: pctY(play.strike[0][1]), width: 26, height: 26, marginLeft: -13, marginTop: -13, borderRadius: "50%", border: "2px solid var(--amber)" }}
              />
            )}

            {!isSprint && (
              <motion.span
                initial={{ left: ball.xs[0], top: ball.ys[0], opacity: reduce ? 1 : 0 }}
                animate={{ left: ball.xs, top: ball.ys, opacity: 1 }}
                transition={{ delay: DELAY, duration: reduce ? 0 : dur, times: ball.times, ease: "easeOut" }}
                style={{ position: "absolute", width: 10, height: 10, borderRadius: 5, transform: "translate(-50%,-50%)", background: "#fff", boxShadow: "0 0 7px 1px rgba(255,255,255,0.7)", zIndex: 3 }}
              />
            )}

            {play.mayaFollows ? (
              <motion.span
                className="pulse-glow"
                initial={{ left: maya.xs[0], top: maya.ys[0] }}
                animate={{ left: maya.xs, top: maya.ys }}
                transition={{ delay: DELAY, duration: reduce ? 0 : dur, times: maya.times, ease: "easeOut" }}
                style={{ position: "absolute", width: 22, height: 22, borderRadius: 11, marginLeft: -11, marginTop: -11, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 12, color: "var(--bg)", zIndex: 2 }}
              >
                9
              </motion.span>
            ) : (
              <motion.span
                className="pulse-glow"
                animate={{ scale: celebrate && cel.confetti ? [1, 1.7, 1.15] : 1 }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{ position: "absolute", left: pctX(play.maya[0]), top: pctY(play.maya[1]), width: 22, height: 22, borderRadius: 11, marginLeft: -11, marginTop: -11, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 12, color: "var(--bg)", zIndex: 2 }}
              >
                9
              </motion.span>
            )}

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

      {/* clip playback */}
      <div style={{ height: 2, margin: "10px 16px 0", borderRadius: 1, background: "var(--line)", overflow: "hidden", flexShrink: 0 }}>
        <motion.div
          key={`clip:${animKey}`}
          initial={{ width: reduce ? "100%" : "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: reduce ? 0 : dur, delay: DELAY, ease: "linear" }}
          style={{ height: "100%", background: "var(--amber)" }}
        />
      </div>

      {/* controls */}
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 16 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.4, ease: EASE } }}
        style={{ padding: "14px 16px calc(18px + env(safe-area-inset-bottom,8px))", flexShrink: 0, position: "relative", zIndex: 41 }}
      >
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setFollowMaya(true)} aria-pressed={followMaya} className={followMaya ? "btn btn-primary" : "btn btn-secondary"} style={{ flex: 1, fontSize: 14, padding: "11px" }}>
            <Icon name="target" size={16} color={followMaya ? "var(--bg)" : "var(--mist)"} />
            Following Maya
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setFollowMaya(false)} aria-pressed={!followMaya} className={!followMaya ? "btn btn-primary" : "btn btn-secondary"} style={{ flex: 1, fontSize: 14, padding: "11px" }}>
            All 22 players
          </motion.button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <motion.button whileTap={{ scale: 0.92 }} onClick={() => setRunId((r) => r + 1)} aria-label={ended ? "Watch again" : "Restart"} style={{ width: 44, height: 44, borderRadius: 22, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {ended ? (
              <Icon name="replays" size={18} color="var(--bg)" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--bg)">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            )}
          </motion.button>

          <div style={{ flex: 1, position: "relative" }}>
            <AnimatePresence>
              {scrubbing && scrubMoment && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.94 }}
                  transition={{ duration: 0.15 }}
                  style={{ position: "absolute", bottom: 34, left: `${pctOf(scrubMin!)}%`, transform: "translateX(-50%)", background: "var(--amber)", color: "var(--bg)", borderRadius: 10, padding: "6px 10px", whiteSpace: "nowrap", pointerEvents: "none", maxWidth: 210, overflow: "hidden", textOverflow: "ellipsis", zIndex: 5 }}
                >
                  <span style={{ fontWeight: 800, fontSize: 12 }}>{scrubMoment.min}' · </span>
                  <span style={{ fontWeight: 600, fontSize: 12 }}>{scrubMoment.title.split(" · ").slice(-1)[0]}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} style={{ padding: "12px 0", cursor: "pointer", touchAction: "none" }}>
              <div ref={trackRef} style={{ position: "relative", height: 4, borderRadius: 2, background: "var(--line)" }}>
                <motion.div animate={{ width: `${pctOf(headMin)}%` }} transition={glide} style={{ position: "absolute", left: 0, top: 0, bottom: 0, background: "var(--amber)", borderRadius: 2 }} />
                {match.moments.map((m) => {
                  const on = m.min === headMin;
                  return (
                    <motion.span
                      key={m.min}
                      animate={{ scale: on ? 1.5 : 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 26 }}
                      style={{ position: "absolute", left: `${pctOf(m.min)}%`, top: "50%", width: 7, height: 7, marginLeft: -3.5, marginTop: -3.5, borderRadius: 4, background: on ? "var(--ink)" : m.min < headMin ? "var(--amber)" : "var(--faint)", border: "1.5px solid var(--tunnel)" }}
                    />
                  );
                })}
                <motion.span
                  animate={{ left: `${pctOf(headMin)}%`, scale: scrubbing ? 1.3 : 1 }}
                  transition={glide}
                  style={{ position: "absolute", top: "50%", width: 13, height: 13, marginLeft: -6.5, marginTop: -6.5, borderRadius: 7, background: "var(--amber)", border: "2px solid var(--tunnel)", boxShadow: scrubbing ? "0 0 0 4px rgba(255,184,0,0.22)" : "none" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: -2 }}>
              <span className="mono" style={{ fontSize: 11, color: "var(--body)" }}>{headMin}:12</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--mist)" }}>{FULL}:00</span>
            </div>
          </div>
        </div>

        {/* up next — always a way onward, in the context you arrived from */}
        <div style={{ display: "flex", alignItems: "stretch", gap: 8, marginTop: 12 }}>
          <motion.button
            whileTap={{ scale: prev ? 0.94 : 1 }}
            onClick={() => prev && go(prev)}
            disabled={!prev}
            aria-label="Previous moment"
            style={{ width: 42, borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: prev ? 1 : 0.35 }}
          >
            <Icon name="chevronLeft" size={18} color="var(--body)" />
          </motion.button>

          {nextInfo ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => go(next!)}
              style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 10, borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface)", padding: "9px 12px", textAlign: "left" }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="eyebrow" style={{ fontSize: 8.5, color: "var(--amber)" }}>
                  Up next · {idx + 2} of {queue.length} · {queueLabel}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>
                  {nextInfo.moment.min}' · {nextInfo.moment.title.split(" · ").slice(-1)[0]}
                </div>
              </div>
              <Icon name="chevronRight" size={18} color="var(--amber)" />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => go(queue[0])}
              style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 10, borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface)", padding: "9px 12px", textAlign: "left" }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="eyebrow" style={{ fontSize: 8.5, color: "var(--mist)" }}>
                  That's all {queue.length} · {queueLabel}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>Start from the beginning</div>
              </div>
              <Icon name="replays" size={17} color="var(--mist)" />
            </motion.button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {celebrate && !reduce && end && (
          <motion.div
            key={"flash" + animKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, times: [0, 0.28, 1], ease: "easeOut" }}
            style={{ position: "absolute", inset: 0, zIndex: 48, pointerEvents: "none", background: `radial-gradient(65% 50% at ${end[0]}% ${(end[1] / 150) * 100}%, ${cel.accent}, transparent 62%)` }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {celebrate && !scrubbing && (
          <GoalCelebration
            key={animKey}
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
