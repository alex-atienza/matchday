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
| **Home** | A cinematic hero (the weekend's story) flowing into a "Matchday" feed — pinned next match, goal replays, family reactions, photos, milestones |
| **Replays** | The latest match + the season list → a **Match Hub** (Highlights · Squad · Stats) → an immersive **replay player**, plus per-player profiles |
| **Maya** | The tab for the star player you follow — a locker hero, her weekly digest, and two sections: **Season** (form, totals, badges) · **Keepsake** (season film, best moments, order the book) |
| **Schedule** | The next match (countdown, venue, kit, weather, RSVP), the fixtures still to play, every result, and the **league table** |
| **Family** | The family circle + a shared feed — a composer, reactions → a **moment thread** and **Manage Circle** |

**Why the player gets its own tab:** it blends three ideas that were separate workflows in the Paper
file — *Maya's Locker* (profile & stats), *Maya's Week* (weekly recap) and *Season Keepsake* (film,
best moments, print). Keeping it distinct from **Family** matters:
Family is about **the people** around her (the circle, who's coming, shared photos and comments),
while this tab is about **the player** you're following. Mixing them made both feel muddy.

**The tab is named after the player — and that scales.** Nothing about "Maya" is hardcoded:

- The route key is generic (`TabKey = … | "player" | …`); only the *label* is personal.
- `followedIds` in [`src/squad.ts`](src/squad.ts) drives everything. `playerTabLabel()` returns the
  followed player's first name, or **"Players"** when a family follows more than one kid.
- Long names are handled: labels truncate past 9 characters (`shortName()`), and the hero headline
  drops from 58px to 44px for longer names so it never overflows.
- Following two players adds a **switcher** (jersey-number chips) above the content; the hero, form
  guide and season totals are already per-player, and week/keepsake are keyed by player id
  (`weekByPlayer`, `keepsakeByPlayer`) with honest **empty states** for players who don't have that
  content yet — never borrowing another player's.

Verified by temporarily following a second player named "Alexandra": the tab relabelled to
*Players*, the switcher appeared, her own stats and form rendered, and Keepsake showed its empty
state rather than Maya's film.

## On rating children

There are no per-player ratings anywhere in this product, and there should not be. The app is for
families watching their own kid play, not for scoring teenagers against one another. The collectible
**Matchday Cards** carried a 1–10 rating and were removed in full for that reason (and because they
did not land in review); the concept is parked, not cancelled — it may return for a different kind of
user who actually wants it. The match squad list also lost its per-player top-speed column: a bare
number down the right-hand edge of a list of children reads as a score, whatever the label says.

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
