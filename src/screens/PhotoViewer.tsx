import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import { img } from "../data";

const EASE = [0.22, 1, 0.36, 1] as const;

export type PhotoParams = {
  /** LoremFlickr lock ids — stand-ins for real uploads */
  shots: number[];
  index?: number;
  who?: string;
  initial?: string;
  color?: string;
  title?: string;
  sub?: string;
};

export default function PhotoViewer({ params }: { params: PhotoParams }) {
  const nav = useNav();
  const reduce = useReducedMotion();
  const shots = params.shots?.length ? params.shots : [21];

  const [i, setI] = useState(Math.min(params.index ?? 0, shots.length - 1));
  const [dir, setDir] = useState(0);
  const [liked, setLiked] = useState(false);

  const go = (d: number) => {
    const n = i + d;
    if (n < 0 || n >= shots.length) return;
    setDir(d);
    setI(n);
  };

  const variants = {
    enter: (d: number) => (reduce ? { opacity: 0 } : { x: d > 0 ? 260 : -260, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: reduce ? 0.15 : 0.32, ease: EASE } },
    exit: (d: number) =>
      reduce
        ? { opacity: 0, transition: { duration: 0.15 } }
        : { x: d > 0 ? -260 : 260, opacity: 0, transition: { duration: 0.28, ease: EASE } },
  };

  return (
    <div className="screen" style={{ background: "#05070A", position: "relative" }}>
      {/* top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "calc(18px + env(safe-area-inset-top, 0px)) 16px 10px", flexShrink: 0, zIndex: 5 }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={nav.back} aria-label="Close photos" style={{ display: "flex" }}>
          <Icon name="x" size={22} color="var(--body)" />
        </motion.button>
        <div className="mono" style={{ fontSize: 12.5, color: "var(--body)" }}>
          {i + 1} / {shots.length}
        </div>
        <motion.button whileTap={{ scale: 0.9 }} aria-label="Share photo" style={{ display: "flex" }}>
          <Icon name="share" size={19} color="var(--body)" />
        </motion.button>
      </div>

      {/* the photo */}
      <div style={{ flex: 1, minHeight: 0, position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.img
            key={shots[i]}
            src={img(900, 1200, shots[i])}
            alt={params.title ?? "Match photo"}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 || info.velocity.x < -420) go(1);
              else if (info.offset.x > 60 || info.velocity.x > 420) go(-1);
            }}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", cursor: "grab", touchAction: "pan-y" }}
          />
        </AnimatePresence>

        {/* step arrows */}
        {i > 0 && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => go(-1)}
            aria-label="Previous photo"
            style={{ position: "absolute", left: 10, top: "50%", marginTop: -20, width: 40, height: 40, borderRadius: 20, background: "rgba(12,14,16,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}
          >
            <Icon name="chevronLeft" size={20} color="var(--ink)" />
          </motion.button>
        )}
        {i < shots.length - 1 && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => go(1)}
            aria-label="Next photo"
            style={{ position: "absolute", right: 10, top: "50%", marginTop: -20, width: 40, height: 40, borderRadius: 20, background: "rgba(12,14,16,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}
          >
            <Icon name="chevronRight" size={20} color="var(--ink)" />
          </motion.button>
        )}
      </div>

      {/* caption + reactions */}
      <div style={{ flexShrink: 0, padding: "12px 16px calc(14px + env(safe-area-inset-bottom,8px))", background: "var(--bg)", borderTop: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          {params.initial && (
            <div style={{ width: 32, height: 32, borderRadius: 16, background: params.color ?? "var(--our)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
              {params.initial}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{params.title ?? "Match photos"}</div>
            {params.sub && <div className="muted" style={{ fontSize: 12.5, marginTop: 1 }}>{params.sub}</div>}
          </div>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setLiked((v) => !v)}
            aria-label={liked ? "Remove reaction" : "Love this photo"}
            style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
          >
            <motion.span key={String(liked)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 620, damping: 13 }} style={{ display: "flex" }}>
              <Icon name={liked ? "heart" : "heartLine"} size={20} color={liked ? "var(--their)" : "var(--mist)"} />
            </motion.span>
          </motion.button>
        </div>

        {/* thumbnails */}
        {shots.length > 1 && (
          <div style={{ display: "flex", gap: 6, marginTop: 12, overflowX: "auto" }} className="scroll">
            {shots.map((s, n) => (
              <motion.button
                key={s}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  setDir(n > i ? 1 : -1);
                  setI(n);
                }}
                aria-label={`Photo ${n + 1}`}
                style={{ flexShrink: 0, borderRadius: 8, overflow: "hidden", border: n === i ? "2px solid var(--amber)" : "2px solid transparent", opacity: n === i ? 1 : 0.55, lineHeight: 0 }}
              >
                <img src={img(120, 120, s)} alt="" style={{ width: 48, height: 48, objectFit: "cover", display: "block" }} />
              </motion.button>
            ))}
          </div>
        )}

        <div className="muted" style={{ fontSize: 10.5, textAlign: "center", marginTop: 10 }}>
          Shared with Maya's circle only
        </div>
      </div>
    </div>
  );
}
