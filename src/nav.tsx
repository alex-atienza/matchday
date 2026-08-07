import { createContext, useContext } from "react";

export type TabKey = "home" | "replays" | "cards" | "family";

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
