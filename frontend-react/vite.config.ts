import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Set Brave as the default browser for Vite open
process.env.BROWSER = "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    open: true,
    hmr: {
      overlay: false,
    },
  proxy: {
    "/summarize": {
      target: "http://localhost:5000",
      changeOrigin: true,
    },
    "/quiz": {
      target: "http://localhost:5000",
      changeOrigin: true,
    },
  }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
