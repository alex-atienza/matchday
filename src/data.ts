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
  kind: "our" | "their" | "sprint";
  title: string;
  sub: string;
};

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
    moments: [
      { min: 12, kind: "our", title: "GOAL · Maya finishes the cutback", sub: "Assist Jess · 2 photos · 6 replies" },
      { min: 30, kind: "our", title: "GOAL · Jess doubles it", sub: "Header from the corner · 1 photo" },
      { min: 34, kind: "their", title: "GOAL · Falcons pull one back", sub: "Counter-attack" },
      { min: 41, kind: "sprint", title: "SPRINT · 23.4 km/h — season best", sub: "40m recovery run · 1 reply" },
      { min: 58, kind: "our", title: "GOAL · Maya makes it three", sub: "Left foot, near post · 4 photos" },
      { min: 70, kind: "their", title: "GOAL · Falcons late reply", sub: "Set piece" },
    ],
  },
  {
    id: "m8", opponent: "Rangers", date: "Sat, May 11", result: "D", score: "1–1", home: false,
    goals: 0, assists: 1, topKmh: 22.1, photos: 2,
    moments: [
      { min: 22, kind: "our", title: "GOAL · Priya taps in Maya's cross", sub: "Assist Maya" },
      { min: 63, kind: "their", title: "GOAL · Rangers equalize", sub: "Penalty" },
    ],
  },
  {
    id: "m7", opponent: "Comets", date: "Sat, May 4", result: "W", score: "2–0", home: true,
    goals: 1, assists: 0, topKmh: 22.8, photos: 4,
    moments: [
      { min: 18, kind: "our", title: "GOAL · Maya, low drive", sub: "Top corner" },
      { min: 55, kind: "our", title: "GOAL · Team move, Sofia finishes", sub: "9-pass build-up" },
    ],
  },
  {
    id: "m6", opponent: "United", date: "Sat, Apr 27", result: "W", score: "1–0", home: false,
    goals: 0, assists: 1, topKmh: 21.9, photos: 1, moments: [],
  },
  {
    id: "m5", opponent: "Kestrels", date: "Sat, Apr 20", result: "L", score: "2–3", home: true,
    goals: 1, assists: 1, topKmh: 23.0, photos: 3, moments: [],
  },
  {
    id: "m4", opponent: "Athletic", date: "Sat, Apr 13", result: "W", score: "4–1", home: false,
    goals: 2, assists: 1, topKmh: 22.5, photos: 5, moments: [],
  },
  {
    id: "m3", opponent: "Rovers", date: "Sat, Apr 6", result: "W", score: "3–1", home: true,
    goals: 1, assists: 0, topKmh: 21.7, photos: 2, moments: [],
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

export type Card = {
  id: string;
  matchId?: string;
  rating?: number;
  label: string;
  result?: string;
  locked?: boolean;
};

export const cards: Card[] = [
  { id: "M9", matchId: "m9", rating: 9.2, label: "PB · BRACE", result: "W 3–2" },
  { id: "M8", matchId: "m8", rating: 7.8, label: "ASSIST", result: "D 1–1" },
  { id: "M7", matchId: "m7", rating: 8.1, label: "CLEAN", result: "W 2–0" },
  { id: "M6", matchId: "m6", rating: 7.4, label: "4.8 KM", result: "W 1–0" },
  { id: "M5", matchId: "m5", rating: 8.0, label: "GOAL", result: "L 2–3" },
  { id: "M4", matchId: "m4", rating: 9.0, label: "BRACE", result: "W 4–1" },
  { id: "M3", matchId: "m3", rating: 7.9, label: "GOAL", result: "W 3–1" },
  { id: "M2", rating: 7.2, label: "SOLID", result: "D 0–0" },
  { id: "M1", rating: 7.5, label: "FIRST GAME", result: "W 2–1" },
  { id: "M10", label: "SAT 9 AM", locked: true },
  { id: "M11", label: "—", locked: true },
  { id: "M12", label: "—", locked: true },
];

export const cardDetail = {
  id: "M9",
  opponent: "Falcons FC",
  result: "W 3–2",
  date: "Sat, May 18",
  rating: 9.2,
  stats: [
    { label: "Goals", value: "2" },
    { label: "Assists", value: "0" },
    { label: "Shots", value: "4" },
    { label: "Pass %", value: "88" },
    { label: "Distance", value: "4.9 km" },
    { label: "Top km/h", value: "23.4" },
  ],
  zones: [
    { label: "Walk", pct: 38, color: "var(--away)" },
    { label: "Jog", pct: 34, color: "var(--our)" },
    { label: "Run", pct: 20, color: "var(--amber)" },
    { label: "Sprint", pct: 8, color: "var(--heat)" },
  ],
  goals: [
    { min: 12, title: "The cutback", desc: "Jess drives the byline and pulls it back; Maya sweeps it first-time into the far corner." },
    { min: 58, title: "Near-post dart", desc: "A run in behind the full-back, left foot across the keeper — the winner." },
  ],
};

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
