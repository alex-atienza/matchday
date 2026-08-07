import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "../components/Icon";
import HomeFeed from "./HomeFeed";
import HomeBento from "./HomeBento";

type View = "list" | "bento";

export default function Home() {
  const [view, setViewState] = useState<View>(() =>
    typeof localStorage !== "undefined" && localStorage.getItem("mdHomeView") === "bento" ? "bento" : "list",
  );
  const setView = (v: View) => {
    setViewState(v);
    try {
      localStorage.setItem("mdHomeView", v);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="screen">
      <div className="app-header">
        <div>
          <div className="kicker">Good morning</div>
          <h1>Matchday</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ViewToggle view={view} setView={setView} />
          <div className="avatar">M</div>
        </div>
      </div>

      <div className="scroll">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {view === "list" ? <HomeFeed /> : <HomeBento />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ViewToggle({ view, setView }: { view: View; setView: (v: View) => void }) {
  const opts: { key: View; icon: string; label: string }[] = [
    { key: "list", icon: "list", label: "List view" },
    { key: "bento", icon: "grid", label: "Grid view" },
  ];
  return (
    <div style={{ display: "flex", gap: 2, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 10, padding: 3 }}>
      {opts.map((o) => {
        const on = view === o.key;
        return (
          <motion.button
            key={o.key}
            onClick={() => setView(o.key)}
            whileTap={{ scale: 0.9 }}
            aria-label={o.label}
            aria-pressed={on}
            style={{ position: "relative", width: 34, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}
          >
            {on && (
              <motion.span
                layoutId="home-toggle-pill"
                transition={{ type: "spring", stiffness: 520, damping: 36 }}
                style={{ position: "absolute", inset: 0, background: "var(--elevated)", borderRadius: 8 }}
              />
            )}
            <span style={{ position: "relative", display: "flex" }}>
              <Icon name={o.icon} size={17} color={on ? "var(--amber)" : "var(--mist)"} />
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
