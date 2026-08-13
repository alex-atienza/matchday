import { useState } from "react";
import { motion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import CountUp from "../components/CountUp";
import AppHeader from "../components/AppHeader";
import { listContainer, listItem, fadeUp } from "../motion";
import { fixtures, leagueTable, matches, nextMatch, type Fixture, type Match } from "../data";
import { useTheme } from "../theme";

const EASE = [0.22, 1, 0.36, 1] as const;
type Rsvp = null | "yes" | "maybe" | "no";

export default function Schedule() {
  const [rsvp, setRsvp] = useState<Rsvp>(null);
  const [next, ...later] = fixtures;
  const played = matches;

  return (
    <div className="screen">
      <AppHeader kicker={`Spring 2026 · ${played.length} of ${played.length + fixtures.length}`} title="Schedule" />
      <div className="scroll">
        <div className="pad" style={{ paddingBottom: 24 }}>
          <NextMatch fixture={next} rsvp={rsvp} setRsvp={setRsvp} />

          {/* upcoming */}
          <div className="eyebrow" style={{ margin: "22px 2px 10px" }}>Still to play</div>
          <motion.div className="stack" style={{ gap: 10 }} variants={listContainer} initial="hidden" animate="show">
            {later.map((f) => (
              <motion.div key={f.id} variants={listItem} className="card" style={{ display: "flex", alignItems: "center", gap: 13, padding: 12 }}>
                <div style={{ width: 44, textAlign: "center", flexShrink: 0 }}>
                  <div className="display" style={{ fontSize: 19, color: "var(--ink)", lineHeight: 1 }}>{f.date.split(" ")[2]}</div>
                  <div className="eyebrow" style={{ fontSize: 8.5, marginTop: 2 }}>{f.date.split(" ")[1]}</div>
                </div>
                <div style={{ width: 1, alignSelf: "stretch", background: "var(--line)" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--ink)" }}>
                    {f.home ? "vs" : "@"} {f.opponent}
                  </div>
                  <div className="muted" style={{ fontSize: 12.5 }}>{f.time} · {f.venue}</div>
                </div>
                <span className="chip" style={{ fontSize: 10.5, padding: "5px 9px", flexShrink: 0 }}>
                  {f.days}d
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* results */}
          <div className="eyebrow" style={{ margin: "22px 2px 10px" }}>Results</div>
          <motion.div className="stack" style={{ gap: 8 }} variants={listContainer} initial="hidden" animate="show">
            {played.map((m) => (
              <ResultRow key={m.id} match={m} />
            ))}
          </motion.div>

          {/* league table */}
          <div className="eyebrow" style={{ margin: "22px 2px 10px" }}>League table · Girls U15 Div 2</div>
          <motion.div className="card" style={{ overflow: "hidden" }} variants={fadeUp} initial="hidden" animate="show">
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderBottom: "1px solid var(--line)" }}>
              <span style={{ width: 18 }} />
              <span className="eyebrow" style={{ flex: 1, fontSize: 8.5 }}>Team</span>
              {["P", "W", "D", "L", "GD", "PTS"].map((h) => (
                <span key={h} className="eyebrow" style={{ width: h === "PTS" ? 30 : 20, textAlign: "center", fontSize: 8.5 }}>{h}</span>
              ))}
            </div>
            {leagueTable.map((r) => (
              <div
                key={r.team}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                  background: r.us ? "color-mix(in srgb, var(--amber) 12%, transparent)" : "transparent",
                  borderBottom: r.pos === leagueTable.length ? "none" : "1px solid var(--line)",
                }}
              >
                <span className="mono" style={{ width: 18, fontSize: 11, color: r.us ? "var(--amber)" : "var(--faint)" }}>{r.pos}</span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: r.us ? 800 : 600, color: r.us ? "var(--amber)" : "var(--body)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {r.team}
                </span>
                {[r.p, r.w, r.d, r.l].map((v, i) => (
                  <span key={i} className="mono" style={{ width: 20, textAlign: "center", fontSize: 11.5, color: "var(--mist)" }}>{v}</span>
                ))}
                <span className="mono" style={{ width: 20, textAlign: "center", fontSize: 11.5, color: r.gd > 0 ? "var(--our)" : r.gd < 0 ? "var(--their)" : "var(--mist)" }}>
                  {r.gd > 0 ? `+${r.gd}` : r.gd}
                </span>
                <span className="display" style={{ width: 30, textAlign: "center", fontSize: 16, color: r.us ? "var(--amber)" : "var(--ink)" }}>{r.pts}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- next match ---------------- */
function NextMatch({ fixture, rsvp, setRsvp }: { fixture: Fixture; rsvp: Rsvp; setRsvp: (r: Rsvp) => void }) {
  const going = (fixture.coming ?? 0) + (rsvp === "yes" ? 1 : 0);
  const draft = useTheme().theme === "draft";

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="card" style={{ position: "relative", overflow: "hidden", padding: 18 }}>
      {/* Sunday Draft has no decorative washes */}
      {!draft && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(80% 120% at 12% 0%, rgba(255,184,0,0.16), transparent 60%)" }} />}
      <div style={{ position: "relative" }}>
        <div className="eyebrow" style={{ color: "var(--amber)" }}>Next match · {fixture.date}</div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div className="display" style={{ fontSize: 46, color: "var(--amber)", lineHeight: 0.9 }}>
              <CountUp to={fixture.days} duration={0.7} />
            </div>
            <div className="eyebrow" style={{ fontSize: 9 }}>Days</div>
          </div>
          <div style={{ width: 1, alignSelf: "stretch", background: "var(--line)" }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="display" style={{ fontSize: 25, lineHeight: 1 }}>Ravens vs {fixture.opponent}</div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 5, display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="clock" size={13} color="var(--mist)" />
              {fixture.time} · {fixture.home ? "Home" : "Away"}
            </div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 3, display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="mapPin" size={13} color="var(--mist)" />
              {fixture.venue}
            </div>
          </div>
        </div>

        {/* kit + weather */}
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "var(--elevated)", borderRadius: 10, padding: "9px 11px" }}>
            <span style={{ width: 16, height: 16, borderRadius: 5, background: "linear-gradient(135deg,#1B2A21,#2C4436)", border: "1px solid var(--our)", flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--body)" }}>{nextMatch.kit} kit</span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "var(--elevated)", borderRadius: 10, padding: "9px 11px" }}>
            <Icon name="clock" size={14} color="var(--mist)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--body)" }}>{nextMatch.temp} · clear</span>
          </div>
        </div>

        {/* rsvp */}
        <div className="divider" style={{ margin: "16px 0 14px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>Are you going?</span>
          <span className="muted" style={{ fontSize: 12 }}>{rsvp === "yes" ? `You + ${going - 1} going` : `${going} going`}</span>
        </div>
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
    </motion.div>
  );
}

/* ---------------- results ---------------- */
function ResultRow({ match }: { match: Match }) {
  const nav = useNav();
  const c = match.result === "W" ? "var(--our)" : match.result === "D" ? "var(--amber)" : "var(--their)";
  return (
    <motion.button
      variants={listItem}
      whileTap={{ scale: 0.99 }}
      className="card"
      onClick={() => nav.push({ screen: "matchHub", params: { id: match.id } })}
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", width: "100%", textAlign: "left" }}
    >
      <div style={{ width: 28, height: 28, borderRadius: 8, background: `color-mix(in srgb, ${c} 18%, transparent)`, border: `1px solid ${c}`, color: c, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 13 }}>
        {match.result}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ink)" }}>
          {match.home ? "vs" : "@"} {match.opponent}
        </div>
        <div className="muted" style={{ fontSize: 11.5 }}>{match.date}</div>
      </div>
      <div className="display" style={{ fontSize: 18, color: "var(--ink)", flexShrink: 0 }}>{match.score}</div>
      <Icon name="chevronRight" size={16} color="var(--mist)" />
    </motion.button>
  );
}
