import { motion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import Pitch from "../components/Pitch";
import GoalTrail from "../components/GoalTrail";
import CountUp from "../components/CountUp";
import { listContainer, listItem } from "../motion";
import { homeFeed, img, nextMatch, type FeedItem } from "../data";

export default function HomeFeed() {
  const nav = useNav();
  return (
    <motion.div className="pad stack" style={{ gap: 12, paddingTop: 6, paddingBottom: 20 }} variants={listContainer} initial="hidden" animate="show">
      {/* pinned next match */}
      <motion.button
        variants={listItem}
        whileTap={{ scale: 0.98 }}
        className="card"
        onClick={() => nav.goTab("replays")}
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

      {homeFeed.map((item, i) => (
        <motion.div variants={listItem} key={i}>
          <FeedRow item={item} />
        </motion.div>
      ))}
    </motion.div>
  );
}

function FeedRow({ item }: { item: FeedItem }) {
  const nav = useNav();

  if (item.type === "goal") {
    return (
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px 10px" }}>
          <div className="avatar" style={{ width: 34, height: 34, fontSize: 15 }}>9</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{item.title}</div>
            <div className="muted" style={{ fontSize: 12.5 }}>{item.sub}</div>
          </div>
          <span className="chip" style={{ padding: "5px 10px", fontSize: 10, letterSpacing: "0.08em" }}>REPLAY</span>
        </div>
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => nav.push({ screen: "replay", params: { id: "m9", min: 58 } })} style={{ display: "block", width: "100%", padding: "0 14px" }}>
          <Pitch radius={12} style={{ height: 150 }}>
            <GoalTrail w={326} h={150} a={[40, 120]} b={[165, 80]} c={[290, 60]} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="play-pulse" style={{ width: 52, height: 52, borderRadius: 26, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px -4px rgba(255,184,0,0.6)" }}>
                <Icon name="play" size={22} color="var(--bg)" />
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

  if (item.type === "react") {
    return (
      <div className="card" style={{ display: "flex", alignItems: "center", gap: 12, padding: 12 }}>
        <Bubble initial={item.initial} color={item.color} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{item.text}</div>
          <div className="muted" style={{ fontSize: 12.5 }}>"{item.quote}" · {item.ago}</div>
        </div>
        <Icon name="heart" size={18} color="var(--their)" />
      </div>
    );
  }

  if (item.type === "card") {
    return (
      <motion.button whileTap={{ scale: 0.98 }} className="card" onClick={() => nav.push({ screen: "cardDetail", params: { id: "M9" } })} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, width: "100%", textAlign: "left" }}>
        <MiniCard />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{item.title}</div>
          <div className="muted" style={{ fontSize: 12.5 }}>{item.sub}</div>
        </div>
        <Icon name="chevronRight" size={18} color="var(--mist)" />
      </motion.button>
    );
  }

  if (item.type === "photos") {
    return (
      <div className="card" style={{ display: "flex", alignItems: "center", gap: 12, padding: 12 }}>
        <img src={img(120, 120, item.shots[0])} width={56} height={56} style={{ borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{item.title}</div>
          <div className="muted" style={{ fontSize: 12.5 }}>{item.sub}</div>
        </div>
        <div style={{ display: "flex", flexShrink: 0 }}>
          {item.shots.slice(1, 3).map((s, i) => (
            <img key={s} src={img(80, 80, s)} width={30} height={30} style={{ borderRadius: 8, objectFit: "cover", border: "2px solid var(--surface)", marginLeft: i ? -10 : 0 }} />
          ))}
        </div>
      </div>
    );
  }

  const icon = item.type === "milestone" ? "target" : "bolt";
  const color = item.type === "milestone" ? "var(--our)" : "var(--amber)";
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", gap: 12, padding: 12 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--elevated)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={icon} size={18} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{item.title}</div>
        <div className="muted" style={{ fontSize: 12.5 }}>{item.sub}</div>
      </div>
    </div>
  );
}

function Bubble({ initial, color }: { initial: string; color: string }) {
  return (
    <div style={{ width: 34, height: 34, borderRadius: 17, background: color, color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
      {initial}
    </div>
  );
}

function MiniCard() {
  return (
    <div style={{ width: 30, height: 40, borderRadius: 6, background: "linear-gradient(160deg,#16224d,#0E1633)", border: "1px solid var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span className="display" style={{ fontSize: 13, color: "var(--amber)" }}>M9</span>
    </div>
  );
}
