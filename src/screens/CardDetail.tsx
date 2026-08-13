import { motion } from "framer-motion";
import Icon from "../components/Icon";
import CountUp from "../components/CountUp";
import DetailHeader from "../components/DetailHeader";
import { listContainer, listItem, tilePop, fadeUp } from "../motion";
import { getCard, img, TIER_META } from "../data";
import { tierStyle } from "../cardStyles";
import { useTheme } from "../theme";

const EASE = [0.22, 1, 0.36, 1] as const;

function splitNum(v: string): { n: number | null; dec: number; suf: string } {
  const m = v.match(/^([\d.]+)(.*)$/);
  if (!m) return { n: null, dec: 0, suf: v };
  return { n: parseFloat(m[1]), dec: (m[1].split(".")[1] || "").length, suf: m[2] };
}

export default function CardDetail({ params }: { params?: { id?: string } }) {
  const c = getCard(params?.id ?? "M9");
  const draft = useTheme().theme === "draft";
  const t = tierStyle(c.tier, draft);
  const meta = TIER_META[c.tier];

  return (
    <div className="screen">
      <DetailHeader title={`CARD ${c.id}`} action={<Icon name="share" size={19} color="var(--mist)" />} />
      <div className="scroll">
        <div className="pad" style={{ paddingBottom: 24 }}>
          {/* the card itself */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            style={{ position: "relative", overflow: "hidden", borderRadius: 20, padding: 20, background: t.bg, border: `1px solid ${t.border}`, boxShadow: t.glow }}
          >
            {t.foil && <span className="foil" />}
            {!draft && (
              <span className="display" style={{ position: "absolute", right: -10, bottom: -34, fontSize: 190, lineHeight: 1, color: t.accent, opacity: 0.12 }}>9</span>
            )}
            {!draft && c.photo && (
              <img src={img(240, 240, c.photo)} alt="" style={{ position: "absolute", right: -18, top: 18, width: 130, height: 130, objectFit: "cover", borderRadius: 14, opacity: 0.2, transform: "rotate(6deg)" }} />
            )}

            <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: t.accent, border: `1px solid ${t.light ? "rgba(12,14,16,0.35)" : t.accent}`, borderRadius: 6, padding: "4px 8px" }}>
                  {meta.rarity}
                </span>
                <div className="display" style={{ fontSize: 44, lineHeight: 0.95, marginTop: 12, color: t.ink }}>
                  Maya <span style={{ color: t.accent }}>#9</span>
                </div>
                <div style={{ fontSize: 13, color: t.sub, marginTop: 3 }}>{c.date} · vs {c.opponent}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="display" style={{ fontSize: 44, color: t.accent, lineHeight: 1 }}>
                  <CountUp to={c.rating} decimals={1} duration={1.1} delay={0.2} />
                </div>
                <div className="eyebrow" style={{ fontSize: 9, color: t.sub }}>Rating</div>
              </div>
            </div>

            <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 18 }}>
              <div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 13.5, fontWeight: 800, color: t.ink }}>{c.headline}</div>
                <div className="mono" style={{ fontSize: 11, color: t.sub, marginTop: 3 }}>{c.result}</div>
              </div>
              <span className="mono" style={{ fontSize: 10.5, color: t.sub }}>{c.serial}</span>
            </div>
          </motion.div>

          {/* why it's special */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 12, padding: "0 2px" }}>
            <Icon name="target" size={14} color={t.foil ? "var(--amber)" : "var(--mist)"} />
            <span className="muted" style={{ fontSize: 12.5 }}>
              <b style={{ color: "var(--body)" }}>{meta.rarity}</b> · {meta.note}
            </span>
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
                Top speed <b style={{ color: "var(--ink)" }}>{c.stats.find((s) => s.label === "Top km/h")?.value} km/h</b>
              </span>
            </div>
          </motion.div>

          {/* moments */}
          <div className="eyebrow" style={{ margin: "22px 2px 12px" }}>
            {c.moments.length > 1 ? "The moments" : "The moment"}
          </div>
          <motion.div className="stack" style={{ gap: 10 }} variants={listContainer} initial="hidden" animate="show">
            {c.moments.map((g) => (
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
