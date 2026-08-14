import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ThemeSwitch from "./components/ThemeSwitch";
import { applyThemeToDom, initialTheme, ThemeProvider } from "./theme";
import "./index.css";

// Set the direction before the first paint so there is no flash of the other one.
applyThemeToDom(initialTheme());

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
      <ThemeSwitch />
    </ThemeProvider>
  </React.StrictMode>,
);
