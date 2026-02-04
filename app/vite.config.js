import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        models: resolve(__dirname, "models/index.html"),
        modelscomparison: resolve(__dirname, "models-comparison/index.html"),
        tonewoods: resolve(__dirname, "tonewoods/index.html"),
        dealers: resolve(__dirname, "dealers/index.html"),
      },
    },
  },
});
