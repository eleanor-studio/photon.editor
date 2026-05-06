import { defineConfig } from "vite";

export default defineConfig({
  base: "/photon.editor/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
