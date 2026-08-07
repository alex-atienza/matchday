import { motion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import Pitch from "../components/Pitch";
import DetailHeader from "../components/DetailHeader";
import { listContainer, listItem, fadeUp } from "../motion";
import { matches, replayDots, type Moment } from "../data";

const momentColor = (k: Moment["kind"]) =>
  k === "our" ? "var(--our)" : k === "their" ? "var(--their)" : "var(--amber)";

export default function MatchHub({ params }: { params: { id: string } }) {
  const nav = useNav();
  const match = matches.find((m) => m.id === params.id) ?? matches[0];

  return (
    <div className="screen">
      <DetailHeader title="GIRLS U15 · DIV 2 · RIVERSIDE PARK" action={<Icon name="arrowUpRight" size={20} color="var(--mist)" />} />
      <div className="scroll">
        <div className="pad" style={{ paddingBottom: 20 }}>
          {/* scoreline */}
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 8 }}>
              <Crest label="Ravens" initials="RV" ring="var(--amber)" />
              <div className="display" style={{ fontSize: 46, lineHeight: 1 }}>{match.score}</div>
              <Crest label={match.opponent} initials={match.opponent.slice(0, 2).toUpperCase()} ring="var(--away)" />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, alignItems: "center", marginBottom: 18 }}>
              <span className="chip active" style={{ padding: "5px 11px", fontSize: 10 }}>FULL-TIME</span>
              <span className="muted" style={{ fontSize: 12.5 }}>{match.date.split(", ")[0]} · Replay ready · {match.photos} photos</span>
            </div>
          </motion.div>

          {/* key moments chips */}
          <div className="eyebrow" style={{ marginBottom: 10 }}>Key moments</div>
          <motion.div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }} className="scroll" variants={listContainer} initial="hidden" animate="show">
            {match.moments.map((m, i) => (
              <motion.span key={i} variants={listItem} className={"chip" + (i === 0 ? " active" : "")} style={{ flexShrink: 0 }}>
                <Icon name={m.kind === "sprint" ? "bolt" : "target"} size={13} color={i === 0 ? "var(--bg)" : momentColor(m.kind)} />
                {m.min}' {m.kind === "sprint" ? "Sprint" : "Goal"}
              </motion.span>
            ))}
          </motion.div>

          {/* pitch */}
          <motion.button
            variants={fadeUp}
            initial="hidden"
            animate="show"
            whileTap={{ scale: 0.985 }}
            className="card"
            onClick={() => nav.push({ screen: "replay", params: { id: match.id } })}
            style={{ padding: 0, overflow: "hidden", width: "100%", display: "block", position: "relative" }}
          >
            <Pitch radius={0} style={{ height: 210 }}>
              <svg viewBox="0 0 150 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} stroke="#fff" strokeWidth="0.6" fill="none" opacity="0.5">
                <rect x="4" y="4" width="142" height="92" />
                <line x1="75" y1="4" x2="75" y2="96" />
                <circle cx="75" cy="50" r="14" />
                <rect x="4" y="28" width="20" height="44" />
                <rect x="126" y="28" width="20" height="44" />
              </svg>
              {replayDots.map((d, i) => (
                <span key={i} style={{ position: "absolute", left: `${d.x}%`, top: `${d.y}%`, width: 11, height: 11, borderRadius: 6, transform: "translate(-50%,-50%)", background: d.team === "their" ? "var(--away)" : "#e9efe9" }} />
              ))}
              <span className="pulse-glow" style={{ position: "absolute", left: "48%", top: "44%", width: 20, height: 20, borderRadius: 10, transform: "translate(-50%,-50%)", background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 11, color: "var(--bg)" }}>
                9
              </span>
            </Pitch>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>Maya · #9 on field</div>
                <div className="muted" style={{ fontSize: 12.5 }}>52 min played · top {match.topKmh} km/h</div>
              </div>
              <span className="btn btn-primary" style={{ fontSize: 14, padding: "11px 18px" }}>
                <Icon name="play" size={15} color="var(--bg)" />
                Watch replay
              </span>
            </div>
          </motion.button>

          {/* moment list */}
          <motion.div className="stack" style={{ gap: 10, marginTop: 16 }} variants={listContainer} initial="hidden" animate="show">
            {match.moments.map((m, i) => (
              <motion.div key={i} variants={listItem} className="card" style={{ display: "flex", alignItems: "center", gap: 12, padding: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: "color-mix(in srgb, " + momentColor(m.kind) + " 16%, transparent)", color: momentColor(m.kind), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 15 }}>
                  {m.min}'
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{m.title}</div>
                  <div className="muted" style={{ fontSize: 12.5 }}>{m.sub}</div>
                </div>
                <Icon name="chevronRight" size={18} color="var(--mist)" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
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
