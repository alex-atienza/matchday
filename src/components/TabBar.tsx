import { motion } from "framer-motion";
import Icon from "./Icon";
import type { TabKey } from "../nav";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "home", label: "Home", icon: "home" },
  { key: "replays", label: "Replays", icon: "replays" },
  { key: "cards", label: "Cards", icon: "cards" },
  { key: "family", label: "Family", icon: "family" },
];

export default function TabBar({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
}) {
  return (
    <nav className="tabbar">
      {TABS.map((t) => {
        const on = t.key === active;
        return (
          <motion.button
            key={t.key}
            className={on ? "active" : ""}
            onClick={() => onChange(t.key)}
            aria-label={t.label}
            aria-current={on ? "page" : undefined}
            whileTap={{ scale: 0.86 }}
            transition={{ type: "spring", stiffness: 600, damping: 30 }}
          >
            <div className="tab-icon-slot">
              {on && (
                <motion.span
                  layoutId="tab-pill"
                  className="tab-pill"
                  transition={{ type: "spring", stiffness: 520, damping: 36 }}
                />
              )}
              <motion.span
                animate={{ scale: on ? 1.1 : 1, y: on ? -1 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 26 }}
                style={{ position: "relative", display: "flex" }}
              >
                <Icon name={t.icon} size={22} color={on ? "var(--amber)" : "var(--mist)"} />
              </motion.span>
            </div>
            <span className="label">{t.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}
