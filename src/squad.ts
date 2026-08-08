/* The squad. First names + club colours only — safe-sharing by default. */

export type Player = {
  id: string;
  name: string;
  num: number;
  pos: "GK" | "Defender" | "Midfield" | "Forward" | "Winger";
  color: string;
  isMaya?: boolean;
  season: { games: number; goals: number; assists: number; topKmh: number; km: number };
  trait: string;
};

export const squad: Player[] = [
  { id: "ivy", name: "Ivy", num: 1, pos: "GK", color: "var(--away)", trait: "Shot-stopper", season: { games: 9, goals: 0, assists: 0, topKmh: 18.4, km: 24.1 } },
  { id: "rosa", name: "Rosa", num: 4, pos: "Defender", color: "#7f8fa6", trait: "Reads the game", season: { games: 9, goals: 2, assists: 1, topKmh: 20.6, km: 38.2 } },
  { id: "nina", name: "Nina", num: 5, pos: "Defender", color: "#6b7f92", trait: "Never beaten twice", season: { games: 8, goals: 0, assists: 0, topKmh: 20.1, km: 35.7 } },
  { id: "lila", name: "Lila", num: 3, pos: "Defender", color: "#8aa0b5", trait: "Overlaps all day", season: { games: 9, goals: 0, assists: 2, topKmh: 21.3, km: 39.8 } },
  { id: "tess", name: "Tess", num: 6, pos: "Midfield", color: "#3DBB6E", trait: "Engine room", season: { games: 9, goals: 1, assists: 3, topKmh: 21.0, km: 44.6 } },
  { id: "amara", name: "Amara", num: 8, pos: "Midfield", color: "#35a862", trait: "Never gives it away", season: { games: 7, goals: 0, assists: 2, topKmh: 20.8, km: 33.4 } },
  { id: "sofia", name: "Sofia", num: 10, pos: "Midfield", color: "#8FB0FF", trait: "Picks the pass", season: { games: 9, goals: 3, assists: 4, topKmh: 21.6, km: 41.9 } },
  { id: "maya", name: "Maya", num: 9, pos: "Winger", color: "var(--amber)", isMaya: true, trait: "Fastest in the league", season: { games: 9, goals: 7, assists: 6, topKmh: 23.4, km: 41.2 } },
  { id: "jess", name: "Jess", num: 7, pos: "Forward", color: "#FF8A3D", trait: "Poacher", season: { games: 9, goals: 6, assists: 3, topKmh: 22.4, km: 37.5 } },
  { id: "priya", name: "Priya", num: 11, pos: "Winger", color: "#FF6B6B", trait: "Set-piece specialist", season: { games: 9, goals: 4, assists: 3, topKmh: 22.9, km: 39.1 } },
  { id: "bea", name: "Bea", num: 14, pos: "Forward", color: "#E5A0FF", trait: "Impact sub", season: { games: 6, goals: 1, assists: 1, topKmh: 21.8, km: 18.3 } },
];

export const getPlayer = (id: string) => squad.find((p) => p.id === id) ?? squad[7];

/* ---------- deterministic per-match lines ----------
   Keeps every player's game stats stable across renders without hand-authoring
   11 players × 9 matches. Goals/assists come from the match's authored scorers. */

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

const between = (seed: number, min: number, max: number, dec = 0) => {
  const span = max - min;
  const v = min + (seed % 1000) / 1000 * span;
  return Number(v.toFixed(dec));
};

export type MatchLine = {
  mins: number;
  kmh: number;
  km: number;
  passPct: number;
  touches: number;
  goals: number;
  assists: number;
};

export function lineFor(
  player: Player,
  match: { id: string; scorers: { id: string; g?: number; a?: number }[]; topKmh: number },
): MatchLine {
  const s = hash(player.id + match.id);
  const sc = match.scorers.find((x) => x.id === player.id);
  const gk = player.pos === "GK";
  // match.topKmh is Maya's fastest that day — nobody on the pitch beats it.
  const ceiling = Math.min(player.season.topKmh, match.topKmh - 0.3);
  return {
    mins: gk ? 70 : Math.round(between(s, 46, 70)),
    kmh: player.isMaya ? match.topKmh : between(s >> 3, gk ? 15 : 17.8, Math.max(18, ceiling), 1),
    km: gk ? between(s >> 5, 1.8, 2.6, 1) : between(s >> 5, 3.4, 5.4, 1),
    passPct: Math.round(between(s >> 7, gk ? 62 : 71, 93)),
    touches: gk ? Math.round(between(s >> 9, 18, 34)) : Math.round(between(s >> 9, 28, 74)),
    goals: sc?.g ?? 0,
    assists: sc?.a ?? 0,
  };
}
