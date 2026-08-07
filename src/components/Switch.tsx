import { motion } from "framer-motion";

export default function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button
      onClick={() => onChange(!on)}
      aria-pressed={on}
      whileTap={{ scale: 0.95 }}
      style={{ width: 46, height: 28, borderRadius: 14, padding: 3, background: on ? "var(--amber)" : "var(--line)", display: "flex", flexShrink: 0 }}
    >
      <motion.span
        animate={{ x: on ? 18 : 0 }}
        transition={{ type: "spring", stiffness: 600, damping: 34 }}
        style={{ width: 22, height: 22, borderRadius: 11, background: on ? "#0C0E10" : "#e9efe9", display: "block" }}
      />
    </motion.button>
  );
}
