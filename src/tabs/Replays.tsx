import { motion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import Pitch from "../components/Pitch";
import AppHeader from "../components/AppHeader";
import { listContainer, listItem, fadeUp } from "../motion";
import { matches, type Match } from "../data";

const resultColor = (r: Match["result"]) =>
  r === "W" ? "var(--our)" : r === "D" ? "var(--amber)" : "var(--their)";

export default function Replays() {
  const nav = useNav();
  const [latest, ...rest] = matches;

  return (
    <div className="screen">
      <AppHeader kicker="Spring 2026 · 7 played" title="Replays" />
      <div className="scroll">
        <div className="pad" style={{ paddingBottom: 20 }}>
          {/* featured latest */}
          <motion.button
            variants={fadeUp}
            initial="hidden"
            animate="show"
            whileTap={{ scale: 0.98 }}
            className="card"
            onClick={() => nav.push({ screen: "matchHub", params: { id: latest.id } })}
            style={{ display: "block", width: "100%", overflow: "hidden", padding: 0, textAlign: "left" }}
          >
            <Pitch radius={0} style={{ height: 168 }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(5,7,10,0) 40%,rgba(5,7,10,0.85))" }} />
              <div style={{ position: "absolute", left: 14, top: 12, display: "flex", gap: 8, alignItems: "center" }}>
                <span className="chip active" style={{ padding: "5px 10px", fontSize: 10, letterSpacing: "0.08em" }}>LATEST</span>
                <span className="eyebrow" style={{ color: "var(--body)" }}>{latest.date}</span>
              </div>
              <div style={{ position: "absolute", right: 14, bottom: 12, top: 12, display: "flex", alignItems: "center" }}>
                <div className="play-pulse" style={{ width: 46, height: 46, borderRadius: 23, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px -4px rgba(255,184,0,0.6)" }}>
                  <Icon name="play" size={20} color="var(--bg)" />
                </div>
              </div>
              <div style={{ position: "absolute", left: 16, bottom: 12 }}>
                <div className="eyebrow" style={{ color: "var(--our)" }}>FULL-TIME · WIN</div>
                <div className="display" style={{ fontSize: 30, lineHeight: 1, marginTop: 2 }}>
                  Ravens {latest.score} {latest.opponent.split(" ")[0]}
                </div>
                <div className="muted" style={{ fontSize: 12.5, marginTop: 3 }}>
                  Maya ×{latest.goals} · {latest.moments.length} key moments
                </div>
              </div>
            </Pitch>
          </motion.button>

          <div className="eyebrow" style={{ margin: "20px 2px 12px" }}>Earlier this season</div>
          <motion.div className="stack" style={{ gap: 10 }} variants={listContainer} initial="hidden" animate="show">
            {rest.map((m) => (
              <motion.button
                key={m.id}
                variants={listItem}
                whileTap={{ scale: 0.98 }}
                className="card"
                onClick={() => nav.push({ screen: "matchHub", params: { id: m.id } })}
                style={{ display: "flex", alignItems: "center", gap: 13, padding: 12, width: "100%", textAlign: "left" }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "color-mix(in srgb, " + resultColor(m.result) + " 18%, transparent)", border: "1px solid " + resultColor(m.result), color: resultColor(m.result), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 16 }}>
                  {m.result}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{m.home ? "vs" : "@"} {m.opponent}</div>
                  <div className="muted" style={{ fontSize: 12.5 }}>{m.date} · {m.goals}G {m.assists}A · {m.topKmh} km/h</div>
                </div>
                <div className="display" style={{ fontSize: 22, color: "var(--ink)", flexShrink: 0 }}>{m.score}</div>
                <Icon name="chevronRight" size={18} color="var(--mist)" />
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
