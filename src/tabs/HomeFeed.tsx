import { motion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import Pitch from "../components/Pitch";
import GoalTrail from "../components/GoalTrail";
import CountUp from "../components/CountUp";
import { listContainer, listItem } from "../motion";
import { agoLabel, homeFeed, img, nextMatch, type FeedItem } from "../data";
import { useTheme } from "../theme";

export default function HomeFeed() {
  const nav = useNav();

  // newest first, then split into day groups so the feed reads as a timeline
  const sorted = [...homeFeed].sort((a, b) => a.hours - b.hours);
  const groups: { label: string; items: FeedItem[] }[] = [
    { label: "Today", items: sorted.filter((i) => i.hours < 24) },
    { label: "Earlier this week", items: sorted.filter((i) => i.hours >= 24) },
  ].filter((g) => g.items.length > 0);

  return (
    <motion.div className="pad stack" style={{ gap: 12, paddingTop: 6, paddingBottom: 20 }} variants={listContainer} initial="hidden" animate="show">
      {/* pinned next match */}
      <motion.button
        variants={listItem}
        whileTap={{ scale: 0.98 }}
        className="card"
        onClick={() => nav.goTab("schedule")}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", textAlign: "left" }}
      >
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div className="display" style={{ fontSize: 26, color: "var(--amber)", lineHeight: 1 }}>
            <CountUp to={nextMatch.days} duration={0.7} />
          </div>
          <div className="eyebrow" style={{ fontSize: 10 }}>Days</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>
            vs {nextMatch.opponent} · Saturday {nextMatch.time}
          </div>
          <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>
            {nextMatch.coming} of the family coming
          </div>
        </div>
        <span className="btn btn-primary" style={{ fontSize: 13, padding: "9px 15px" }}>Get ready</span>
      </motion.button>

      {groups.map((g) => (
        <div key={g.label} className="stack" style={{ gap: 12 }}>
          <motion.div variants={listItem} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
            <span className="eyebrow">{g.label}</span>
            <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
          </motion.div>
          {g.items.map((item, i) => (
            <motion.div variants={listItem} key={`${g.label}-${i}`}>
              <FeedRow item={item} />
            </motion.div>
          ))}
        </div>
      ))}
    </motion.div>
  );
}

function FeedRow({ item }: { item: FeedItem }) {
  const nav = useNav();
  const draft = useTheme().theme === "draft";
  const ago = agoLabel(item.hours);

  /* ---------- the marquee: a goal you can replay ---------- */
  if (item.type === "goal") {
    return (
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px 10px" }}>
          <div className="avatar" style={{ width: 34, height: 34, fontSize: 15 }}>9</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{item.title}</div>
            <div className="muted" style={{ fontSize: 12.5 }}>{item.sub} · {ago}</div>
          </div>
          <span className="chip" style={{ padding: "5px 10px", fontSize: 10, letterSpacing: "0.08em" }}>REPLAY</span>
        </div>
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => nav.push({ screen: "replay", params: { id: "m9", min: item.min } })} style={{ display: "block", width: "100%", padding: "0 14px" }}>
          <Pitch radius={12} style={{ height: 150 }}>
            <GoalTrail w={326} h={150} a={[40, 120]} b={[165, 80]} c={[290, 60]} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="play-pulse" style={{ width: 52, height: 52, borderRadius: 26, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px -4px rgba(255,184,0,0.6)" }}>
                <Icon name="play" size={22} color="var(--on-accent)" />
              </div>
            </div>
          </Pitch>
        </motion.button>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 14px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="heart" size={16} color="var(--their)" />
            <span className="muted" style={{ fontSize: 12.5 }}>{item.likers}</span>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="message" size={16} color="var(--mist)" />
            <span className="muted" style={{ fontSize: 12.5 }}>{item.replies}</span>
          </span>
        </div>
      </div>
    );
  }

  /* ---------- a record, told like a record ---------- */
  if (item.type === "sprint") {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => nav.push({ screen: "replay", params: { id: "m9", min: 41 } })}
        style={
          draft
            ? { width: "100%", textAlign: "left", borderRadius: "var(--r-card)", padding: "16px 18px", background: "var(--surface)", border: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 14 }
            : { width: "100%", textAlign: "left", borderRadius: 18, padding: "16px 18px", background: "linear-gradient(120deg,var(--amber),var(--heat))", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 0 26px -10px rgba(255,77,0,0.7)" }
        }
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="eyebrow" style={{ color: draft ? "var(--mist)" : "var(--on-accent-dim)", fontSize: 9 }}>{item.label} · {ago}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
            <span className="display" style={{ fontSize: 44, lineHeight: 0.9, color: draft ? "var(--ink)" : "var(--on-accent)" }}>
              <CountUp to={item.value} decimals={1} duration={1} delay={0.1} />
            </span>
            <span className="display" style={{ fontSize: 17, color: draft ? "var(--mist)" : "var(--on-accent-dim)" }}>{item.unit}</span>
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: draft ? "var(--body)" : "var(--on-accent-dim)", marginTop: 4 }}>{item.sub}</div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 22, border: `2px solid ${draft ? "var(--line)" : "var(--on-accent-line)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="bolt" size={22} color={draft ? "var(--mist)" : "var(--on-accent)"} />
        </div>
      </motion.button>
    );
  }

  /* ---------- a milestone, given room to land ---------- */
  if (item.type === "milestone") {
    return (
      <div className="card" style={{ position: "relative", overflow: "hidden", padding: "16px 18px", display: "flex", alignItems: "center", gap: 16 }}>
        {/* Sunday Draft has no decorative washes */}
        {!draft && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(80% 130% at 6% 50%, rgba(255,184,0,0.16), transparent 62%)" }} />}
        <div className="display" style={{ position: "relative", fontSize: 54, lineHeight: 0.85, color: "var(--amber)", flexShrink: 0 }}>
          <CountUp to={item.value} duration={0.9} delay={0.1} />
        </div>
        <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
          <div className="display" style={{ fontSize: 19, lineHeight: 1, color: "var(--ink)" }}>{item.label}</div>
          <div className="muted" style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.4 }}>{item.sub}</div>
          <div className="eyebrow" style={{ fontSize: 9, marginTop: 6 }}>{ago}</div>
        </div>
      </div>
    );
  }

  /* ---------- photos get to be photos ---------- */
  if (item.type === "photos") {
    const [lead, ...rest] = item.shots;
    const open = (index: number) =>
      nav.push({
        screen: "photos",
        params: { shots: item.shots, index, initial: item.who.slice(0, 1), color: "var(--our)", title: item.title, sub: `${item.sub} · ${ago}` },
      });
    return (
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 14px 10px" }}>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: "var(--our)", color: "var(--on-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
            {item.who.slice(0, 1)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{item.title}</div>
            <div className="muted" style={{ fontSize: 12.5 }}>{item.sub} · {ago}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, padding: "0 14px 12px", height: 168 }}>
          <motion.button whileTap={{ scale: 0.98 }} onClick={() => open(0)} aria-label="Open photo 1" style={{ flex: 1.6, minWidth: 0, borderRadius: 12, overflow: "hidden", lineHeight: 0 }}>
            <img src={img(400, 400, lead)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </motion.button>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            {rest.slice(0, 2).map((s, n) => {
              const isLast = n === 1 && rest.length > 2;
              return (
                <motion.button
                  key={s}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => open(n + 1)}
                  aria-label={`Open photo ${n + 2}`}
                  style={{ flex: 1, minWidth: 0, borderRadius: 12, overflow: "hidden", position: "relative", lineHeight: 0 }}
                >
                  <img src={img(300, 300, s)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  {isLast && (
                    <span className="on-media" style={{ position: "absolute", inset: 0, background: "rgba(5,7,10,0.62)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="display" style={{ fontSize: 22, color: "var(--ink)" }}>+{item.shots.length - 2}</span>
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ---------- a collectible, shown as one ---------- */
  if (item.type === "card") {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        className="card"
        onClick={() => nav.push({ screen: "cardDetail", params: { id: item.cardId } })}
        style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, width: "100%", textAlign: "left" }}
      >
        <div
          style={{
            width: 48, height: 66, borderRadius: 8, flexShrink: 0, transform: "rotate(-5deg)",
            // Sunday Draft leaves the collectible finishes undesigned — see cardStyles.ts
            background: draft ? "var(--elevated)" : "linear-gradient(150deg,#6b4e12 0%,#33260a 46%,#120d04 100%)",
            border: `1px solid ${draft ? "var(--line)" : "var(--amber)"}`,
            boxShadow: draft ? undefined : "0 6px 16px -6px rgba(255,184,0,0.55)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
          }}
        >
          <span className="display" style={{ fontSize: 18, color: draft ? "var(--ink)" : "#FFF3D4", lineHeight: 1 }}>{item.cardId}</span>
          <span className="mono" style={{ fontSize: 9, color: draft ? "var(--mist)" : "var(--amber)" }}>{item.rating.toFixed(1)}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="eyebrow" style={{ color: draft ? "var(--mist)" : "var(--amber)", fontSize: 9 }}>Legendary · just minted</div>
          <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--ink)", marginTop: 3 }}>{item.title}</div>
          <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{item.sub} · {ago}</div>
        </div>
        <Icon name="chevronRight" size={18} color="var(--mist)" />
      </motion.button>
    );
  }

  /* ---------- the quiet beat: someone reacted — contained, just lighter ---------- */
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 13px" }}>
      <div style={{ width: 28, height: 28, borderRadius: 14, background: item.color, color: "var(--on-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>
        {item.initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 13, color: "var(--body)" }}>{item.text}</span>
        <span className="muted" style={{ fontSize: 12.5 }}> — “{item.quote}”</span>
      </div>
      <span className="muted" style={{ fontSize: 11, flexShrink: 0 }}>{ago}</span>
    </div>
  );
}
