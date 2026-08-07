import { motion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import CountUp from "../components/CountUp";
import { listContainer, tilePop, fadeUp } from "../motion";
import { cards, seasonStats, type Card } from "../data";

export default function Cards() {
  const nav = useNav();
  const stats = [
    { label: "Goals", value: seasonStats.goals, dec: 0, hot: false },
    { label: "Assists", value: seasonStats.assists, dec: 0, hot: false },
    { label: "Top km/h", value: seasonStats.topKmh, dec: 1, hot: true },
    { label: "Badges", value: seasonStats.badges, dec: 0, hot: false },
  ];

  return (
    <div className="screen">
      <div className="app-header">
        <div>
          <div className="kicker">Spring 2026</div>
          <h1>Season Shelf</h1>
        </div>
        <div className="display" style={{ fontSize: 20, color: "var(--amber)" }}>
          <CountUp to={seasonStats.minted} duration={0.8} /> cards
        </div>
      </div>

      <div className="scroll">
        <div className="pad" style={{ paddingBottom: 24 }}>
          {/* stat chips */}
          <motion.div style={{ display: "flex", gap: 10 }} variants={listContainer} initial="hidden" animate="show">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={tilePop}
                className="card"
                style={{ flex: 1, textAlign: "center", padding: "10px 4px", background: s.hot ? "var(--amber)" : "var(--surface)", borderColor: s.hot ? "var(--amber)" : "var(--line)" }}
              >
                <div className="display" style={{ fontSize: 22, color: s.hot ? "var(--bg)" : "var(--ink)", lineHeight: 1 }}>
                  <CountUp to={s.value} decimals={s.dec} duration={1} delay={0.15} />
                </div>
                <div className="eyebrow" style={{ fontSize: 9, marginTop: 2, color: s.hot ? "rgba(12,14,16,0.7)" : "var(--mist)" }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* grid */}
          <motion.div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}
            variants={listContainer}
            initial="hidden"
            animate="show"
          >
            {cards.map((c) => (
              <CardTile key={c.id} card={c} onOpen={() => nav.push({ screen: "cardDetail", params: { id: c.id } })} />
            ))}
          </motion.div>

          <motion.button
            variants={fadeUp}
            initial="hidden"
            animate="show"
            whileTap={{ scale: 0.97 }}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 20 }}
          >
            <Icon name="cards" size={17} color="var(--bg)" />
            Print the season book
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function CardTile({ card, onOpen }: { card: Card; onOpen: () => void }) {
  if (card.locked) {
    return (
      <motion.div
        variants={tilePop}
        style={{ aspectRatio: "0.82", borderRadius: 14, border: "1px dashed var(--line)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}
      >
        <span className="display" style={{ fontSize: 22, color: "var(--faint)" }}>{card.id}</span>
        <span className="eyebrow" style={{ fontSize: 9, color: "var(--faint)" }}>{card.label}</span>
      </motion.div>
    );
  }
  const featured = card.id === "M9";
  return (
    <motion.button
      variants={tilePop}
      whileTap={{ scale: 0.95 }}
      onClick={onOpen}
      style={{
        aspectRatio: "0.82",
        borderRadius: 14,
        padding: "12px 10px",
        textAlign: "left",
        background: "linear-gradient(160deg,#1a2856,#0E1633)",
        border: featured ? "1px solid var(--amber)" : "1px solid #23306a",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: featured ? "0 0 18px -4px rgba(255,184,0,0.4)" : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span className="display" style={{ fontSize: 24, color: featured ? "var(--amber)" : "var(--ink)", lineHeight: 1 }}>{card.id}</span>
        <span className="mono" style={{ fontSize: 11, color: "var(--card-blue)" }}>{card.rating?.toFixed(1)}</span>
      </div>
      <div>
        <div className="eyebrow" style={{ fontSize: 9, color: "var(--amber)" }}>{card.label}</div>
        <div className="mono" style={{ fontSize: 10, color: "var(--mist)", marginTop: 3 }}>{card.result}</div>
      </div>
    </motion.button>
  );
}
