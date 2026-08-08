/* Matchday — mock content for the prototype.
   Photos are LoremFlickr placeholders (girls,soccer) — swap for licensed /
   first-party before any real use. */

export const img = (w: number, h: number, lock: number) =>
  `https://loremflickr.com/${w}/${h}/girls,soccer/all?lock=${lock}`;

export const player = {
  first: "Maya",
  num: 9,
  club: "Ravens",
  age: "U15",
  pos: "Winger",
  division: "Girls U15 · Div 2",
};

export const nextMatch = {
  opponent: "Hawks",
  day: "Sat",
  time: "9:00",
  venue: "Riverside Park",
  home: true,
  days: 2,
  coming: 5,
  kit: "Green",
  temp: "14°",
};

/* ---------- HOME feed ---------- */
export type FeedItem =
  | { type: "goal"; min: number; title: string; sub: string; likers: string; replies: number }
  | { type: "react"; who: string; initial: string; color: string; text: string; quote: string; ago: string }
  | { type: "card"; title: string; sub: string }
  | { type: "photos"; who: string; title: string; sub: string; shots: number[] }
  | { type: "milestone"; title: string; sub: string }
  | { type: "sprint"; title: string; sub: string };

export const homeFeed: FeedItem[] = [
  {
    type: "goal",
    min: 58,
    title: "Maya scored · 58'",
    sub: "vs Falcons FC · 2h ago",
    likers: "Dad, Grandma +2",
    replies: 6,
  },
  {
    type: "react",
    who: "Grandma",
    initial: "G",
    color: "var(--away)",
    text: "Grandma reacted to the 41' sprint",
    quote: "unstoppable!",
    ago: "5h ago",
  },
  { type: "card", title: "New Matchday Card minted", sub: "Rating 9.2 · 9 of 12 · 1d ago" },
  {
    type: "photos",
    who: "Dad",
    title: "Dad added 4 photos",
    sub: "Warm-up & the celebration · 6h ago",
    shots: [44, 45, 46, 47],
  },
  { type: "milestone", title: "7 goals this season", sub: "A new personal best — passed last year's 6" },
  { type: "sprint", title: "Top speed · 23.4 km/h", sub: "Season best, set in the 41' recovery run" },
  {
    type: "react",
    who: "Coach Rae",
    initial: "R",
    color: "var(--our)",
    text: "Coach Rae noted the 30' assist",
    quote: "great vision to find Jess",
    ago: "1d ago",
  },
];

/* ---------- REPLAYS ---------- */
export type Moment = {
  min: number;
  kind: "our" | "their" | "sprint" | "save";
  title: string;
  sub: string;
  /** choreography id from plays.ts */
  play?: string;
  /** who it belongs to, for the player pages */
  who?: string;
};

export type TeamStats = {
  poss: [number, number];
  shots: [number, number];
  onTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
};

export type Scorer = { id: string; g?: number; a?: number };

export type Match = {
  id: string;
  opponent: string;
  date: string;
  result: "W" | "D" | "L";
  score: string;
  home: boolean;
  goals: number;
  assists: number;
  topKmh: number;
  photos: number;
  moments: Moment[];
  scorers: Scorer[];
  teamStats: TeamStats;
};

export const matches: Match[] = [
  {
    id: "m9",
    opponent: "Falcons FC",
    date: "Sat, May 18",
    result: "W",
    score: "3–2",
    home: true,
    goals: 2,
    assists: 0,
    topKmh: 23.4,
    photos: 6,
    scorers: [{ id: "maya", g: 2 }, { id: "jess", g: 1, a: 1 }, { id: "priya", a: 1 }],
    teamStats: { poss: [54, 46], shots: [14, 9], onTarget: [7, 5], corners: [6, 3], fouls: [8, 11] },
    moments: [
      { min: 12, kind: "our", who: "maya", play: "cutback", title: "GOAL · Maya finishes the cutback", sub: "Assist Jess · 2 photos · 6 replies" },
      { min: 30, kind: "our", who: "jess", play: "header", title: "GOAL · Jess doubles it", sub: "Header from the corner · 1 photo" },
      { min: 34, kind: "their", play: "conceded", title: "GOAL · Falcons pull one back", sub: "Counter-attack" },
      { min: 41, kind: "sprint", who: "maya", play: "sprintRecovery", title: "SPRINT · 23.4 km/h — season best", sub: "40m recovery run · 1 reply" },
      { min: 58, kind: "our", who: "maya", play: "nearPost", title: "GOAL · Maya makes it three", sub: "Left foot, near post · 4 photos" },
      { min: 70, kind: "their", play: "penalty", title: "GOAL · Falcons late reply", sub: "Set piece" },
    ],
  },
  {
    id: "m8", opponent: "Rangers", date: "Sat, May 11", result: "D", score: "1–1", home: false,
    goals: 0, assists: 1, topKmh: 22.1, photos: 2,
    scorers: [{ id: "priya", g: 1 }, { id: "maya", a: 1 }],
    teamStats: { poss: [48, 52], shots: [9, 12], onTarget: [4, 5], corners: [4, 6], fouls: [10, 9] },
    moments: [
      { min: 22, kind: "our", who: "maya", play: "assistCross", title: "GOAL · Priya taps in Maya's cross", sub: "Assist Maya · 1 photo" },
      { min: 38, kind: "sprint", who: "maya", play: "sprintRight", title: "SPRINT · 22.1 km/h", sub: "Chasing down the long ball" },
      { min: 63, kind: "their", play: "penalty", title: "GOAL · Rangers equalise", sub: "Penalty" },
      { min: 80, kind: "save", who: "ivy", play: "save", title: "SAVE · Ivy keeps the point", sub: "Low to her right · 2 replies" },
    ],
  },
  {
    id: "m7", opponent: "Comets", date: "Sat, May 4", result: "W", score: "2–0", home: true,
    goals: 1, assists: 0, topKmh: 22.8, photos: 4,
    scorers: [{ id: "maya", g: 1 }, { id: "sofia", g: 1 }, { id: "tess", a: 1 }],
    teamStats: { poss: [58, 42], shots: [16, 6], onTarget: [8, 2], corners: [8, 2], fouls: [6, 8] },
    moments: [
      { min: 18, kind: "our", who: "maya", play: "lowDrive", title: "GOAL · Maya, low drive", sub: "Top corner from 20 yards · 2 photos" },
      { min: 33, kind: "save", who: "ivy", play: "saveHigh", title: "SAVE · Tipped over the bar", sub: "Ivy's best of the season" },
      { min: 55, kind: "our", who: "sofia", play: "teamMove", title: "GOAL · Sofia finishes the move", sub: "Nine passes, one touch · 1 photo" },
      { min: 68, kind: "sprint", who: "maya", play: "sprintRight", title: "SPRINT · 22.8 km/h", sub: "Breakaway down the right" },
    ],
  },
  {
    id: "m6", opponent: "United", date: "Sat, Apr 27", result: "W", score: "1–0", home: false,
    goals: 0, assists: 1, topKmh: 21.9, photos: 1,
    scorers: [{ id: "jess", g: 1 }, { id: "maya", a: 1 }],
    teamStats: { poss: [44, 56], shots: [8, 13], onTarget: [3, 4], corners: [3, 7], fouls: [12, 10] },
    moments: [
      { min: 29, kind: "sprint", who: "maya", play: "sprintLeft", title: "SPRINT · 21.9 km/h", sub: "First of 24 sprints" },
      { min: 44, kind: "save", who: "ivy", play: "save", title: "SAVE · Ivy denies the header", sub: "Corner cleared" },
      { min: 71, kind: "our", who: "maya", play: "assistSquare", title: "GOAL · Jess wins it late", sub: "Assist Maya — the lung-buster · 1 photo" },
      { min: 88, kind: "save", who: "ivy", play: "saveHigh", title: "SAVE · One last stop", sub: "Held on for the clean sheet" },
    ],
  },
  {
    id: "m5", opponent: "Kestrels", date: "Sat, Apr 20", result: "L", score: "2–3", home: true,
    goals: 1, assists: 1, topKmh: 23.0, photos: 3,
    scorers: [{ id: "maya", g: 1, a: 1 }, { id: "rosa", g: 1 }],
    teamStats: { poss: [51, 49], shots: [12, 11], onTarget: [5, 6], corners: [5, 4], fouls: [9, 13] },
    moments: [
      { min: 11, kind: "their", play: "conceded", title: "GOAL · Kestrels strike first", sub: "Counter-attack" },
      { min: 26, kind: "our", who: "maya", play: "nearPost", title: "GOAL · Maya levels it", sub: "Left foot, near post · 1 photo" },
      { min: 40, kind: "our", who: "maya", play: "assistCross", title: "GOAL · Rosa heads it in", sub: "Assist Maya · 1 photo" },
      { min: 58, kind: "their", play: "penalty", title: "GOAL · Kestrels ahead again", sub: "Set piece" },
      { min: 77, kind: "their", play: "conceded", title: "GOAL · The winner", sub: "Deflected off the post" },
    ],
  },
  {
    id: "m4", opponent: "Athletic", date: "Sat, Apr 13", result: "W", score: "4–1", home: false,
    goals: 2, assists: 1, topKmh: 22.5, photos: 5,
    scorers: [{ id: "maya", g: 2, a: 1 }, { id: "jess", g: 1 }, { id: "sofia", g: 1 }],
    teamStats: { poss: [61, 39], shots: [18, 7], onTarget: [10, 3], corners: [9, 2], fouls: [5, 7] },
    moments: [
      { min: 9, kind: "our", who: "maya", play: "toePoke", title: "GOAL · Maya opens it early", sub: "First touch of the game · 2 photos" },
      { min: 24, kind: "our", who: "maya", play: "assistSquare", title: "GOAL · Jess doubles the lead", sub: "Assist Maya" },
      { min: 38, kind: "their", play: "conceded", title: "GOAL · Athletic pull one back", sub: "Free kick" },
      { min: 52, kind: "sprint", who: "maya", play: "sprintLeft", title: "SPRINT · 22.5 km/h", sub: "Down the left touchline" },
      { min: 66, kind: "our", who: "maya", play: "solo", title: "GOAL · Maya's solo run", sub: "Past two, finished low · 3 photos" },
      { min: 81, kind: "our", who: "sofia", play: "teamMove", title: "GOAL · Sofia caps it", sub: "Nine-pass team move" },
    ],
  },
  {
    id: "m3", opponent: "Rovers", date: "Sat, Apr 6", result: "W", score: "3–1", home: true,
    goals: 1, assists: 0, topKmh: 21.7, photos: 2,
    scorers: [{ id: "maya", g: 1 }, { id: "priya", g: 1, a: 1 }, { id: "jess", g: 1 }],
    teamStats: { poss: [56, 44], shots: [15, 8], onTarget: [7, 3], corners: [7, 4], fouls: [7, 9] },
    moments: [
      { min: 27, kind: "our", who: "maya", play: "toePoke", title: "GOAL · Maya toe-pokes it in", sub: "Quickest reaction in the box" },
      { min: 41, kind: "their", play: "conceded", title: "GOAL · Rovers respond", sub: "Long range" },
      { min: 55, kind: "our", who: "priya", play: "freeKick", title: "GOAL · Priya's free kick", sub: "Straight over the wall · 1 photo" },
      { min: 62, kind: "sprint", who: "maya", play: "sprintRecovery", title: "SPRINT · 21.7 km/h", sub: "Recovery run to halfway" },
      { min: 74, kind: "our", who: "jess", play: "teamMove", title: "GOAL · Jess seals it", sub: "Assist Priya" },
    ],
  },
  {
    id: "m2", opponent: "Wanderers", date: "Sat, Mar 30", result: "D", score: "0–0", home: false,
    goals: 0, assists: 0, topKmh: 21.2, photos: 2,
    scorers: [],
    teamStats: { poss: [47, 53], shots: [7, 9], onTarget: [2, 3], corners: [3, 5], fouls: [11, 12] },
    moments: [
      { min: 20, kind: "save", who: "ivy", play: "save", title: "SAVE · Ivy's double stop", sub: "Two in two seconds" },
      { min: 45, kind: "sprint", who: "maya", play: "sprintRecovery", title: "SPRINT · 21.2 km/h", sub: "Last-ditch tracking back" },
      { min: 62, kind: "save", who: "maya", play: "lowDrive", title: "SAVE · Maya denied", sub: "Their keeper tips it wide · 1 photo" },
      { min: 78, kind: "save", who: "maya", play: "saveHigh", title: "SAVE · Goal-line block", sub: "Maya hooks it off the line · 4 replies" },
    ],
  },
  {
    id: "m1", opponent: "Harriers", date: "Sat, Mar 23", result: "W", score: "2–1", home: true,
    goals: 0, assists: 1, topKmh: 20.8, photos: 3,
    scorers: [{ id: "rosa", g: 1 }, { id: "jess", g: 1 }, { id: "maya", a: 1 }],
    teamStats: { poss: [50, 50], shots: [10, 10], onTarget: [4, 4], corners: [5, 5], fouls: [8, 8] },
    moments: [
      { min: 15, kind: "their", play: "conceded", title: "GOAL · Harriers take the lead", sub: "An early setback" },
      { min: 34, kind: "our", who: "rosa", play: "header", title: "GOAL · Rosa equalises", sub: "Scramble from a corner · 1 photo" },
      { min: 62, kind: "our", who: "maya", play: "assistSquare", title: "GOAL · Jess wins it", sub: "Assist Maya — her first ever · 2 photos" },
      { min: 70, kind: "sprint", who: "maya", play: "sprintLeft", title: "SPRINT · 20.8 km/h", sub: "Her first tracked sprint" },
    ],
  },
];

// Player dots for the featured replay pitch (portrait, % coordinates).
export const replayDots: { x: number; y: number; team: "our" | "their" }[] = [
  { x: 52, y: 22 }, { x: 30, y: 34 }, { x: 68, y: 30 }, { x: 24, y: 52 },
  { x: 72, y: 48 }, { x: 44, y: 62 }, { x: 60, y: 70 }, { x: 40, y: 78 },
  { x: 28, y: 40, team: "their" } as any, { x: 66, y: 60, team: "their" } as any,
].map((d: any) => ({ x: d.x, y: d.y, team: d.team || "our" }));

/* ---------- CARDS ---------- */
export const seasonStats = { goals: 7, assists: 6, topKmh: 23.4, badges: 8, minted: 9, total: 12 };

export type CardTier = "legendary" | "heat" | "clean" | "playmaker" | "debut" | "standard";

export type MatchCard = {
  id: string;
  matchId?: string;
  locked?: false;
  tier: CardTier;
  rating: number;
  headline: string;
  opponent: string;
  date: string;
  result: string;
  serial: string;
  /** grid emphasis on the shelf */
  span?: "hero" | "wide";
  photo?: number;
  stats: { label: string; value: string }[];
  zones: { label: string; pct: number; color: string }[];
  moments: { min: number; title: string; desc: string }[];
};

export type LockedCard = { id: string; locked: true; label: string };

export type ShelfCard = MatchCard | LockedCard;

const Z = (walk: number, jog: number, run: number, sprint: number) => [
  { label: "Walk", pct: walk, color: "var(--away)" },
  { label: "Jog", pct: jog, color: "var(--our)" },
  { label: "Run", pct: run, color: "var(--amber)" },
  { label: "Sprint", pct: sprint, color: "var(--heat)" },
];

export const cards: ShelfCard[] = [
  {
    id: "M9", matchId: "m9", tier: "legendary", rating: 9.2, headline: "Brace · Personal best",
    opponent: "Falcons FC", date: "Sat, May 18", result: "W 3–2", serial: "009 / 012", span: "hero", photo: 21,
    stats: [
      { label: "Goals", value: "2" }, { label: "Assists", value: "0" }, { label: "Shots", value: "4" },
      { label: "Pass %", value: "88" }, { label: "Distance", value: "4.9 km" }, { label: "Top km/h", value: "23.4" },
    ],
    zones: Z(38, 34, 20, 8),
    moments: [
      { min: 12, title: "The cutback", desc: "Jess drives the byline and pulls it back; Maya sweeps it first-time into the far corner." },
      { min: 58, title: "Near-post dart", desc: "A run in behind the full-back, left foot across the keeper — the winner." },
    ],
  },
  {
    id: "M8", matchId: "m8", tier: "playmaker", rating: 7.8, headline: "The assist",
    opponent: "Rangers", date: "Sat, May 11", result: "D 1–1", serial: "008 / 012",
    stats: [
      { label: "Goals", value: "0" }, { label: "Assists", value: "1" }, { label: "Key passes", value: "5" },
      { label: "Pass %", value: "91" }, { label: "Distance", value: "5.2 km" }, { label: "Top km/h", value: "22.1" },
    ],
    zones: Z(42, 36, 17, 5),
    moments: [{ min: 22, title: "Whipped cross", desc: "Maya beats her marker on the outside and hangs it up for Priya to tap in." }],
  },
  {
    id: "M7", matchId: "m7", tier: "clean", rating: 8.1, headline: "Clean sheet",
    opponent: "Comets", date: "Sat, May 4", result: "W 2–0", serial: "007 / 012",
    stats: [
      { label: "Goals", value: "1" }, { label: "Assists", value: "0" }, { label: "Tackles", value: "6" },
      { label: "Pass %", value: "85" }, { label: "Distance", value: "5.0 km" }, { label: "Top km/h", value: "22.8" },
    ],
    zones: Z(40, 33, 21, 6),
    moments: [{ min: 18, title: "Low drive", desc: "Twenty yards out, no backlift — straight into the bottom corner." }],
  },
  {
    id: "M6", matchId: "m6", tier: "heat", rating: 7.4, headline: "Distance record",
    opponent: "United", date: "Sat, Apr 27", result: "W 1–0", serial: "006 / 012", span: "wide",
    stats: [
      { label: "Goals", value: "0" }, { label: "Assists", value: "1" }, { label: "Sprints", value: "24" },
      { label: "Pass %", value: "82" }, { label: "Distance", value: "4.8 km" }, { label: "Top km/h", value: "21.9" },
    ],
    zones: Z(30, 33, 26, 11),
    moments: [{ min: 71, title: "The lung-buster", desc: "A 60-metre recovery run to win it back, then the pass that made the winner." }],
  },
  {
    id: "M5", matchId: "m5", tier: "standard", rating: 8.0, headline: "Goal + assist",
    opponent: "Kestrels", date: "Sat, Apr 20", result: "L 2–3", serial: "005 / 012",
    stats: [
      { label: "Goals", value: "1" }, { label: "Assists", value: "1" }, { label: "Shots", value: "3" },
      { label: "Pass %", value: "79" }, { label: "Distance", value: "4.6 km" }, { label: "Top km/h", value: "23.0" },
    ],
    zones: Z(36, 35, 21, 8),
    moments: [{ min: 40, title: "Header back across", desc: "Rose highest at the back post and nodded it back for the equaliser." }],
  },
  {
    id: "M4", matchId: "m4", tier: "legendary", rating: 9.0, headline: "Brace away",
    opponent: "Athletic", date: "Sat, Apr 13", result: "W 4–1", serial: "004 / 012",
    stats: [
      { label: "Goals", value: "2" }, { label: "Assists", value: "1" }, { label: "Shots", value: "5" },
      { label: "Pass %", value: "86" }, { label: "Distance", value: "5.1 km" }, { label: "Top km/h", value: "22.5" },
    ],
    zones: Z(34, 34, 23, 9),
    moments: [
      { min: 9, title: "Early opener", desc: "First touch of the game, first goal of the game." },
      { min: 66, title: "Solo run", desc: "Picked it up on halfway, went past two, finished low." },
    ],
  },
  {
    id: "M3", matchId: "m3", tier: "standard", rating: 7.9, headline: "The opener",
    opponent: "Rovers", date: "Sat, Apr 6", result: "W 3–1", serial: "003 / 012",
    stats: [
      { label: "Goals", value: "1" }, { label: "Assists", value: "0" }, { label: "Shots", value: "2" },
      { label: "Pass %", value: "84" }, { label: "Distance", value: "4.4 km" }, { label: "Top km/h", value: "21.7" },
    ],
    zones: Z(41, 34, 19, 6),
    moments: [{ min: 27, title: "Toe-poke", desc: "Quickest reaction in the box after the keeper spilled it." }],
  },
  {
    id: "M2", tier: "standard", rating: 7.2, headline: "Held the line",
    opponent: "Wanderers", date: "Sat, Mar 30", result: "D 0–0", serial: "002 / 012",
    stats: [
      { label: "Goals", value: "0" }, { label: "Assists", value: "0" }, { label: "Tackles", value: "4" },
      { label: "Pass %", value: "80" }, { label: "Distance", value: "4.2 km" }, { label: "Top km/h", value: "21.2" },
    ],
    zones: Z(45, 33, 17, 5),
    moments: [{ min: 55, title: "Goal-line block", desc: "Tracked all the way back to hook it off the line." }],
  },
  {
    id: "M1", tier: "debut", rating: 7.5, headline: "First whistle",
    opponent: "Harriers", date: "Sat, Mar 23", result: "W 2–1", serial: "001 / 012", photo: 45,
    stats: [
      { label: "Goals", value: "0" }, { label: "Assists", value: "1" }, { label: "Shots", value: "1" },
      { label: "Pass %", value: "77" }, { label: "Distance", value: "3.9 km" }, { label: "Top km/h", value: "20.8" },
    ],
    zones: Z(48, 32, 15, 5),
    moments: [{ min: 62, title: "Her first assist", desc: "The first of many — a simple square ball, and the bench went up." }],
  },
  { id: "M10", locked: true, label: "Sat 9 AM" },
  { id: "M11", locked: true, label: "—" },
  { id: "M12", locked: true, label: "—" },
];

export const getCard = (id: string): MatchCard =>
  (cards.find((c) => c.id === id && !c.locked) as MatchCard) ?? (cards[0] as MatchCard);

export const TIER_META: Record<CardTier, { rarity: string; note: string }> = {
  legendary: { rarity: "Legendary", note: "Rating 9.0+" },
  heat: { rarity: "Rare", note: "A record broken" },
  clean: { rarity: "Special", note: "Clean sheet" },
  playmaker: { rarity: "Special", note: "Playmaker" },
  debut: { rarity: "First edition", note: "Her first match" },
  standard: { rarity: "Common", note: "Season card" },
};

/* ---------- HER TAB: week digest, badges, keepsake ---------- */

export const week = {
  range: "May 12–18",
  headline: "Her fastest week yet.",
  goals: 2,
  assists: 0,
  topKmh: 23.4,
  photo: 33,
  note: "One new milestone this week — worth a cheer.",
};

export type Badge = {
  id: string;
  name: string;
  note: string;
  icon: string;
  unlocked: boolean;
  fresh?: boolean;
};

export const badges: Badge[] = [
  { id: "hattrick", name: "Brace Hero", note: "2 goals in one match", icon: "trophy", unlocked: true, fresh: true },
  { id: "speed", name: "Speed Demon", note: "23+ km/h", icon: "bolt", unlocked: true },
  { id: "iron", name: "Iron Legs", note: "Full match ×5", icon: "check", unlocked: true },
  { id: "ranger", name: "Long Ranger", note: "Goal from 15m+", icon: "target", unlocked: true },
  { id: "team", name: "Team Player", note: "5 assists", icon: "users", unlocked: true },
  { id: "fox", name: "Fox in the Box", note: "6-yard goal", icon: "flame", unlocked: true },
  { id: "first", name: "First Whistle", note: "Her debut", icon: "star", unlocked: true },
  { id: "engine", name: "The Engine", note: "40 km in a season", icon: "replays", unlocked: true },
  { id: "playmaker", name: "Playmaker", note: "10 assists · 6 of 10", icon: "send", unlocked: false },
  { id: "boot", name: "Golden Boot", note: "Top scorer", icon: "trophy", unlocked: false },
  { id: "century", name: "Century Club", note: "100 sprints", icon: "bolt", unlocked: false },
  { id: "ever", name: "Ever-present", note: "Play all 12", icon: "calendar", unlocked: false },
];

export const keepsake = {
  filmTitle: "Maya's Spring",
  filmLength: "3:12",
  filmNote: "Auto-cut from her 12 best moments.",
  photo: 91,
  best: [
    { matchId: "m9", min: 58, title: "Near-post dart", sub: "vs Falcons · the winner" },
    { matchId: "m4", min: 66, title: "The solo run", sub: "@ Athletic · past two, finished low" },
    { matchId: "m9", min: 41, title: "23.4 km/h", sub: "Her fastest run of the season" },
    { matchId: "m7", min: 18, title: "Low drive", sub: "vs Comets · top corner" },
    { matchId: "m1", min: 62, title: "Her first assist", sub: "vs Harriers · the bench erupted" },
  ],
};

/* Last five results, newest last — goals are that player's, from the scorers. */
export const formFor = (playerId: string) =>
  matches
    .slice(0, 5)
    .reverse()
    .map((m) => ({
      id: m.id,
      result: m.result,
      goals: m.scorers.find((s) => s.id === playerId)?.g ?? 0,
    }));

/* Per-player content. Only the followed player has a full set in this mock —
   anyone else falls back to an honest empty state rather than borrowing hers. */
export const weekByPlayer: Record<string, typeof week> = { maya: week };
export const badgesByPlayer: Record<string, Badge[]> = { maya: badges };
export const keepsakeByPlayer: Record<string, typeof keepsake> = { maya: keepsake };
export const cardsByPlayer: Record<string, ShelfCard[]> = { maya: cards };

/* ---------- FAMILY ---------- */
export const circle = [
  { name: "Maya", role: "Player", initial: "M", color: "var(--amber)" },
  { name: "Dad", role: "Parent", initial: "D", color: "var(--our)" },
  { name: "Grandma", role: "Family", initial: "G", color: "var(--away)" },
  { name: "Coach Rae", role: "Coach", initial: "R", color: "var(--card-blue)" },
  { name: "Uncle Ben", role: "Family", initial: "B", color: "var(--heat)" },
];

export type FamilyPost = {
  id: string;
  kind: "photos" | "clip" | "card" | "milestone" | "text";
  who: string;
  initial: string;
  color: string;
  title: string;
  sub?: string;
  body?: string;
  photos?: number[];
  love: number;
  fire: number;
  comments: number;
  ago: string;
};

export const familyFeed: FamilyPost[] = [
  { id: "p1", kind: "photos", who: "Dad", initial: "D", color: "var(--our)", title: "Dad added 2 photos", sub: "to Maya's goal · 58'", photos: [21, 22], love: 4, fire: 2, comments: 6, ago: "2h" },
  { id: "p2", kind: "clip", who: "Coach Rae", initial: "R", color: "var(--card-blue)", title: "Coach shared the 41' sprint", sub: "\"Fastest she's run all season\"", love: 6, fire: 5, comments: 3, ago: "5h" },
  { id: "p3", kind: "milestone", who: "Maya", initial: "M", color: "var(--amber)", title: "Maya hit 7 goals this season", sub: "A new personal best", love: 12, fire: 9, comments: 4, ago: "1d" },
  { id: "p4", kind: "card", who: "Matchday", initial: "M9", color: "var(--card-navy)", title: "New card minted · Match 9", sub: "Maya's Matchday Card is ready", love: 8, fire: 3, comments: 2, ago: "1d" },
  { id: "p5", kind: "text", who: "Grandma", initial: "G", color: "var(--away)", title: "Grandma", body: "So proud of you sweetheart — can't wait to be there Saturday!", love: 5, fire: 1, comments: 1, ago: "2d" },
];

export const momentThread = {
  min: 58,
  title: "Maya makes it three",
  sub: "vs Falcons FC · left foot, near post",
  likers: "Dad, Grandma, Coach Rae +2",
  photos: [21, 23, 26],
  comments: [
    { who: "Grandma", initial: "G", color: "var(--away)", text: "That finish! I watched it four times.", ago: "5h" },
    { who: "Dad", initial: "D", color: "var(--our)", text: "The run started all the way from the halfway line.", ago: "4h" },
    { who: "Coach Rae", initial: "R", color: "var(--card-blue)", text: "Exactly the movement we worked on Tuesday. Proud of you.", ago: "2h" },
  ],
};
