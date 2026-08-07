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
