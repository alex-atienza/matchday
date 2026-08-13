import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNav } from "../nav";
import Icon from "../components/Icon";
import CountUp from "../components/CountUp";
import CardShelf from "./CardShelf";
import { listContainer, listItem, tilePop, fadeUp } from "../motion";
import {
  badgesByPlayer, cardsByPlayer, formFor, img, keepsakeByPlayer, weekByPlayer, type Badge,
} from "../data";
import { followedPlayers, type Player as P } from "../squad";

const EASE = [0.22, 1, 0.36, 1] as const;
type Section = "season" | "cards" | "keepsake";

export default function Player() {
  const players = followedPlayers();
  const [activeId, setActiveId] = useState(players[0]?.id ?? "maya");
  const [section, setSection] = useState<Section>("season");
  const player = players.find((p) => p.id === activeId) ?? players[0];

  return (
    <div className="screen">
      <div className="scroll">
        <Hero player={player} />

        <div className="pad" style={{ paddingTop: 14, paddingBottom: 24 }}>
          {/* only appears when a family follows more than one player */}
          {players.length > 1 && (
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10 }} className="scroll">
              {players.map((p) => {
                const on = p.id === activeId;
                return (
                  <motion.button
                    key={p.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveId(p.id)}
                    className={"chip" + (on ? " active" : "")}
                    style={{ flexShrink: 0, gap: 8 }}
                  >
                    <span style={{ width: 18, height: 18, borderRadius: 9, background: on ? "var(--bg)" : p.color, color: on ? p.color : "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 10 }}>
                      {p.num}
                    </span>
                    {p.name}
                  </motion.button>
                );
              })}
            </div>
          )}

          <WeekCard player={player} />

          <div style={{ display: "flex", gap: 4, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, padding: 4, marginTop: 16 }}>
            {([["season", "Season"], ["cards", "Cards"], ["keepsake", "Keepsake"]] as const).map(([k, label]) => {
              const on = section === k;
              return (
                <motion.button key={k} onClick={() => setSection(k)} whileTap={{ scale: 0.97 }} aria-pressed={on} style={{ position: "relative", flex: 1, padding: "9px 0", borderRadius: 9 }}>
                  {on && <motion.span layoutId="player-tab" transition={{ type: "spring", stiffness: 520, damping: 36 }} style={{ position: "absolute", inset: 0, background: "var(--amber)", borderRadius: 9 }} />}
                  <span style={{ position: "relative", fontSize: 13, fontWeight: 700, color: on ? "var(--bg)" : "var(--mist)" }}>{label}</span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={section + activeId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: EASE }}
              style={{ marginTop: 18 }}
            >
              {section === "season" && <Season player={player} />}
              {section === "cards" && <CardsSection player={player} />}
              {section === "keepsake" && <Keepsake player={player} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ---------------- hero ---------------- */
function Hero({ player }: { player: P }) {
  const reduce = useReducedMotion();
  return (
    <div style={{ position: "relative", height: 372, flexShrink: 0, overflow: "hidden" }}>
      <motion.img
        src={img(800, 900, 58)}
        alt=""
        initial={{ scale: reduce ? 1 : 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,7,10,0.5) 0%, rgba(5,7,10,0.1) 34%, rgba(12,14,16,0.86) 76%, var(--bg) 100%)" }} />

      <div style={{ position: "absolute", top: "calc(18px + env(safe-area-inset-top, 0px))", right: 20 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--amber)", color: "var(--on-accent)", borderRadius: 16, padding: "7px 13px", fontSize: 12.5, fontWeight: 800 }}>
          <Icon name="check" size={13} color="var(--on-accent)" />
          Following
        </span>
      </div>

      <div className="on-media" style={{ position: "absolute", left: 20, right: 20, bottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="pulse-glow" style={{ width: 7, height: 7, borderRadius: 4, background: "var(--amber)" }} />
          <span className="eyebrow" style={{ color: "var(--amber)" }}>Live tracker · #{player.num}</span>
        </div>
        <h1
          className="display"
          style={{ margin: "8px 0 0", fontSize: player.name.length > 7 ? 44 : 58, lineHeight: 0.86, wordBreak: "break-word" }}
        >
          {player.name}
        </h1>
        <div className="muted" style={{ fontSize: 13.5, marginTop: 6 }}>
          {player.pos} · Ravens U15 · {player.trait}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {[
            { label: "Goals", value: player.season.goals, dec: 0, hot: false },
            { label: "Assists", value: player.season.assists, dec: 0, hot: false },
            { label: "Top km/h", value: player.season.topKmh, dec: 1, hot: true },
          ].map((s) => (
            <div key={s.label} className="card" style={{ flex: 1, textAlign: "center", padding: "10px 4px", background: s.hot ? "var(--amber)" : "var(--surface)", borderColor: s.hot ? "var(--amber)" : "var(--line)" }}>
              <div className="display" style={{ fontSize: 24, lineHeight: 1, color: s.hot ? "var(--on-accent)" : "var(--ink)" }}>
                <CountUp to={s.value} decimals={s.dec} duration={0.9} delay={0.2} />
              </div>
              <div className="eyebrow" style={{ fontSize: 8.5, marginTop: 2, color: s.hot ? "var(--on-accent-dim)" : "var(--mist)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- this week ---------------- */
function WeekCard({ player }: { player: P }) {
  const nav = useNav();
  const week = weekByPlayer[player.id];
  if (!week) return null;

  return (
    <motion.button
      variants={fadeUp}
      initial="hidden"
      animate="show"
      whileTap={{ scale: 0.985 }}
      onClick={() => nav.push({ screen: "replay", params: { id: "m9", min: 58 } })}
      className="card"
      style={{ width: "100%", overflow: "hidden", padding: 0, textAlign: "left", display: "block" }}
    >
      <div style={{ padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={img(160, 160, week.photo)} alt="" style={{ width: 52, height: 52, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="eyebrow" style={{ color: "var(--amber)", fontSize: 9.5, whiteSpace: "nowrap" }}>
              Sunday digest · {week.range}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 22, color: "var(--ink)", lineHeight: 1, marginTop: 3, textTransform: "uppercase" }}>
              Her week
            </div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 3 }}>{week.headline}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <MiniStat value={week.goals} label="Goals" />
          <MiniStat value={week.assists} label="Assists" />
          <MiniStat value={week.topKmh} label="Top km/h" hot />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 14px", borderTop: "1px solid var(--line)", background: "var(--elevated)" }}>
        <Icon name="bolt" size={15} color="var(--amber)" />
        <span style={{ fontSize: 12.5, color: "var(--body)", flex: 1 }}>{week.note}</span>
        <Icon name="chevronRight" size={16} color="var(--mist)" />
      </div>
    </motion.button>
  );
}

function MiniStat({ value, label, hot }: { value: number; label: string; hot?: boolean }) {
  return (
    <div style={{ flex: 1, textAlign: "center", background: hot ? "var(--amber)" : "var(--elevated)", borderRadius: 10, padding: "8px 4px" }}>
      <div className="display" style={{ fontSize: 19, lineHeight: 1, color: hot ? "var(--on-accent)" : "var(--ink)" }}>{value}</div>
      <div className="eyebrow" style={{ fontSize: 8.5, marginTop: 3, color: hot ? "var(--on-accent-dim)" : "var(--mist)" }}>{label}</div>
    </div>
  );
}

/* ---------------- season ---------------- */
function Season({ player }: { player: P }) {
  const form = formFor(player.id);
  const badges = badgesByPlayer[player.id] ?? [];
  const unlocked = badges.filter((b) => b.unlocked);
  const fresh = badges.find((b) => b.fresh);

  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 10 }}>Last five · her goals</div>
      <motion.div className="card" style={{ display: "flex", padding: "14px 12px", gap: 8 }} variants={listContainer} initial="hidden" animate="show">
        {form.map((f) => {
          const c = f.result === "W" ? "var(--our)" : f.result === "D" ? "var(--amber)" : "var(--their)";
          return (
            <motion.div key={f.id} variants={tilePop} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ width: 34, height: 34, margin: "0 auto", borderRadius: 9, background: `color-mix(in srgb, ${c} 18%, transparent)`, border: `1px solid ${c}`, color: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 15 }}>
                {f.result}
              </div>
              <div className="display" style={{ fontSize: 15, marginTop: 6, color: f.goals ? "var(--amber)" : "var(--faint)" }}>{f.goals}</div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="eyebrow" style={{ margin: "22px 2px 10px" }}>Spring 2026</div>
      <motion.div className="card" style={{ padding: 16 }} variants={fadeUp} initial="hidden" animate="show">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {[
            { label: "Games", v: player.season.games, d: 0 },
            { label: "Goals", v: player.season.goals, d: 0 },
            { label: "Assists", v: player.season.assists, d: 0 },
            { label: "Distance", v: player.season.km, d: 1 },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, textAlign: "center" }}>
              <div className="display" style={{ fontSize: 24, lineHeight: 1, color: "var(--ink)" }}>
                <CountUp to={s.v} decimals={s.d} duration={0.9} delay={0.15} />
              </div>
              <div className="eyebrow" style={{ fontSize: 9, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="divider" style={{ margin: "16px 0" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="bolt" size={16} color="var(--amber)" />
          <span style={{ fontSize: 13, color: "var(--body)" }}>
            Top speed <b style={{ color: "var(--ink)" }}>{player.season.topKmh} km/h</b> · {player.trait.toLowerCase()}
          </span>
        </div>
      </motion.div>

      {badges.length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "22px 2px 10px" }}>
            <span className="eyebrow">Badges</span>
            <span className="mono" style={{ fontSize: 11.5, color: "var(--mist)" }}>{unlocked.length} of {badges.length}</span>
          </div>

          {fresh && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              style={{ display: "flex", alignItems: "center", gap: 14, borderRadius: 16, padding: 14, background: "linear-gradient(120deg,var(--amber),var(--heat))", marginBottom: 12 }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 24, border: "2px solid var(--on-accent-line)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="trophy" size={22} color="var(--on-accent)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="eyebrow" style={{ color: "var(--on-accent-dim)", fontSize: 9 }}>Just unlocked</div>
                <div className="display" style={{ fontSize: 22, lineHeight: 1, color: "var(--on-accent)", marginTop: 2 }}>{fresh.name}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--on-accent-dim)", marginTop: 2 }}>{fresh.note}</div>
              </div>
            </motion.div>
          )}

          <motion.div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }} variants={listContainer} initial="hidden" animate="show">
            {badges.filter((b) => !b.fresh).map((b) => (
              <BadgeTile key={b.id} badge={b} />
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

function BadgeTile({ badge }: { badge: Badge }) {
  const on = badge.unlocked;
  return (
    <motion.div variants={tilePop} style={{ textAlign: "center" }}>
      <div
        style={{
          width: 54, height: 54, margin: "0 auto", borderRadius: 27,
          border: `2px solid ${on ? "var(--amber)" : "var(--line)"}`,
          background: on ? "color-mix(in srgb, var(--amber) 12%, transparent)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <Icon name={on ? badge.icon : "lock"} size={21} color={on ? "var(--amber)" : "var(--faint)"} />
      </div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: on ? "var(--ink)" : "var(--faint)", marginTop: 7 }}>{badge.name}</div>
      <div style={{ fontSize: 10, color: on ? "var(--mist)" : "var(--faint)", marginTop: 2, lineHeight: 1.3 }}>{badge.note}</div>
    </motion.div>
  );
}

/* ---------------- cards ---------------- */
function CardsSection({ player }: { player: P }) {
  const set = cardsByPlayer[player.id];
  if (!set) return <Empty icon="cards" title={`No cards yet for ${player.name}`} sub="Cards are minted after each match she plays." />;
  return <CardShelf />;
}

/* ---------------- keepsake ---------------- */
function Keepsake({ player }: { player: P }) {
  const nav = useNav();
  const keepsake = keepsakeByPlayer[player.id];
  if (!keepsake) {
    return <Empty icon="film" title={`${player.name}'s film is still filling up`} sub="Her season film unlocks once she has a few moments saved." />;
  }

  return (
    <div>
      <motion.button
        variants={fadeUp}
        initial="hidden"
        animate="show"
        whileTap={{ scale: 0.98 }}
        onClick={() => nav.push({ screen: "replay", params: { id: "m9", min: 58 } })}
        style={{ position: "relative", display: "block", width: "100%", height: 200, borderRadius: 18, overflow: "hidden", border: "1px solid var(--line)", textAlign: "left" }}
      >
        <img src={img(700, 500, keepsake.photo)} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(5,7,10,0.25),rgba(5,7,10,0.88))" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="play-pulse" style={{ width: 58, height: 58, borderRadius: 29, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 22px -4px rgba(255,184,0,0.65)" }}>
            <Icon name="play" size={24} color="var(--on-accent)" />
          </div>
        </div>
        <div className="on-media" style={{ position: "absolute", left: 16, right: 16, bottom: 14 }}>
          <div className="eyebrow" style={{ color: "var(--amber)" }}>Season film · {keepsake.filmLength}</div>
          <div className="display" style={{ fontSize: 30, lineHeight: 1, marginTop: 3 }}>{keepsake.filmTitle}</div>
          <div className="muted" style={{ fontSize: 12.5, marginTop: 3 }}>{keepsake.filmNote}</div>
        </div>
      </motion.button>

      <div className="eyebrow" style={{ margin: "22px 2px 10px" }}>Her best moments</div>
      <motion.div className="stack" style={{ gap: 10 }} variants={listContainer} initial="hidden" animate="show">
        {keepsake.best.map((b, i) => (
          <motion.button
            key={`${b.matchId}-${b.min}`}
            variants={listItem}
            whileTap={{ scale: 0.98 }}
            className="card"
            onClick={() =>
              nav.push({
                screen: "replay",
                params: {
                  id: b.matchId,
                  min: b.min,
                  queue: keepsake.best.map((x) => ({ id: x.matchId, min: x.min })),
                  queueLabel: `${player.name}'s best`,
                },
              })
            }
            style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, width: "100%", textAlign: "left" }}
          >
            <div className="display" style={{ width: 22, fontSize: 17, color: "var(--faint)", flexShrink: 0, textAlign: "center" }}>{i + 1}</div>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "color-mix(in srgb, var(--amber) 15%, transparent)", color: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 14 }}>
              {b.min}'
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{b.title}</div>
              <div className="muted" style={{ fontSize: 12.5 }}>{b.sub}</div>
            </div>
            <Icon name="play" size={15} color="var(--amber)" />
          </motion.button>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" className="card" style={{ marginTop: 18, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: "var(--elevated)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="book" size={20} color="var(--amber)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>The season book</div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>
              Every card, photo and milestone — printed and posted.
            </div>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} className="btn btn-primary" style={{ width: "100%", marginTop: 14 }}>
          Order her keepsake
        </motion.button>
        <div className="muted" style={{ fontSize: 11, textAlign: "center", marginTop: 8 }}>
          First name and club colours only — never her surname or venue.
        </div>
      </motion.div>
    </div>
  );
}

function Empty({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="card" style={{ padding: 28, textAlign: "center" }}>
      <div style={{ width: 48, height: 48, borderRadius: 24, background: "var(--elevated)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
        <Icon name={icon} size={22} color="var(--mist)" />
      </div>
      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{title}</div>
      <div className="muted" style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.45 }}>{sub}</div>
    </motion.div>
  );
}
