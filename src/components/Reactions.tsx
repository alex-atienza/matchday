import { useState } from "react";
import { motion } from "framer-motion";
import Icon from "./Icon";

function Chip({
  active,
  activeIcon,
  idleIcon,
  activeColor,
  count,
  onClick,
}: {
  active: boolean;
  activeIcon: string;
  idleIcon: string;
  activeColor: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <motion.button whileTap={{ scale: 0.82 }} onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 2px" }}>
      <motion.span key={String(active)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 620, damping: 13 }} style={{ display: "flex" }}>
        <Icon name={active ? activeIcon : idleIcon} size={18} color={active ? activeColor : "var(--mist)"} />
      </motion.span>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: active ? activeColor : "var(--mist)" }}>{count}</span>
    </motion.button>
  );
}

export default function Reactions({
  love,
  fire,
  comments,
  onComment,
}: {
  love: number;
  fire: number;
  comments: number;
  onComment?: () => void;
}) {
  const [lOn, setLOn] = useState(false);
  const [lN, setLN] = useState(love);
  const [fOn, setFOn] = useState(false);
  const [fN, setFN] = useState(fire);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Chip active={lOn} activeIcon="heart" idleIcon="heartLine" activeColor="var(--their)" count={lN} onClick={() => { setLOn(!lOn); setLN(lN + (lOn ? -1 : 1)); }} />
      <Chip active={fOn} activeIcon="flameFill" idleIcon="flame" activeColor="var(--amber)" count={fN} onClick={() => { setFOn(!fOn); setFN(fN + (fOn ? -1 : 1)); }} />
      <motion.button whileTap={{ scale: 0.9 }} onClick={onComment} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 2px" }}>
        <Icon name="message" size={16} color="var(--mist)" />
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--mist)" }}>{comments}</span>
      </motion.button>
    </div>
  );
}
