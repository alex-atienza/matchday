import { useState } from "react";
import { motion } from "framer-motion";
import Icon from "../components/Icon";
import Switch from "../components/Switch";
import DetailHeader from "../components/DetailHeader";
import { listContainer, listItem, fadeUp } from "../motion";
import { circle } from "../data";

export default function ManageCircle(_: { params?: any }) {
  const [safe, setSafe] = useState(true);
  const [notify, setNotify] = useState<Record<string, boolean>>(
    () => Object.fromEntries(circle.map((m) => [m.name, m.role !== "Family"])),
  );

  return (
    <div className="screen">
      <DetailHeader title="MANAGE CIRCLE" />
      <div className="scroll">
        <div className="pad" style={{ paddingBottom: 24 }}>
          {/* safe sharing */}
          <div className="eyebrow" style={{ margin: "4px 2px 12px" }}>Safe sharing</div>
          <motion.div className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }} variants={fadeUp} initial="hidden" animate="show">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--ink)" }}>Safe by default</div>
              <div className="muted" style={{ fontSize: 12.5, marginTop: 3, lineHeight: 1.45 }}>
                Anything the circle shares shows Maya's <b style={{ color: "var(--body)" }}>first name and club colours only</b> — no surname, venue, or league.
              </div>
            </div>
            <Switch on={safe} onChange={setSafe} />
          </motion.div>

          {/* members */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "22px 2px 12px" }}>
            <span className="eyebrow">The circle · {circle.length}</span>
            <span className="muted" style={{ fontSize: 11 }}>Matchday alerts</span>
          </div>
          <motion.div className="card" style={{ overflow: "hidden" }} variants={listContainer} initial="hidden" animate="show">
            {circle.map((m, i) => (
              <motion.div key={m.name} variants={listItem} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderTop: i ? "1px solid var(--line)" : "none" }}>
                <div style={{ width: 38, height: 38, borderRadius: 19, background: m.color, color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{m.initial}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--ink)" }}>{m.name}</div>
                  <div className="muted" style={{ fontSize: 12.5 }}>{m.role}</div>
                </div>
                <Switch on={!!notify[m.name]} onChange={(v) => setNotify((n) => ({ ...n, [m.name]: v }))} />
              </motion.div>
            ))}
          </motion.div>

          {/* invite */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            style={{ width: "100%", marginTop: 14, padding: 16, borderRadius: 16, border: "1px dashed var(--line)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--body)", fontWeight: 700, fontSize: 14 }}
          >
            <Icon name="plus" size={18} color="var(--amber)" />
            Invite someone to the circle
          </motion.button>
        </div>
      </div>
    </div>
  );
}
