import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import Pitch from "../components/Pitch";
import DetailHeader from "../components/DetailHeader";
import { listContainer, listItem, fadeUp } from "../motion";
import { matches, type Match, type Moment } from "../data";
import { getPlay } from "../plays";
import { squad, lineFor } from "../squad";

const EASE = [0.22, 1, 0.36, 1] as const;

const MOMENT: Record<Moment["kind"], { color: string; icon: string; label: string }> = {
  our: { color: "var(--our)", icon: "target", label: "Goal" },
  their: { color: "var(--their)", icon: "target", label: "Goal" },
  sprint: { color: "var(--amber)", icon: "bolt", label: "Sprint" },
  save: { color: "var(--away)", icon: "check", label: "Save" },
};

type Tab = "highlights" | "squad" | "stats";
type Filter = "all" | "our" | "sprint" | "save";

export default function MatchHub({ params }: { params: { id: string } }) {
  const nav = useNav();
  const match = matches.find((m) => m.id === params.id) ?? matches[0];
  const [tab, setTab] = useState<Tab>("highlights");

  const marquee = match.moments.find((m) => m.kind === "our") ?? match.moments[0];
  const preview = getPlay(marquee?.play, marquee?.kind ?? "our");

  return (
    <div className="screen">
      <DetailHeader title="GIRLS U15 · DIV 2" action={<Icon name="arrowUpRight" size={20} color="var(--mist)" />} />
      <div className="scroll">
        <div className="pad" style={{ paddingBottom: 22 }}>
          {/* scoreline */}
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 8 }}>
              <Crest label="Ravens" initials="RV" ring="var(--amber)" />
              <div className="display" style={{ fontSize: 46, lineHeight: 1 }}>{match.score}</div>
              <Crest label={match.opponent} initials={match.opponent.slice(0, 2).toUpperCase()} ring="var(--away)" />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, alignItems: "center", marginBottom: 16 }}>
              <span className="chip active" style={{ padding: "5px 11px", fontSize: 10 }}>FULL-TIME</span>
              <span className="muted" style={{ fontSize: 12.5 }}>
                {match.date} · {match.home ? "Riverside Park" : "Away"}
              </span>
            </div>
          </motion.div>

          {/* pitch preview → full replay */}
          <motion.button
            variants={fadeUp}
            initial="hidden"
            animate="show"
            whileTap={{ scale: 0.985 }}
            className="card"
            onClick={() => nav.push({ screen: "replay", params: { id: match.id, min: marquee?.min } })}
            style={{ padding: 0, overflow: "hidden", width: "100%", display: "block", position: "relative" }}
          >
            <Pitch radius={0} style={{ height: 190 }}>
              <svg viewBox="0 0 150 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} stroke="#fff" strokeWidth="0.6" fill="none" opacity="0.45">
                <rect x="4" y="4" width="142" height="92" />
                <line x1="75" y1="4" x2="75" y2="96" />
                <circle cx="75" cy="50" r="14" />
                <rect x="4" y="28" width="20" height="44" />
                <rect x="126" y="28" width="20" height="44" />
              </svg>
              {preview.mates.map((p, i) => (
                <span key={"m" + i} style={{ position: "absolute", left: `${(p[1] / 150) * 100}%`, top: `${p[0]}%`, width: 11, height: 11, borderRadius: 6, transform: "translate(-50%,-50%)", background: "#e9efe9" }} />
              ))}
              {preview.foes.map((p, i) => (
                <span key={"f" + i} style={{ position: "absolute", left: `${(p[1] / 150) * 100}%`, top: `${p[0]}%`, width: 11, height: 11, borderRadius: 6, transform: "translate(-50%,-50%)", background: "var(--away)" }} />
              ))}
              <span className="pulse-glow" style={{ position: "absolute", left: `${(preview.maya[1] / 150) * 100}%`, top: `${preview.maya[0]}%`, width: 20, height: 20, borderRadius: 10, transform: "translate(-50%,-50%)", background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 11, color: "var(--on-accent)" }}>9</span>
            </Pitch>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", gap: 12 }}>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>Maya · #9 on field</div>
                <div className="muted" style={{ fontSize: 12.5 }}>
                  {match.moments.length} moments · top {match.topKmh} km/h
                </div>
              </div>
              <span className="btn btn-primary" style={{ fontSize: 14, padding: "11px 18px" }}>
                <Icon name="play" size={15} color="var(--on-accent)" />
                Watch
              </span>
            </div>
          </motion.button>

          {/* section switch */}
          <div style={{ display: "flex", gap: 4, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, padding: 4, marginTop: 18 }}>
            {([["highlights", "Highlights"], ["squad", "Squad"], ["stats", "Stats"]] as const).map(([k, label]) => {
              const on = tab === k;
              return (
                <motion.button key={k} onClick={() => setTab(k)} whileTap={{ scale: 0.97 }} aria-pressed={on} style={{ position: "relative", flex: 1, padding: "9px 0", borderRadius: 9 }}>
                  {on && <motion.span layoutId="hub-tab" transition={{ type: "spring", stiffness: 520, damping: 36 }} style={{ position: "absolute", inset: 0, background: "var(--amber)", borderRadius: 9 }} />}
                  <span style={{ position: "relative", fontSize: 13, fontWeight: 700, color: on ? "var(--bg)" : "var(--mist)" }}>{label}</span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: EASE }}
              style={{ marginTop: 16 }}
            >
              {tab === "highlights" && <Highlights match={match} />}
              {tab === "squad" && <Squad match={match} />}
              {tab === "stats" && <Stats match={match} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ---------------- highlights ---------------- */
function Highlights({ match }: { match: Match }) {
  const nav = useNav();
  const [filter, setFilter] = useState<Filter>("all");

  const counts = {
    all: match.moments.length,
    our: match.moments.filter((m) => m.kind === "our").length,
    sprint: match.moments.filter((m) => m.kind === "sprint").length,
    save: match.moments.filter((m) => m.kind === "save").length,
  };
  const shown = filter === "all" ? match.moments : match.moments.filter((m) => m.kind === filter);

  const filters: [Filter, string][] = [
    ["all", "All"],
    ["our", "Goals"],
    ["sprint", "Sprints"],
    ["save", "Saves"],
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 12 }} className="scroll">
        {filters.map(([k, label]) =>
          counts[k] === 0 ? null : (
            <motion.button key={k} whileTap={{ scale: 0.95 }} onClick={() => setFilter(k)} className={"chip" + (filter === k ? " active" : "")} style={{ flexShrink: 0 }}>
              {label} <span style={{ opacity: 0.65 }}>{counts[k]}</span>
            </motion.button>
          ),
        )}
      </div>

      <motion.div className="stack" style={{ gap: 10 }} variants={listContainer} initial="hidden" animate="show">
        {shown.map((m) => (
          <motion.button
            key={m.min}
            variants={listItem}
            whileTap={{ scale: 0.98 }}
            className="card"
            onClick={() =>
              nav.push({
                screen: "replay",
                params: {
                  id: match.id,
                  min: m.min,
                  // stepping through follows whatever you've filtered to
                  queue: shown.map((x) => ({ id: match.id, min: x.min })),
                  queueLabel: `${match.home ? "vs" : "@"} ${match.opponent}`,
                },
              })
            }
            style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, width: "100%", textAlign: "left" }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `color-mix(in srgb, ${MOMENT[m.kind].color} 16%, transparent)`, color: MOMENT[m.kind].color, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={MOMENT[m.kind].icon} size={13} color={MOMENT[m.kind].color} />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 12, marginTop: 1 }}>{m.min}'</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{m.title}</div>
              <div className="muted" style={{ fontSize: 12.5 }}>{m.sub}</div>
            </div>
            <Icon name="play" size={15} color="var(--amber)" />
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

/* ---------------- squad ---------------- */
function Squad({ match }: { match: Match }) {
  const nav = useNav();
  return (
    <motion.div className="card" style={{ overflow: "hidden" }} variants={listContainer} initial="hidden" animate="show">
      {squad.map((p, i) => {
        const line = lineFor(p, match);
        return (
          <motion.button
            key={p.id}
            variants={listItem}
            whileTap={{ scale: 0.99 }}
            onClick={() => nav.push({ screen: "player", params: { id: p.id, matchId: match.id } })}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", width: "100%", textAlign: "left", borderTop: i ? "1px solid var(--line)" : "none" }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 16, background: p.color, color: "var(--on-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 14 }}>
              {p.num}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: p.isMaya ? "var(--amber)" : "var(--ink)" }}>{p.name}</div>
              <div className="muted" style={{ fontSize: 12 }}>{p.pos} · {line.mins}'</div>
            </div>
            {/* Goals and assists only. A bare speed number down the right-hand
                edge of a list of children reads as a score for each kid, which
                is not what this product is for. */}
            <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
              {line.goals > 0 && <Pip label={`${line.goals}G`} color="var(--our)" />}
              {line.assists > 0 && <Pip label={`${line.assists}A`} color="var(--card-blue)" />}
            </div>
            <Icon name="chevronRight" size={16} color="var(--mist)" />
          </motion.button>
        );
      })}
    </motion.div>
  );
}

function Pip({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 800, color, background: `color-mix(in srgb, ${color} 18%, transparent)`, borderRadius: 5, padding: "3px 5px" }}>
      {label}
    </span>
  );
}

/* ---------------- stats ---------------- */
function Stats({ match }: { match: Match }) {
  const t = match.teamStats;
  const rows: [string, number, number, boolean][] = [
    ["Possession", t.poss[0], t.poss[1], true],
    ["Shots", t.shots[0], t.shots[1], false],
    ["On target", t.onTarget[0], t.onTarget[1], false],
    ["Corners", t.corners[0], t.corners[1], false],
    ["Fouls", t.fouls[0], t.fouls[1], false],
  ];

  const lines = squad.map((p) => ({ p, line: lineFor(p, match) }));
  const fastest = lines.reduce((a, b) => (b.line.kmh > a.line.kmh ? b : a));
  const furthest = lines.reduce((a, b) => (b.line.km > a.line.km ? b : a));
  const topScorer = lines.filter((x) => x.line.goals > 0).sort((a, b) => b.line.goals - a.line.goals)[0];

  return (
    <div>
      <motion.div className="card" style={{ padding: 16 }} variants={fadeUp} initial="hidden" animate="show">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <span className="eyebrow" style={{ color: "var(--amber)" }}>Ravens</span>
          <span className="eyebrow">{match.opponent}</span>
        </div>
        <div className="stack" style={{ gap: 14 }}>
          {rows.map(([label, a, b, pct], i) => (
            <StatRow key={label} label={label} a={a} b={b} pct={pct} delay={i * 0.08} />
          ))}
        </div>
      </motion.div>

      <div className="eyebrow" style={{ margin: "22px 2px 12px" }}>Standouts</div>
      <motion.div className="stack" style={{ gap: 10 }} variants={listContainer} initial="hidden" animate="show">
        {topScorer && <Standout icon="target" color="var(--our)" title={`${topScorer.p.name} · ${topScorer.line.goals} goal${topScorer.line.goals > 1 ? "s" : ""}`} sub="Top scorer this match" />}
        <Standout icon="bolt" color="var(--amber)" title={`${fastest.p.name} · ${fastest.line.kmh.toFixed(1)} km/h`} sub="Fastest on the pitch" />
        <Standout icon="target" color="var(--card-blue)" title={`${furthest.p.name} · ${furthest.line.km} km`} sub="Most ground covered" />
      </motion.div>
    </div>
  );
}

function StatRow({ label, a, b, pct, delay }: { label: string; a: number; b: number; pct: boolean; delay: number }) {
  const total = a + b || 1;
  const aw = (a / total) * 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
        <span className="display" style={{ fontSize: 17, color: "var(--ink)" }}>{a}{pct ? "%" : ""}</span>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--mist)" }}>{label}</span>
        <span className="display" style={{ fontSize: 17, color: "var(--body)" }}>{b}{pct ? "%" : ""}</span>
      </div>
      <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", background: "var(--elevated)" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${aw}%` }} transition={{ duration: 0.7, delay: 0.15 + delay, ease: EASE }} style={{ background: "var(--amber)" }} />
        <motion.div initial={{ width: 0 }} animate={{ width: `${100 - aw}%` }} transition={{ duration: 0.7, delay: 0.15 + delay, ease: EASE }} style={{ background: "var(--away)" }} />
      </div>
    </div>
  );
}

function Standout({ icon, color, title, sub }: { icon: string; color: string; title: string; sub: string }) {
  return (
    <motion.div variants={listItem} className="card" style={{ display: "flex", alignItems: "center", gap: 12, padding: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `color-mix(in srgb, ${color} 16%, transparent)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={icon} size={17} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{title}</div>
        <div className="muted" style={{ fontSize: 12.5 }}>{sub}</div>
      </div>
    </motion.div>
  );
}

function Crest({ label, initials, ring }: { label: string; initials: string; ring: string }) {
  return (
    <div style={{ textAlign: "center", width: 76 }}>
      <div style={{ width: 52, height: 52, borderRadius: 26, border: "2px solid " + ring, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 17, color: "var(--ink)" }}>
        {initials}
      </div>
      <div style={{ fontWeight: 600, fontSize: 12, color: "var(--body)" }}>{label.split(" ")[0]}</div>
    </div>
  );
}
