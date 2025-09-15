import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import os from "node:os";

const repoRoot = path.resolve(__dirname, "../../"); // repo-roden
const coreSrc = path.resolve(__dirname, "../../src"); // domæne-koden

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@core": coreSrc,
    },
  },
  server: {
    fs: {
      // Tillad import uden for app-mappen (så @core virker)
      allow: [repoRoot, coreSrc],
    },
  },
  // *** Workaround: slå prebundling fra for at komme i gang ***
  optimizeDeps: {
    disabled: true,
  },
  // Flyt Vite-cache væk fra OneDrive/lange stier
  cacheDir: path.join(os.tmpdir(), "vite-unoweb-cache"),
});
