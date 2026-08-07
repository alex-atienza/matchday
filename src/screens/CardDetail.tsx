import { motion } from "framer-motion";
import Icon from "../components/Icon";
import CountUp from "../components/CountUp";
import DetailHeader from "../components/DetailHeader";
import { listContainer, listItem, tilePop, fadeUp } from "../motion";
import { cardDetail } from "../data";

const EASE = [0.22, 1, 0.36, 1] as const;

function splitNum(v: string): { n: number | null; dec: number; suf: string } {
  const m = v.match(/^([\d.]+)(.*)$/);
  if (!m) return { n: null, dec: 0, suf: v };
  return { n: parseFloat(m[1]), dec: (m[1].split(".")[1] || "").length, suf: m[2] };
}

export default function CardDetail(_: { params?: { id: string } }) {
  const c = cardDetail;
  return (
    <div className="screen">
      <DetailHeader title="MATCHDAY CARD" action={<Icon name="share" size={19} color="var(--mist)" />} />
      <div className="scroll">
        <div className="pad" style={{ paddingBottom: 24 }}>
          {/* card hero */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            style={{ borderRadius: 20, padding: 20, background: "linear-gradient(160deg,#1c2c60 0%,#0E1633 100%)", border: "1px solid var(--amber)", boxShadow: "0 0 30px -8px rgba(255,184,0,0.35)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="eyebrow" style={{ color: "var(--card-blue)" }}>
                  {c.date} · {c.result}
                </div>
                <div className="display" style={{ fontSize: 40, lineHeight: 1, marginTop: 4 }}>
                  Maya <span style={{ color: "var(--amber)" }}>#9</span>
                </div>
                <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>vs {c.opponent}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="display" style={{ fontSize: 44, color: "var(--amber)", lineHeight: 1 }}>
                  <CountUp to={c.rating} decimals={1} duration={1.1} delay={0.2} />
                </div>
                <div className="eyebrow" style={{ fontSize: 9, color: "var(--card-blue)" }}>Rating</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <span className="chip" style={{ background: "rgba(255,184,0,0.14)", borderColor: "rgba(255,184,0,0.5)", color: "var(--amber)", fontSize: 11 }}>PB · BRACE</span>
              <span className="chip" style={{ background: "rgba(255,255,255,0.06)", borderColor: "transparent", color: "var(--card-blue)", fontSize: 11 }}>Card M9 · 9 of 12</span>
            </div>
          </motion.div>

          {/* stat grid */}
          <div className="eyebrow" style={{ margin: "22px 2px 12px" }}>This match</div>
          <motion.div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }} variants={listContainer} initial="hidden" animate="show">
            {c.stats.map((s) => {
              const p = splitNum(s.value);
              return (
                <motion.div key={s.label} variants={tilePop} className="card" style={{ padding: "12px 8px", textAlign: "center" }}>
                  <div className="display" style={{ fontSize: 24, color: "var(--ink)", lineHeight: 1 }}>
                    {p.n === null ? s.value : <CountUp to={p.n} decimals={p.dec} duration={1} delay={0.2} suffix={p.suf} />}
                  </div>
                  <div className="eyebrow" style={{ fontSize: 9, marginTop: 3 }}>{s.label}</div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* speed & zones */}
          <div className="eyebrow" style={{ margin: "22px 2px 12px" }}>Speed &amp; zones</div>
          <motion.div className="card" style={{ padding: 16 }} variants={fadeUp} initial="hidden" animate="show">
            <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", marginBottom: 14, background: "var(--elevated)" }}>
              {c.zones.map((z, i) => (
                <motion.div
                  key={z.label}
                  initial={{ width: 0 }}
                  animate={{ width: `${z.pct}%` }}
                  transition={{ duration: 0.7, delay: 0.25 + i * 0.1, ease: EASE }}
                  style={{ background: z.color }}
                />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {c.zones.map((z) => (
                <div key={z.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: z.color }} />
                  <span style={{ fontSize: 11.5, color: "var(--body)" }}>
                    {z.label} <span className="muted">{z.pct}%</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="divider" style={{ margin: "16px 0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="bolt" size={18} color="var(--amber)" />
              <span style={{ fontSize: 13.5, color: "var(--body)" }}>
                Top speed <b style={{ color: "var(--ink)" }}>23.4 km/h</b> — season best
              </span>
            </div>
          </motion.div>

          {/* goals */}
          <div className="eyebrow" style={{ margin: "22px 2px 12px" }}>How the goals happened</div>
          <motion.div className="stack" style={{ gap: 10 }} variants={listContainer} initial="hidden" animate="show">
            {c.goals.map((g) => (
              <motion.div key={g.min} variants={listItem} className="card" style={{ display: "flex", gap: 12, padding: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "color-mix(in srgb, var(--our) 16%, transparent)", color: "var(--our)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 15 }}>
                  {g.min}'
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--ink)" }}>{g.title}</div>
                  <div className="muted" style={{ fontSize: 12.5, marginTop: 2, lineHeight: 1.45 }}>{g.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
