import { useState } from "react";
import { motion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import Reactions from "../components/Reactions";
import { circle, familyFeed, img, nextMatch, type FamilyPost } from "../data";

type Rsvp = null | "yes" | "maybe" | "no";

export default function Family() {
  const nav = useNav();
  const [feed, setFeed] = useState<FamilyPost[]>(familyFeed);
  const [draft, setDraft] = useState("");
  const [rsvp, setRsvp] = useState<Rsvp>(null);

  const post = () => {
    const text = draft.trim();
    if (!text) return;
    setFeed((f) => [
      { id: "me" + Date.now(), kind: "text", who: "You", initial: "Y", color: "var(--amber)", title: "You", body: text, love: 0, fire: 0, comments: 0, ago: "now" },
      ...f,
    ]);
    setDraft("");
  };

  const going = 5 + (rsvp === "yes" ? 1 : 0);

  return (
    <div className="screen">
      <div className="app-header">
        <div>
          <div className="kicker">Maya's Circle</div>
          <h1>Family Room</h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => nav.push({ screen: "manageCircle" })}
          aria-label="Manage circle"
          style={{ width: 38, height: 38, borderRadius: 19, background: "var(--surface)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Icon name="settings" size={19} color="var(--body)" />
        </motion.button>
      </div>

      <div className="scroll">
        {/* circle strip */}
        <div style={{ display: "flex", gap: 16, overflowX: "auto", padding: "0 20px 4px" }} className="scroll">
          {circle.map((m) => (
            <button key={m.name} className="press" onClick={() => nav.push({ screen: "manageCircle" })} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, width: 52 }}>
              <div style={{ width: 46, height: 46, borderRadius: 23, background: m.color, color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18 }}>{m.initial}</div>
              <span style={{ fontSize: 10.5, color: "var(--mist)", fontWeight: 600 }}>{m.name.split(" ")[0]}</span>
            </button>
          ))}
          <button className="press" onClick={() => nav.push({ screen: "manageCircle" })} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, width: 52 }}>
            <div style={{ width: 46, height: 46, borderRadius: 23, border: "1px dashed var(--line)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="plus" size={20} color="var(--mist)" />
            </div>
            <span style={{ fontSize: 10.5, color: "var(--mist)", fontWeight: 600 }}>Invite</span>
          </button>
        </div>

        <div className="pad" style={{ paddingBottom: 20, paddingTop: 10 }}>
          {/* RSVP */}
          <div className="card" style={{ padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>Saturday · vs {nextMatch.opponent}</div>
              <div className="muted" style={{ fontSize: 12 }}>{rsvp === "yes" ? `You + ${going - 1} going` : `${going} going`}</div>
            </div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 2, marginBottom: 12 }}>Are you coming to cheer Maya on?</div>
            <div style={{ display: "flex", gap: 8 }}>
              {(["yes", "maybe", "no"] as const).map((r) => {
                const on = rsvp === r;
                const color = r === "yes" ? "var(--our)" : r === "maybe" ? "var(--amber)" : "var(--away)";
                const label = r === "yes" ? "I'm in" : r === "maybe" ? "Maybe" : "Can't";
                return (
                  <motion.button
                    key={r}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRsvp(r)}
                    style={{ flex: 1, padding: "10px 0", borderRadius: 12, fontWeight: 700, fontSize: 13.5, border: on ? `1px solid ${color}` : "1px solid var(--line)", background: on ? `color-mix(in srgb, ${color} 20%, transparent)` : "transparent", color: on ? color : "var(--body)" }}
                  >
                    {label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* composer */}
          <div className="card" style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, marginBottom: 14 }}>
            <div className="avatar" style={{ width: 34, height: 34, fontSize: 15, flexShrink: 0 }}>Y</div>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && post()}
              placeholder="Share with the circle…"
              style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: "var(--ink)", fontSize: 14, fontFamily: "var(--font-ui)" }}
            />
            <motion.button whileTap={{ scale: 0.9 }} onClick={post} aria-label="Post" style={{ width: 34, height: 34, borderRadius: 17, background: draft.trim() ? "var(--amber)" : "var(--elevated)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="send" size={16} color={draft.trim() ? "var(--bg)" : "var(--mist)"} />
            </motion.button>
          </div>

          {/* feed */}
          <div className="stack" style={{ gap: 12 }}>
            {feed.map((p, i) => (
              <motion.div key={p.id} layout initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 420, damping: 32, delay: i < 7 ? i * 0.04 : 0 }}>
                <PostCard post={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: FamilyPost }) {
  const nav = useNav();
  const openThread = () => nav.push({ screen: "momentThread" });

  return (
    <div className="card" style={{ padding: 14 }}>
      <motion.button
        whileTap={post.kind === "photos" ? { scale: 0.99 } : undefined}
        onClick={post.kind === "photos" ? openThread : undefined}
        style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", textAlign: "left", cursor: post.kind === "photos" ? "pointer" : "default" }}
      >
        <div style={{ width: 34, height: 34, borderRadius: post.kind === "card" ? 6 : 17, background: post.kind === "card" ? "linear-gradient(160deg,#16224d,#0E1633)" : post.color, border: post.kind === "card" ? "1px solid var(--amber)" : "none", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: post.kind === "card" ? 11 : 14, flexShrink: 0 }}>
          {post.kind === "card" ? <span className="display" style={{ color: "var(--amber)", fontSize: 12 }}>{post.initial}</span> : post.initial}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{post.title}</div>
          {post.sub && <div className="muted" style={{ fontSize: 12.5 }}>{post.sub}</div>}
        </div>
        <span className="muted" style={{ fontSize: 11.5, flexShrink: 0 }}>{post.ago}</span>
      </motion.button>

      {post.body && <div style={{ fontSize: 14, color: "var(--body)", lineHeight: 1.45, marginTop: 8 }}>{post.body}</div>}

      {post.kind === "photos" && post.photos && (
        <div style={{ display: "flex", gap: 5, marginTop: 10, width: "100%" }}>
          {post.photos.map((s, n) => (
            <motion.button
              key={s}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                nav.push({
                  screen: "photos",
                  params: {
                    shots: post.photos,
                    index: n,
                    who: post.who,
                    initial: post.initial,
                    color: post.color,
                    title: post.title,
                    sub: `${post.sub ?? ""} · ${post.ago} ago`,
                  },
                })
              }
              aria-label={`Open photo ${n + 1} of ${post.photos!.length}`}
              style={{ flex: 1, minWidth: 0, borderRadius: 10, overflow: "hidden", lineHeight: 0 }}
            >
              <img src={img(240, 200, s)} alt="" style={{ width: "100%", height: 118, objectFit: "cover", display: "block" }} />
            </motion.button>
          ))}
        </div>
      )}

      {post.kind === "clip" && (
        <button className="press" onClick={() => nav.push({ screen: "replay", params: { id: "m9" } })} style={{ position: "relative", display: "block", width: "100%", height: 118, marginTop: 10, borderRadius: 10, overflow: "hidden" }}>
          <img src={img(320, 200, 63)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(5,7,10,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="play" size={18} color="var(--bg)" />
            </div>
          </div>
        </button>
      )}

      {post.kind === "card" && (
        <button className="press" onClick={() => nav.push({ screen: "cardDetail", params: { id: "M9" } })} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, color: "var(--amber)", fontSize: 13, fontWeight: 700 }}>
          View card <Icon name="chevronRight" size={15} color="var(--amber)" />
        </button>
      )}

      <div style={{ marginTop: 10 }}>
        <Reactions love={post.love} fire={post.fire} comments={post.comments} onComment={post.kind === "photos" ? openThread : undefined} />
      </div>
    </div>
  );
}
