import { motion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import Pitch from "../components/Pitch";
import CountUp from "../components/CountUp";
import { listContainer, tilePop } from "../motion";
import { circle, img, matches, nextMatch, seasonStats } from "../data";

export default function HomeBento() {
  const nav = useNav();
  const last = matches[0];

  return (
    <motion.div className="pad" style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 20 }} variants={listContainer} initial="hidden" animate="show">
      {/* Next match (primary) */}
      <motion.button
        variants={tilePop}
        whileTap={{ scale: 0.99 }}
        className="card"
        onClick={() => nav.goTab("replays")}
        style={{ position: "relative", overflow: "hidden", padding: 18, textAlign: "left" }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(80% 120% at 12% 0%, rgba(255,184,0,0.16), transparent 60%)" }} />
        <div style={{ position: "relative" }}>
          <div className="eyebrow" style={{ color: "var(--amber)" }}>NEXT MATCH · SAT {nextMatch.time}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div className="display" style={{ fontSize: 46, color: "var(--amber)", lineHeight: 0.9 }}>
                <CountUp to={nextMatch.days} duration={0.7} />
              </div>
              <div className="eyebrow" style={{ fontSize: 9 }}>Days</div>
            </div>
            <div style={{ width: 1, alignSelf: "stretch", background: "var(--line)" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="display" style={{ fontSize: 25, lineHeight: 1 }}>Ravens vs {nextMatch.opponent}</div>
              <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>Home · {nextMatch.venue}</div>
              <div className="muted" style={{ fontSize: 12.5 }}>{nextMatch.coming} of the family coming</div>
            </div>
          </div>
        </div>
      </motion.button>

      {/* Row B — last game + top speed */}
      <motion.div style={{ display: "flex", gap: 12 }}>
        <motion.button
          variants={tilePop}
          whileTap={{ scale: 0.97 }}
          onClick={() => nav.push({ screen: "matchHub", params: { id: last.id } })}
          style={{ flex: 1.4, position: "relative", overflow: "hidden", borderRadius: 16, height: 132, padding: 0 }}
        >
          <Pitch radius={0} style={{ position: "absolute", inset: 0 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(5,7,10,0.05),rgba(5,7,10,0.8))" }} />
          <div style={{ position: "absolute", top: 12, right: 12, width: 34, height: 34, borderRadius: 17, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="play" size={15} color="var(--bg)" />
          </div>
          <div style={{ position: "absolute", left: 14, bottom: 12, textAlign: "left" }}>
            <div className="eyebrow" style={{ color: "var(--our)" }}>LAST GAME</div>
            <div className="display" style={{ fontSize: 24, lineHeight: 1, marginTop: 2 }}>Ravens {last.score}</div>
            <div className="muted" style={{ fontSize: 12 }}>Maya ×{last.goals}</div>
          </div>
        </motion.button>

        <motion.button
          variants={tilePop}
          whileTap={{ scale: 0.97 }}
          onClick={() => nav.push({ screen: "cardDetail", params: { id: "M9" } })}
          style={{ flex: 1, height: 132, borderRadius: 16, padding: 14, textAlign: "left", background: "linear-gradient(150deg,var(--amber),var(--heat))", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
        >
          <div className="eyebrow" style={{ color: "rgba(12,14,16,0.75)" }}>TOP SPEED</div>
          <div>
            <div className="display" style={{ fontSize: 34, lineHeight: 1, color: "var(--bg)" }}>
              <CountUp to={seasonStats.topKmh} decimals={1} duration={1} delay={0.2} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(12,14,16,0.8)", marginTop: 2 }}>km/h · season best</div>
          </div>
        </motion.button>
      </motion.div>

      {/* Row C — cards + season film */}
      <motion.div style={{ display: "flex", gap: 12 }}>
        <motion.button
          variants={tilePop}
          whileTap={{ scale: 0.97 }}
          onClick={() => nav.goTab("cards")}
          className="card"
          style={{ flex: 1, height: 132, padding: 14, textAlign: "left", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="eyebrow">Cards</span>
            <span className="display" style={{ fontSize: 18, color: "var(--amber)" }}>{seasonStats.minted}<span style={{ color: "var(--faint)" }}>/{seasonStats.total}</span></span>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 27, height: 36, borderRadius: 6, background: "linear-gradient(160deg,#16224d,#0E1633)", border: i === 0 ? "1px solid var(--amber)" : "1px solid #23306a" }} />
            ))}
          </div>
        </motion.button>

        <motion.button
          variants={tilePop}
          whileTap={{ scale: 0.97 }}
          onClick={() => nav.goTab("replays")}
          style={{ flex: 1.4, height: 132, borderRadius: 16, padding: 0, position: "relative", overflow: "hidden", border: "1px solid var(--line)" }}
        >
          <img src={img(300, 200, 91)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(5,7,10,0.15),rgba(5,7,10,0.82))" }} />
          <div style={{ position: "absolute", top: 12, right: 12, width: 34, height: 34, borderRadius: 17, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="play" size={15} color="var(--bg)" />
          </div>
          <div style={{ position: "absolute", left: 14, bottom: 12, textAlign: "left" }}>
            <div className="eyebrow" style={{ color: "var(--amber)" }}>SEASON FILM</div>
            <div className="display" style={{ fontSize: 19, lineHeight: 1, marginTop: 2 }}>Maya's Spring · 3:12</div>
          </div>
        </motion.button>
      </motion.div>

      {/* Row D — circle + kit */}
      <motion.div style={{ display: "flex", gap: 12 }}>
        <motion.button
          variants={tilePop}
          whileTap={{ scale: 0.97 }}
          onClick={() => nav.goTab("family")}
          className="card"
          style={{ flex: 1, height: 62, padding: "0 14px", display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}
        >
          <div style={{ display: "flex" }}>
            {circle.slice(0, 3).map((m, i) => (
              <div key={m.name} style={{ width: 26, height: 26, borderRadius: 13, background: m.color, border: "2px solid var(--surface)", marginLeft: i ? -8 : 0 }} />
            ))}
          </div>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--body)" }}>{circle.length} in circle</span>
        </motion.button>

        <motion.div
          variants={tilePop}
          className="card"
          style={{ flex: 1, height: 62, padding: "0 14px", display: "flex", alignItems: "center", gap: 10 }}
        >
          <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#1B2A21,#2C4436)", border: "1px solid var(--our)" }} />
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--body)" }}>{nextMatch.kit} kit · {nextMatch.temp}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
