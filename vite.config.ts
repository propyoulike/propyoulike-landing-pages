import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: "/", // Important for BigRock hosting
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    outDir: "dist",
    sourcemap: false,
    assetsInlineLimit: 4096,
    cssCodeSplit: true,

    /** 🌟 HERE IS THE MAGIC */
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router-dom"],
          form: ["react-hook-form", "@hookform/resolvers"],
          charts: ["recharts"],
	  radixAccordion: ["@radix-ui/react-accordion"],
	  radixDialog: ["@radix-ui/react-dialog"],
	  radixTabs: ["@radix-ui/react-tabs"],
	  radixSelect: ["@radix-ui/react-select"],
	  radixPopover: ["@radix-ui/react-popover"],
          date: ["date-fns"],
          animation: ["framer-motion"],
        },
      },
    },

    /**
     * Increase chunk warning because we control it manually now
     */
    chunkSizeWarningLimit: 800,
  },

  preview: {
    port: 4173,
  },
}));
