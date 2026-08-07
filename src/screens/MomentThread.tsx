import { motion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import Pitch from "../components/Pitch";
import GoalTrail from "../components/GoalTrail";
import DetailHeader from "../components/DetailHeader";
import { listContainer, listItem, tilePop, fadeUp } from "../motion";
import { img, momentThread } from "../data";

export default function MomentThread(_: { params?: any }) {
  const nav = useNav();
  const t = momentThread;
  return (
    <div className="screen">
      <DetailHeader title={`MOMENT · ${t.min}'`} action={<Icon name="share" size={19} color="var(--mist)" />} />
      <div className="scroll">
        <div className="pad" style={{ paddingBottom: 16 }}>
          {/* replay hero */}
          <motion.button
            variants={fadeUp}
            initial="hidden"
            animate="show"
            whileTap={{ scale: 0.98 }}
            onClick={() => nav.push({ screen: "replay", params: { id: "m9" } })}
            style={{ display: "block", width: "100%" }}
          >
            <Pitch radius={16} style={{ height: 170 }}>
              <GoalTrail w={326} h={170} a={[40, 140]} b={[165, 90]} c={[292, 64]} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="play-pulse" style={{ width: 54, height: 54, borderRadius: 27, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px -4px rgba(255,184,0,0.6)" }}>
                  <Icon name="play" size={22} color="var(--bg)" />
                </div>
              </div>
            </Pitch>
          </motion.button>

          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <div className="display" style={{ fontSize: 26, marginTop: 14 }}>{t.title}</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{t.sub}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20, padding: "8px 13px" }}>
                <Icon name="heart" size={16} color="var(--their)" />
                <span style={{ fontSize: 12.5, color: "var(--body)" }}>{t.likers}</span>
              </div>
            </div>
          </motion.div>

          {/* photos */}
          <motion.div style={{ display: "flex", gap: 6, marginTop: 14 }} variants={listContainer} initial="hidden" animate="show">
            {t.photos.map((p) => (
              <motion.img key={p} variants={tilePop} src={img(220, 220, p)} style={{ flex: 1, height: 96, objectFit: "cover", borderRadius: 10, minWidth: 0 }} />
            ))}
          </motion.div>

          {/* comments */}
          <div className="eyebrow" style={{ margin: "20px 2px 12px" }}>{t.comments.length} comments</div>
          <motion.div className="stack" style={{ gap: 14 }} variants={listContainer} initial="hidden" animate="show">
            {t.comments.map((cm, i) => (
              <motion.div key={i} variants={listItem} style={{ display: "flex", gap: 11 }}>
                <div style={{ width: 32, height: 32, borderRadius: 16, background: cm.color, color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                  {cm.initial}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, color: "var(--body)", lineHeight: 1.4 }}>
                    <b style={{ color: "var(--ink)" }}>{cm.who}</b> {cm.text}
                  </div>
                  <div className="muted" style={{ fontSize: 11.5, marginTop: 3 }}>{cm.ago} ago</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* comment input */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderTop: "1px solid var(--line)", flexShrink: 0 }}>
        <div style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20, padding: "10px 14px", color: "var(--mist)", fontSize: 13 }}>
          Add to the thread…
        </div>
        <motion.button whileTap={{ scale: 0.9 }} aria-label="Send" style={{ width: 40, height: 40, borderRadius: 20, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="send" size={18} color="var(--bg)" />
        </motion.button>
      </div>
    </div>
  );
}
