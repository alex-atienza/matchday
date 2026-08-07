import { motion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import { listContainer, listItem, tilePop } from "../motion";
import { circle, familyFeed, img, type FamilyItem } from "../data";

export default function Family() {
  const nav = useNav();
  return (
    <div className="screen">
      <div className="app-header">
        <div>
          <div className="kicker">Maya's Circle</div>
          <h1>Family Room</h1>
        </div>
      </div>

      <div className="scroll">
        {/* circle strip */}
        <motion.div
          style={{ display: "flex", gap: 16, overflowX: "auto", padding: "0 20px 6px" }}
          className="scroll"
          variants={listContainer}
          initial="hidden"
          animate="show"
        >
          {circle.map((m) => (
            <motion.div key={m.name} variants={tilePop} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, width: 52 }}>
              <div style={{ width: 46, height: 46, borderRadius: 23, background: m.color, color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18 }}>
                {m.initial}
              </div>
              <span style={{ fontSize: 10.5, color: "var(--mist)", fontWeight: 600 }}>{m.name.split(" ")[0]}</span>
            </motion.div>
          ))}
          <motion.button variants={tilePop} whileTap={{ scale: 0.9 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, width: 52 }}>
            <div style={{ width: 46, height: 46, borderRadius: 23, border: "1px dashed var(--line)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="plus" size={20} color="var(--mist)" />
            </div>
            <span style={{ fontSize: 10.5, color: "var(--mist)", fontWeight: 600 }}>Invite</span>
          </motion.button>
        </motion.div>

        <div className="pad" style={{ paddingBottom: 20, paddingTop: 8 }}>
          <motion.div className="stack" style={{ gap: 12 }} variants={listContainer} initial="hidden" animate="show">
            {familyFeed.map((item, i) => (
              <motion.div variants={listItem} key={i}>
                <FamilyRow item={item} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FamilyRow({ item }: { item: FamilyItem }) {
  const nav = useNav();

  if (item.type === "photos") {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        className="card"
        onClick={() => nav.push({ screen: "momentThread" })}
        style={{ overflow: "hidden", padding: 0, width: "100%", textAlign: "left", display: "block" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px 10px" }}>
          <Bubble initial={item.initial} color={item.color} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{item.title}</div>
            <div className="muted" style={{ fontSize: 12.5 }}>{item.sub}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, padding: "0 14px" }}>
          {item.shots.map((s) => (
            <img key={s} src={img(240, 200, s)} style={{ flex: 1, height: 120, objectFit: "cover", borderRadius: 10, minWidth: 0 }} />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 14px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="heart" size={16} color="var(--their)" />
            <span className="muted" style={{ fontSize: 12.5 }}>{item.likes}</span>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="message" size={16} color="var(--mist)" />
            <span className="muted" style={{ fontSize: 12.5 }}>{item.replies}</span>
          </span>
        </div>
      </motion.button>
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

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className="card"
      onClick={() => nav.push({ screen: "cardDetail", params: { id: "M9" } })}
      style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, width: "100%", textAlign: "left" }}
    >
      <div style={{ width: 34, height: 44, borderRadius: 6, background: "linear-gradient(160deg,#16224d,#0E1633)", border: "1px solid var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span className="display" style={{ fontSize: 12, color: "var(--amber)" }}>9</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{item.title}</div>
        <div className="muted" style={{ fontSize: 12.5 }}>{item.sub}</div>
      </div>
      <Icon name="chevronRight" size={18} color="var(--mist)" />
    </motion.button>
  );
}

function Bubble({ initial, color }: { initial: string; color: string }) {
  return (
    <div style={{ width: 34, height: 34, borderRadius: 17, background: color, color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
      {initial}
    </div>
  );
}
