import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { NavContext, type Nav, type Route, type TabKey } from "./nav";
import TabBar from "./components/TabBar";
import Home from "./tabs/Home";
import Replays from "./tabs/Replays";
import Player from "./tabs/Player";
import Schedule from "./tabs/Schedule";
import Family from "./tabs/Family";
import MatchHub from "./screens/MatchHub";
import ReplayPlayer from "./screens/ReplayPlayer";
import CardDetail from "./screens/CardDetail";
import MomentThread from "./screens/MomentThread";
import ManageCircle from "./screens/ManageCircle";
import PlayerProfile from "./screens/PlayerProfile";
import PhotoViewer from "./screens/PhotoViewer";
import DirectionSheet from "./components/DirectionSheet";

const IMMERSIVE = new Set(["replay", "photos"]);
const EASE = [0.32, 0.72, 0, 1] as const;

type Dir = "push" | "pop" | "tab";

function render(route: Route | undefined, tab: TabKey) {
  if (!route) {
    return tab === "home" ? (
      <Home />
    ) : tab === "replays" ? (
      <Replays />
    ) : tab === "player" ? (
      <Player />
    ) : tab === "schedule" ? (
      <Schedule />
    ) : (
      <Family />
    );
  }
  const p = route.params;
  switch (route.screen) {
    case "matchHub":
      return <MatchHub params={p} />;
    case "replay":
      return <ReplayPlayer params={p} />;
    case "cardDetail":
      return <CardDetail params={p} />;
    case "momentThread":
      return <MomentThread params={p} />;
    case "manageCircle":
      return <ManageCircle params={p} />;
    case "player":
      return <PlayerProfile params={p} />;
    case "photos":
      return <PhotoViewer params={p} />;
    default:
      return null;
  }
}

export default function App() {
  const [tab, setTab] = useState<TabKey>("home");
  const [stack, setStack] = useState<Route[]>([]);
  const [dir, setDir] = useState<Dir>("tab");
  const reduce = useReducedMotion();

  const nav: Nav = useMemo(
    () => ({
      push: (r) => {
        setDir("push");
        setStack((s) => [...s, r]);
      },
      back: () => {
        setDir("pop");
        setStack((s) => s.slice(0, -1));
      },
      goTab: (t) => {
        setDir("tab");
        setStack([]);
        setTab(t);
      },
    }),
    [],
  );

  const top = stack[stack.length - 1];
  const immersive = top && IMMERSIVE.has(top.screen) ? top : null;
  const stageStack = immersive ? stack.slice(0, -1) : stack;
  const stageTop = stageStack[stageStack.length - 1];
  const stageKey = stageTop ? `s${stageStack.length}:${stageTop.screen}` : `t:${tab}`;

  const variants = {
    enter: (d: Dir) =>
      reduce
        ? { opacity: 0 }
        : d === "tab"
          ? { opacity: 0, scale: 0.985 }
          : d === "pop"
            ? { x: "-26%", opacity: 0.5 }
            : { x: "100%", opacity: 1 },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: reduce ? 0.2 : 0.36, ease: EASE },
    },
    exit: (d: Dir) =>
      reduce
        ? { opacity: 0, transition: { duration: 0.15 } }
        : d === "tab"
          ? { opacity: 0, scale: 1.01, transition: { duration: 0.2 } }
          : d === "pop"
            ? { x: "100%", opacity: 1, transition: { duration: 0.34, ease: EASE } }
            : { x: "-22%", opacity: 0.5, transition: { duration: 0.34, ease: EASE } },
  };

  return (
    <div className="app-viewport">
      <div className="phone">
        <NavContext.Provider value={nav}>
          <div className="body">
            <div className="stage">
              <AnimatePresence initial={false} custom={dir} mode="sync">
                <motion.div
                  key={stageKey}
                  className="stage-screen"
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {render(stageTop, tab)}
                </motion.div>
              </AnimatePresence>
            </div>

            <TabBar active={tab} onChange={nav.goTab} />

            <AnimatePresence>
              {immersive && (
                <motion.div
                  className="overlay"
                  initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
                  animate={{ opacity: 1, scale: 1, transition: { duration: 0.3, ease: EASE } }}
                  exit={{ opacity: 0, scale: reduce ? 1 : 0.97, transition: { duration: 0.22, ease: EASE } }}
                >
                  {render(immersive, tab)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <DirectionSheet />
        </NavContext.Provider>
      </div>
    </div>
  );
}
