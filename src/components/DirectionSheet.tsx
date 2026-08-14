import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Icon from "./Icon";
import { THEMES, THEME_LABEL, useTheme, type Theme } from "../theme";

const EASE = [0.22, 1, 0.36, 1] as const;

const BLURB: Record<Theme, string> = {
  lights: "Floodlit and broadcast-led. The finished-product look.",
  draft: "Paper, graphite and one blue. Deliberately unfinished.",
};

/**
 * In-app direction picker, opened by tapping the profile avatar.
 *
 * The corner switch only exists on desktop — once the phone goes full-bleed
 * there is nowhere to put it that is not on top of the app. This is how you
 * change direction on a real handset.
 *
 * It names the two directions rather than dressing itself up as a product
 * setting, so a reviewer reads it as a prototype control.
 */
export default function DirectionSheet() {
  const { theme, setTheme, pickerOpen, setPickerOpen } = useTheme();
  const reduce = useReducedMotion();

  const close = () => setPickerOpen(false);

  return (
    <AnimatePresence>
      {pickerOpen && (
        <motion.div
          className="sheet-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2 } }}
          exit={{ opacity: 0, transition: { duration: 0.16 } }}
        >
          <button className="sheet-scrim" aria-label="Close" onClick={close} />

          <motion.div
            className="sheet"
            role="dialog"
            aria-label="Design direction"
            initial={{ y: reduce ? 0 : "100%" }}
            animate={{ y: 0, transition: { duration: 0.32, ease: EASE } }}
            exit={{ y: reduce ? 0 : "100%", transition: { duration: 0.24, ease: EASE } }}
          >
            <div className="sheet-grip" />
            <div className="eyebrow" style={{ marginBottom: 4 }}>Prototype control</div>
            <div className="display" style={{ fontSize: 24, lineHeight: 1 }}>Design direction</div>

            <div className="stack" style={{ marginTop: 16 }}>
              {THEMES.map((t) => {
                const active = t === theme;
                return (
                  <button
                    key={t}
                    className="press"
                    onClick={() => {
                      setTheme(t);
                      close();
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, width: "100%",
                      textAlign: "left", padding: "14px 0", borderTop: "1px solid var(--line)",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>
                        {THEME_LABEL[t]}
                      </div>
                      <div className="muted" style={{ fontSize: 12.5, marginTop: 2, lineHeight: 1.4 }}>
                        {BLURB[t]}
                      </div>
                    </div>
                    <span
                      style={{
                        width: 24, height: 24, borderRadius: 12, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: active ? "var(--amber)" : "transparent",
                        border: active ? "none" : "1px solid var(--line)",
                      }}
                    >
                      {active && <Icon name="check" size={14} color="var(--on-accent)" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
