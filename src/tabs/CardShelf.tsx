import { motion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import { listContainer, tilePop, fadeUp } from "../motion";
import { cards, img, seasonStats, TIER_META, type MatchCard, type ShelfCard } from "../data";
import { TIER_STYLE } from "../cardStyles";

export default function CardShelf() {
  const nav = useNav();
  const pct = Math.round((seasonStats.minted / seasonStats.total) * 100);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span className="eyebrow">Her collection</span>
        <span className="mono" style={{ fontSize: 11.5, color: "var(--mist)" }}>
          {seasonStats.minted} of {seasonStats.total}
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: "var(--line)", overflow: "hidden", marginBottom: 16 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: "100%", background: "linear-gradient(90deg,var(--amber),var(--heat))" }}
        />
      </div>

      <motion.div
        style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gridAutoRows: "128px", gap: 12 }}
        variants={listContainer}
        initial="hidden"
        animate="show"
      >
        {cards.map((c) => (
          <Tile key={c.id} card={c} onOpen={() => nav.push({ screen: "cardDetail", params: { id: c.id } })} />
        ))}
      </motion.div>

      <motion.button
        variants={fadeUp}
        initial="hidden"
        animate="show"
        whileTap={{ scale: 0.97 }}
        className="btn btn-secondary"
        style={{ width: "100%", marginTop: 16 }}
      >
        <Icon name="cards" size={16} color="var(--mist)" />
        How cards are earned
      </motion.button>
    </div>
  );
}

function Tile({ card, onOpen }: { card: ShelfCard; onOpen: () => void }) {
  if (card.locked) {
    return (
      <motion.div
        variants={tilePop}
        style={{ borderRadius: 14, border: "1px dashed var(--line)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}
      >
        <span className="display" style={{ fontSize: 21, color: "var(--faint)" }}>{card.id}</span>
        <span className="eyebrow" style={{ fontSize: 8.5, color: "var(--faint)" }}>{card.label}</span>
      </motion.div>
    );
  }

  const c = card as MatchCard;
  const t = TIER_STYLE[c.tier];
  const meta = TIER_META[c.tier];
  const hero = c.span === "hero";
  const wide = c.span === "wide";

  const base = {
    position: "relative" as const,
    overflow: "hidden" as const,
    borderRadius: 14,
    background: t.bg,
    border: `1px solid ${t.border}`,
    boxShadow: t.glow,
    textAlign: "left" as const,
    gridColumn: hero || wide ? ("span 2" as const) : undefined,
    gridRow: hero ? ("span 2" as const) : undefined,
  };

  const rarity = (
    <span
      style={{
        fontFamily: "var(--font-ui)", fontSize: 8, fontWeight: 800, letterSpacing: "0.14em",
        textTransform: "uppercase", color: t.accent,
        border: `1px solid ${t.light ? "rgba(12,14,16,0.35)" : t.accent}`,
        borderRadius: 5, padding: "3px 6px", opacity: 0.95,
      }}
    >
      {meta.rarity}
    </span>
  );

  if (hero) {
    return (
      <motion.button variants={tilePop} whileTap={{ scale: 0.97 }} onClick={onOpen} style={{ ...base, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {t.foil && <span className="foil" />}
        <span className="display" style={{ position: "absolute", right: -8, bottom: -26, fontSize: 150, lineHeight: 1, color: t.accent, opacity: 0.13 }}>9</span>
        {c.photo && (
          <img src={img(220, 220, c.photo)} alt="" style={{ position: "absolute", right: -14, top: 14, width: 118, height: 118, objectFit: "cover", borderRadius: 12, opacity: 0.22, transform: "rotate(6deg)" }} />
        )}
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {rarity}
          <div style={{ textAlign: "right" }}>
            <div className="display" style={{ fontSize: 30, lineHeight: 1, color: t.accent }}>{c.rating.toFixed(1)}</div>
            <div className="eyebrow" style={{ fontSize: 8, color: t.sub }}>Rating</div>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div className="display" style={{ fontSize: 44, lineHeight: 0.9, color: t.ink }}>{c.id}</div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, fontWeight: 700, color: t.accent, marginTop: 6 }}>{c.headline}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 6 }}>
            <span className="mono" style={{ fontSize: 10.5, color: t.sub }}>{c.result} · {c.opponent}</span>
            <span className="mono" style={{ fontSize: 9.5, color: t.sub }}>{c.serial}</span>
          </div>
        </div>
      </motion.button>
    );
  }

  if (wide) {
    const big = c.stats.find((s) => s.label === "Distance")?.value ?? c.rating.toFixed(1);
    return (
      <motion.button variants={tilePop} whileTap={{ scale: 0.97 }} onClick={onOpen} style={{ ...base, padding: 13, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {rarity}
          <div className="display" style={{ fontSize: 24, lineHeight: 1, color: t.ink, marginTop: 7 }}>{c.id}</div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, color: t.accent, marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {c.headline}
          </div>
          <div className="mono" style={{ fontSize: 9.5, color: t.sub, marginTop: 3, whiteSpace: "nowrap" }}>{c.result} · {c.serial}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
          <Icon name="bolt" size={17} color={t.accent} />
          <div className="display" style={{ fontSize: 27, lineHeight: 1, color: t.ink, whiteSpace: "nowrap" }}>{big}</div>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button variants={tilePop} whileTap={{ scale: 0.95 }} onClick={onOpen} style={{ ...base, padding: 11, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      {t.foil && <span className="foil" />}
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span className="display" style={{ fontSize: 23, lineHeight: 1, color: t.ink }}>{c.id}</span>
        <span className="mono" style={{ fontSize: 10.5, color: t.accent }}>{c.rating.toFixed(1)}</span>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: t.accent, lineHeight: 1.25 }}>
          {c.headline}
        </div>
        <div className="mono" style={{ fontSize: 9.5, color: t.sub, marginTop: 3 }}>{c.result}</div>
      </div>
    </motion.button>
  );
}
