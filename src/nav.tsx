import { createContext, useContext } from "react";

/* Route keys stay generic — never a person's name. */
export type TabKey = "home" | "replays" | "player" | "schedule" | "family";

export type Route = { screen: string; params?: any };

export type Nav = {
  push: (r: Route) => void;
  back: () => void;
  goTab: (t: TabKey) => void;
};

export const NavContext = createContext<Nav>({
  push: () => {},
  back: () => {},
  goTab: () => {},
});

export const useNav = () => useContext(NavContext);
