import { motion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import CountUp from "../components/CountUp";
import DetailHeader from "../components/DetailHeader";
import { listContainer, listItem, tilePop, fadeUp } from "../motion";
import { matches } from "../data";
import { getPlayer, lineFor } from "../squad";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PlayerProfile({ params }: { params: { id: string; matchId?: string } }) {
  const nav = useNav();
  const p = getPlayer(params.id);
  const match = matches.find((m) => m.id === params.matchId) ?? matches[0];
  const line = lineFor(p, match);
  const theirMoments = match.moments.filter((m) => m.who === p.id);

  const matchStats = [
    { label: "Goals", value: String(line.goals) },
    { label: "Assists", value: String(line.assists) },
    { label: "Minutes", value: String(line.mins) },
    { label: "Top km/h", value: line.kmh.toFixed(1) },
    { label: "Distance", value: `${line.km} km` },
    { label: "Pass %", value: String(line.passPct) },
  ];

  const season = [
    { label: "Games", value: p.season.games, dec: 0 },
    { label: "Goals", value: p.season.goals, dec: 0 },
    { label: "Assists", value: p.season.assists, dec: 0 },
    { label: "Top km/h", value: p.season.topKmh, dec: 1 },
  ];

  return (
    <div className="screen">
      <DetailHeader title={`#${p.num} · ${p.name.toUpperCase()}`} action={<Icon name="share" size={19} color="var(--mist)" />} />
      <div className="scroll">
        <div className="pad" style={{ paddingBottom: 24 }}>
          {/* hero */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="card"
            style={{ position: "relative", overflow: "hidden", padding: 20, display: "flex", alignItems: "center", gap: 16 }}
          >
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(70% 90% at 88% 0%, ${p.color}33, transparent 70%)` }} />
            <div
              style={{
                width: 72, height: 72, borderRadius: 36, flexShrink: 0, position: "relative",
                background: p.color, color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 30,
                boxShadow: p.isMaya ? "0 0 22px -4px rgba(255,184,0,0.7)" : "none",
              }}
            >
              {p.num}
            </div>
            <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <div className="display" style={{ fontSize: 34, lineHeight: 1 }}>{p.name}</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 3 }}>{p.pos} · Ravens U15</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, background: "var(--elevated)", border: "1px solid var(--line)", borderRadius: 14, padding: "5px 10px" }}>
                <Icon name="bolt" size={12} color={p.color} />
                <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--body)" }}>{p.trait}</span>
              </div>
            </div>
          </motion.div>

          {/* this match */}
          <div className="eyebrow" style={{ margin: "22px 2px 12px" }}>
            This match · {match.home ? "vs" : "@"} {match.opponent}
          </div>
          <motion.div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }} variants={listContainer} initial="hidden" animate="show">
            {matchStats.map((s) => (
              <motion.div key={s.label} variants={tilePop} className="card" style={{ padding: "12px 8px", textAlign: "center" }}>
                <div className="display" style={{ fontSize: 22, color: "var(--ink)", lineHeight: 1 }}>{s.value}</div>
                <div className="eyebrow" style={{ fontSize: 9, marginTop: 3 }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* their moments */}
          {theirMoments.length > 0 && (
            <>
              <div className="eyebrow" style={{ margin: "22px 2px 12px" }}>
                {p.name}'s moments
              </div>
              <motion.div className="stack" style={{ gap: 10 }} variants={listContainer} initial="hidden" animate="show">
                {theirMoments.map((m) => (
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
                          queue: theirMoments.map((x) => ({ id: match.id, min: x.min })),
                          queueLabel: `${p.name}'s moments`,
                        },
                      })
                    }
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, width: "100%", textAlign: "left" }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: "color-mix(in srgb, var(--amber) 16%, transparent)", color: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 15 }}>
                      {m.min}'
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{m.title}</div>
                      <div className="muted" style={{ fontSize: 12.5 }}>{m.sub}</div>
                    </div>
                    <Icon name="play" size={15} color="var(--amber)" />
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}

          {/* season */}
          <div className="eyebrow" style={{ margin: "22px 2px 12px" }}>Spring 2026</div>
          <motion.div className="card" style={{ padding: 16 }} variants={fadeUp} initial="hidden" animate="show">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {season.map((s) => (
                <div key={s.label} style={{ textAlign: "center", flex: 1 }}>
                  <div className="display" style={{ fontSize: 24, color: "var(--ink)", lineHeight: 1 }}>
                    <CountUp to={s.value} decimals={s.dec} duration={0.9} delay={0.15} />
                  </div>
                  <div className="eyebrow" style={{ fontSize: 9, marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="divider" style={{ margin: "16px 0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="target" size={16} color="var(--mist)" />
              <span style={{ fontSize: 13, color: "var(--body)" }}>
                {p.season.km} km covered across {p.season.games} games
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
