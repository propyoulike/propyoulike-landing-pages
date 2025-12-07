import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

import { componentTagger } from "lovable-tagger";

// -------------------------------------------------------
// AUTO DISCOVER PROJECT SLUGS FROM content/projects
// -------------------------------------------------------

function getProjectSlugs() {
  const base = path.resolve(__dirname, "src/content/projects");
  const slugs: string[] = [];

  for (const builder of fs.readdirSync(base)) {
    const builderDir = path.join(base, builder);
    if (!fs.statSync(builderDir).isDirectory()) continue;

    for (const projectSlug of fs.readdirSync(builderDir)) {
      const projectDir = path.join(builderDir, projectSlug);

      if (fs.existsSync(path.join(projectDir, "index.json"))) {
        slugs.push(`${builder}-${projectSlug}`);
      }
    }
  }

  return slugs;
}

const projectSlugs = getProjectSlugs();

// -------------------------------------------------------
// ❌ BEFORE (WRONG):
// multiEntries[slug] = "project.html"
// Produced one HTML per project → **not needed**.
// -------------------------------------------------------
// ✅ AFTER (FIXED):
// Only TWO entry points:
// 1. index.html (main site)
// 2. project.html (for ALL microsites)
// -------------------------------------------------------

const multiEntries: Record<string, string> = {
  main: path.resolve(__dirname, "index.html"),

  // ⭐ NEW: single microsite entry
  // ❗ Highlighted Change
  project: path.resolve(__dirname, "project.html"),
  projectEntry: path.resolve(__dirname, "src/projectEntry.tsx"),
};

// -------------------------------------------------------
// FINAL VITE CONFIG
// -------------------------------------------------------

export default defineConfig(({ mode }) => ({
  base: "/",

  server: {
    host: "::",
    port: 5173,
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    outDir: "dist",
    sourcemap: false,
    emptyOutDir: true,
    assetsInlineLimit: 4096,
    cssCodeSplit: true,

    rollupOptions: {
      input: multiEntries,

      output: {
        // ------------------------------------------------------
        // ❌ BEFORE (WRONG):
        // entryFileNames(`${slug}/assets/[name].[hash].js`)
        //
        // This produced:
        //   dist/provident-sunworth-city/assets/..js
        //
        // Your uploaded site loads from:
        //   /projectEntry.js
        //   /shared/*.js
        //   /assets/main.css
        // ------------------------------------------------------
        // ✅ AFTER (FIXED):
        // One entry for main site and one for ALL microsites.
        // ------------------------------------------------------

        entryFileNames(chunk) {
          // ⭐ Highlighted Change
          if (chunk.name === "main") return "assets/main.js";
          if (chunk.name === "projectEntry") return "projectEntry.js"; // ⭐ FIXED
          return "shared/[name].[hash].js"; // ⭐ FIXED
        },

        // All lazy-loaded chunks go to shared/
        chunkFileNames() {
          return "shared/[name].[hash].js"; // ⭐ FIXED
        },

        // ------------------------------------------------------
        // FIXED ASSET OUTPUT — consistent with your live site
        // ------------------------------------------------------
        assetFileNames(asset) {
          // ⭐ NEW FIX: favicon at top-level
          if (asset.name?.includes("favicon")) return "favicon.ico";

          // ⭐ NEW FIX: everything else in /assets/
          return "assets/[name].[ext]";
        },

        // KEEP YOUR MANUAL CHUNKING
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

    chunkSizeWarningLimit: 800,
  },

  preview: {
    port: 4173,
  },
}));
