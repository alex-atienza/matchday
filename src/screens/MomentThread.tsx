import { useState } from "react";
import { motion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import Pitch from "../components/Pitch";
import GoalTrail from "../components/GoalTrail";
import DetailHeader from "../components/DetailHeader";
import { listContainer, tilePop, fadeUp } from "../motion";
import { img, momentThread } from "../data";

type Comment = { who: string; initial: string; color: string; text: string; ago: string };

export default function MomentThread(_: { params?: any }) {
  const nav = useNav();
  const t = momentThread;
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>(t.comments);
  const [draft, setDraft] = useState("");

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setComments((c) => [...c, { who: "You", initial: "Y", color: "var(--amber)", text, ago: "now" }]);
    setDraft("");
  };

  return (
    <div className="screen">
      <DetailHeader title={`MOMENT · ${t.min}'`} action={<Icon name="share" size={19} color="var(--mist)" />} />
      <div className="scroll">
        <div className="pad" style={{ paddingBottom: 16 }}>
          <motion.button variants={fadeUp} initial="hidden" animate="show" whileTap={{ scale: 0.98 }} onClick={() => nav.push({ screen: "replay", params: { id: "m9" } })} style={{ display: "block", width: "100%" }}>
            <Pitch radius={16} style={{ height: 170 }}>
              <GoalTrail w={326} h={170} a={[40, 140]} b={[165, 90]} c={[292, 64]} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="play-pulse" style={{ width: 54, height: 54, borderRadius: 27, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px -4px rgba(255,184,0,0.6)" }}>
                  <Icon name="play" size={22} color="var(--on-accent)" />
                </div>
              </div>
            </Pitch>
          </motion.button>

          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <div className="display" style={{ fontSize: 26, marginTop: 14 }}>{t.title}</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{t.sub}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setLiked((v) => !v)}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: liked ? "color-mix(in srgb, var(--their) 16%, transparent)" : "var(--surface)", border: `1px solid ${liked ? "var(--their)" : "var(--line)"}`, borderRadius: 20, padding: "8px 13px" }}
              >
                <motion.span key={String(liked)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 620, damping: 13 }} style={{ display: "flex" }}>
                  <Icon name={liked ? "heart" : "heartLine"} size={16} color={liked ? "var(--their)" : "var(--mist)"} />
                </motion.span>
                <span style={{ fontSize: 12.5, color: "var(--body)" }}>{liked ? `You, ${t.likers}` : t.likers}</span>
              </motion.button>
            </div>
          </motion.div>

          {/* photos */}
          <motion.div style={{ display: "flex", gap: 6, marginTop: 14 }} variants={listContainer} initial="hidden" animate="show">
            {t.photos.map((p, n) => (
              <motion.button
                key={p}
                variants={tilePop}
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  nav.push({
                    screen: "photos",
                    params: {
                      shots: t.photos,
                      index: n,
                      initial: "D",
                      color: "var(--our)",
                      title: `Photos from ${t.title}`,
                      sub: t.sub,
                    },
                  })
                }
                aria-label={`Open photo ${n + 1} of ${t.photos.length}`}
                style={{ flex: 1, minWidth: 0, borderRadius: 10, overflow: "hidden", lineHeight: 0 }}
              >
                <img src={img(220, 220, p)} alt="" style={{ width: "100%", height: 96, objectFit: "cover", display: "block" }} />
              </motion.button>
            ))}
          </motion.div>

          {/* comments */}
          <div className="eyebrow" style={{ margin: "20px 2px 12px" }}>{comments.length} comments</div>
          <div className="stack" style={{ gap: 14 }}>
            {comments.map((cm, i) => (
              <motion.div key={i} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 420, damping: 30 }} style={{ display: "flex", gap: 11 }}>
                <div style={{ width: 32, height: 32, borderRadius: 16, background: cm.color, color: "var(--on-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{cm.initial}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, color: "var(--body)", lineHeight: 1.4 }}>
                    <b style={{ color: "var(--ink)" }}>{cm.who}</b> {cm.text}
                  </div>
                  <div className="muted" style={{ fontSize: 11.5, marginTop: 3 }}>{cm.ago === "now" ? "just now" : `${cm.ago} ago`}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* comment composer */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderTop: "1px solid var(--line)", flexShrink: 0 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Add to the thread…"
          style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20, padding: "10px 14px", color: "var(--ink)", fontSize: 13, outline: "none", fontFamily: "var(--font-ui)" }}
        />
        <motion.button whileTap={{ scale: 0.9 }} onClick={send} aria-label="Send" style={{ width: 40, height: 40, borderRadius: 20, background: draft.trim() ? "var(--amber)" : "var(--elevated)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="send" size={18} color={draft.trim() ? "var(--bg)" : "var(--mist)"} />
        </motion.button>
      </div>
    </div>
  );
}
