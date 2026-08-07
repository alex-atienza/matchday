import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Matchday prototype — Vite + React.
// Relative base on build so it works under a GitHub Pages project path.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "./" : "/",
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
}));
