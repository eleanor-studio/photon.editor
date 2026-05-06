import { defineConfig } from "vite";

export default defineConfig({
  // Vite serves from project root by default.
  // three.js and photon-editor are resolved from node_modules automatically.
  build: {
    outDir: "dist",
  },
});
