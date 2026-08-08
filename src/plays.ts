/* Replay choreography.
   Coordinates live in the pitch's own space: x 0–100, y 0–150 (portrait).
   We attack the TOP goal (mouth ≈ x34–66, y8); we defend the BOTTOM (y142). */

export type Pt = [number, number];
export type PlayKind = "goal" | "assist" | "sprint" | "save" | "conceded";

export type Play = {
  kind: PlayKind;
  /** the build-up — drawn dashed in amber */
  run: Pt[];
  /** the strike/pass — drawn solid in sprint-heat; starts at run's last point */
  strike?: Pt[];
  /** Maya's dot; when mayaFollows she travels the run and stops at the strike */
  maya: Pt;
  mayaFollows?: boolean;
  mates: Pt[];
  foes: Pt[];
};

export const PLAYS: Record<string, Play> = {
  /* ---------- Maya scoring ---------- */
  cutback: {
    kind: "goal",
    run: [[74, 62], [82, 40], [86, 24]],
    strike: [[86, 24], [54, 30], [40, 11]],
    maya: [54, 30],
    mates: [[40, 52], [62, 46], [30, 74], [66, 80]],
    foes: [[48, 22], [64, 34], [36, 40], [56, 60]],
  },
  nearPost: {
    kind: "goal",
    run: [[24, 92], [30, 66], [38, 44]],
    strike: [[38, 44], [40, 11]],
    maya: [24, 92],
    mayaFollows: true,
    mates: [[58, 30], [66, 58], [46, 78], [72, 86]],
    foes: [[34, 26], [52, 40], [28, 58], [60, 72]],
  },
  solo: {
    kind: "goal",
    run: [[50, 76], [46, 62], [56, 48], [48, 34]],
    strike: [[48, 34], [60, 11]],
    maya: [50, 76],
    mayaFollows: true,
    mates: [[70, 44], [30, 50], [62, 70], [38, 88]],
    foes: [[44, 58], [54, 42], [58, 28], [36, 36]],
  },
  lowDrive: {
    kind: "goal",
    run: [[44, 84], [46, 62], [48, 48]],
    strike: [[48, 48], [36, 11]],
    maya: [44, 84],
    mayaFollows: true,
    mates: [[64, 44], [28, 58], [58, 72], [36, 96]],
    foes: [[42, 36], [54, 50], [32, 66], [62, 60]],
  },
  toePoke: {
    kind: "goal",
    run: [[66, 40], [58, 26]],
    strike: [[58, 26], [46, 11]],
    maya: [58, 26],
    mates: [[38, 34], [70, 52], [30, 66], [60, 74]],
    foes: [[50, 18], [42, 28], [64, 30], [34, 48]],
  },

  /* ---------- teammates scoring ---------- */
  header: {
    kind: "goal",
    run: [[92, 10], [74, 16]],
    strike: [[74, 16], [56, 20], [46, 11]],
    maya: [40, 34],
    mates: [[56, 20], [62, 30], [34, 56], [68, 66]],
    foes: [[48, 16], [52, 26], [40, 44], [64, 50]],
  },
  freeKick: {
    kind: "goal",
    run: [[50, 52], [50, 46]],
    strike: [[50, 46], [58, 26], [64, 11]],
    maya: [42, 50],
    mates: [[36, 48], [58, 52], [30, 70], [68, 74]],
    foes: [[44, 34], [50, 34], [56, 34], [50, 18]],
  },
  teamMove: {
    kind: "goal",
    run: [[20, 108], [40, 92], [30, 70], [56, 58]],
    strike: [[56, 58], [48, 30], [56, 11]],
    maya: [30, 70],
    mates: [[40, 92], [56, 58], [48, 30], [70, 64]],
    foes: [[34, 80], [52, 72], [44, 46], [62, 36]],
  },

  /* ---------- Maya assisting ---------- */
  assistCross: {
    kind: "assist",
    run: [[78, 76], [84, 52], [84, 34]],
    strike: [[84, 34], [56, 22], [50, 11]],
    maya: [78, 76],
    mayaFollows: true,
    mates: [[56, 22], [46, 40], [34, 64], [64, 88]],
    foes: [[70, 44], [52, 32], [38, 50], [60, 66]],
  },
  assistSquare: {
    kind: "assist",
    run: [[36, 88], [42, 62], [46, 44]],
    strike: [[46, 44], [62, 34], [58, 11]],
    maya: [36, 88],
    mayaFollows: true,
    mates: [[62, 34], [28, 56], [70, 70], [44, 100]],
    foes: [[40, 52], [56, 46], [30, 70], [66, 54]],
  },

  /* ---------- Maya running ---------- */
  sprintLeft: {
    kind: "sprint",
    run: [[22, 124], [26, 100], [34, 74], [42, 52]],
    maya: [22, 124],
    mayaFollows: true,
    mates: [[56, 40], [68, 64], [44, 90], [74, 104]],
    foes: [[36, 60], [50, 78], [28, 92], [62, 48]],
  },
  sprintRight: {
    kind: "sprint",
    run: [[80, 120], [82, 96], [76, 70], [70, 46]],
    maya: [80, 120],
    mayaFollows: true,
    mates: [[40, 44], [30, 70], [54, 86], [24, 100]],
    foes: [[66, 62], [58, 84], [74, 96], [48, 52]],
  },
  sprintRecovery: {
    kind: "sprint",
    run: [[54, 40], [50, 66], [46, 94], [44, 118]],
    maya: [54, 40],
    mayaFollows: true,
    mates: [[30, 84], [66, 76], [38, 110], [70, 116]],
    foes: [[48, 58], [40, 82], [58, 100], [34, 46]],
  },

  /* ---------- defending ---------- */
  save: {
    kind: "save",
    run: [[60, 76], [56, 100], [52, 116]],
    strike: [[52, 116], [50, 138]],
    maya: [38, 92],
    mates: [[44, 120], [62, 124], [30, 104], [50, 141]],
    foes: [[56, 100], [64, 86], [40, 78], [70, 110]],
  },
  saveHigh: {
    kind: "save",
    run: [[38, 84], [44, 106]],
    strike: [[44, 106], [56, 132]],
    maya: [64, 96],
    mates: [[36, 122], [58, 118], [26, 100], [50, 141]],
    foes: [[44, 106], [52, 90], [30, 88], [66, 118]],
  },
  conceded: {
    kind: "conceded",
    run: [[44, 70], [50, 96], [54, 114]],
    strike: [[54, 114], [60, 139]],
    maya: [36, 84],
    mates: [[40, 118], [58, 126], [28, 100], [50, 141]],
    foes: [[50, 96], [62, 88], [38, 76], [66, 106]],
  },
  penalty: {
    kind: "conceded",
    run: [[50, 116], [50, 121]],
    strike: [[50, 121], [40, 139]],
    maya: [50, 92],
    mates: [[42, 98], [58, 98], [34, 104], [50, 141]],
    foes: [[50, 121], [46, 96], [54, 96], [62, 100]],
  },
};

const FALLBACK: Record<string, string> = {
  our: "lowDrive",
  their: "conceded",
  sprint: "sprintLeft",
  save: "save",
};

export const getPlay = (play: string | undefined, kind: string): Play =>
  PLAYS[play ?? ""] ?? PLAYS[FALLBACK[kind] ?? "lowDrive"];

/** Convert pitch-space y (0–150) to a CSS percentage. */
export const pctY = (y: number) => `${(y / 150) * 100}%`;
export const pctX = (x: number) => `${x}%`;
export const toD = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");

/* ---------- timing ---------- */
export const BUILD = 0.95;
export const HOLD = 0.16;
export const SHOT = 0.4;

export const playDuration = (p: Play) =>
  p.strike && p.strike.length > 1 ? BUILD + HOLD + SHOT : BUILD;

/** Keyframes for the travelling ball: along the run, a beat, then the strike. */
export function ballFrames(p: Play) {
  const total = playDuration(p);
  const xs: string[] = [];
  const ys: string[] = [];
  const times: number[] = [];
  const n = p.run.length - 1;
  p.run.forEach((pt, i) => {
    xs.push(pctX(pt[0]));
    ys.push(pctY(pt[1]));
    times.push(n === 0 ? 0 : (i / n) * (BUILD / total));
  });
  if (p.strike && p.strike.length > 1) {
    const holdT = (BUILD + HOLD) / total;
    xs.push(xs[xs.length - 1]);
    ys.push(ys[ys.length - 1]);
    times.push(holdT);
    const rest = p.strike.slice(1);
    rest.forEach((pt, j) => {
      xs.push(pctX(pt[0]));
      ys.push(pctY(pt[1]));
      times.push(holdT + ((j + 1) / rest.length) * (SHOT / total));
    });
  }
  return { xs, ys, times, total };
}

/** Keyframes for Maya when she carries the ball: the run, then she holds. */
export function mayaFrames(p: Play) {
  const total = playDuration(p);
  const xs: string[] = [];
  const ys: string[] = [];
  const times: number[] = [];
  const n = p.run.length - 1;
  p.run.forEach((pt, i) => {
    xs.push(pctX(pt[0]));
    ys.push(pctY(pt[1]));
    times.push(n === 0 ? 0 : (i / n) * (BUILD / total));
  });
  if (BUILD / total < 1) {
    xs.push(xs[xs.length - 1]);
    ys.push(ys[ys.length - 1]);
    times.push(1);
  }
  return { xs, ys, times, total };
}

/** Which net the ball ends up in (if any). */
export const strikeEnd = (p: Play): Pt | null =>
  p.strike && p.strike.length > 1 ? p.strike[p.strike.length - 1] : null;
