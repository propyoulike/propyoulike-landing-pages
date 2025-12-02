import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/", // ensure asset URLs are root-relative (important for BigRock root hosting)
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    // keep inline limit small so large images are emitted as separate files
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    rollupOptions: {
      // you can add manualChunks here for large libs if needed
      // manualChunks(id) { ... }
    },
  },
  preview: {
    port: 4173,
  },
}));
