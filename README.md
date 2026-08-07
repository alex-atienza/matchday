# Matchday

A phone-first **soccer-family companion app** — a design prototype where a family relives the
game together: replay it, talk about it, and celebrate the goals, with the kid feeling like a pro.

> **Premise:** every player and the ball carry a tracker, so a match becomes a replayable,
> shareable moment for parents and kids — broadcast gravity for a U15 game.

**▶ Live demo:** https://alex-atienza.github.io/matchday/
*(phone-first — best viewed in a narrow window or your phone.)*

---

## The four tabs

| Tab | What's there |
|---|---|
| **Home** | A "Matchday" feed — pinned next match, goal replays, family reactions, cards minted, photos, milestones |
| **Replays** | The latest match + the season list → a **Match Hub** → an immersive **replay player** |
| **Cards** | A season shelf of collectible **Matchday Cards** → a card detail with stats, speed zones & goal breakdown |
| **Family** | The family circle + a shared feed → a **moment thread** with photos and comments |

## Highlights

- **"Under the Lights"** design system — floodlit, broadcast-inspired: instrument black, one amber signal, skeuomorphic grass pitches with a hand-tuned field grain.
- **The goal, told clearly** — in the replay, the ball rolls the run up to Maya, she strikes, and a bold shot line flies into the top **net**, which **ripples** on impact.
- **Goal celebration** — confetti + shockwave, a screen flash, a springy **"GOAL!"** with the scoreline, a crowd-roar equalizer, and a *Watch again*.
- Motion throughout — iOS-style page transitions, staggered entrances, count-up stats, a sliding tab-bar indicator — all reduced-motion aware.

## Tech

Vite · React · TypeScript · framer-motion. No backend — all content is local mock data.

## Run locally

```bash
npm install
npm run dev      # → http://localhost:5173
```

```bash
npm run build    # production build → dist/
```

## Notes

This is an interactive **prototype**. Photos are **LoremFlickr placeholders** (keyword `soccer`) and
would be swapped for licensed or first-party images in a real build; all names, matches, and stats
are fictional sample data.
