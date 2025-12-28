// vite.config.ts

/**
 * ============================================================
 * Vite Configuration — Canonical Runtime Build
 * ============================================================
 *
 * GOALS
 * ------------------------------------------------------------
 * 1. Guarantee SINGLE React instance (critical for hooks)
 * 2. Support multiple real entry points (app + projectEntry)
 * 3. Prevent chunk duplication across entries
 * 4. Keep build deterministic and debuggable
 *
 * THIS CONFIG IS ARCHITECTURALLY LOCKED
 * ------------------------------------------------------------
 * - Changing React-related settings without understanding
 *   WILL reintroduce Invalid Hook Call errors.
 *
 * ============================================================
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/* ============================================================
   🔑 BUILD LOGGING SWITCH (SILENT BY DEFAULT)
============================================================ */
const DEBUG_BUILD = process.env.VITE_DEBUG_BUILD === "true";

function buildLog(...args: any[]) {
  if (DEBUG_BUILD) {
    console.log("[VITE]", ...args);
  }
}

/* ============================================================
   CONFIG
============================================================ */
export default defineConfig(({ mode }) => {
  buildLog("Build mode:", mode);

  return {
    /* ---------------------------------------------------------
       BASE
       ---------------------------------------------------------
       Must be "/" because:
       - projectEntry.js is referenced from prerendered HTML
       - absolute asset paths are required in production
    --------------------------------------------------------- */
    base: "/",

    /* ---------------------------------------------------------
       DEV SERVER
    --------------------------------------------------------- */
    server: {
      host: "::",
      port: 5173,
    },

    /* ---------------------------------------------------------
       PLUGINS
       ---------------------------------------------------------
       ❗ NO dev-only tagging plugins
       ❗ Keep transform pipeline minimal
    --------------------------------------------------------- */
    plugins: [
      react(),
    ],

    /* ---------------------------------------------------------
       MODULE RESOLUTION (CRITICAL)
       ---------------------------------------------------------
       🔒 SINGLE REACT GUARANTEE
    --------------------------------------------------------- */
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),

        // 🔑 HARD DEDUPE — DO NOT REMOVE
        react: path.resolve(__dirname, "./node_modules/react"),
        "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
        "react/jsx-runtime": path.resolve(
          __dirname,
          "./node_modules/react/jsx-runtime"
        ),
      },

      // Extra safety: force dependency dedupe
      dedupe: ["react", "react-dom"],
    },

    /* ---------------------------------------------------------
       BUILD CONFIG
    --------------------------------------------------------- */
    build: {
      manifest: true,          // 🔒 REQUIRED FOR PRERENDER
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: false,
      cssCodeSplit: true,
      assetsInlineLimit: 4096,

      /* -------------------------------------------------------
         MULTI-ENTRY STRATEGY
         -------------------------------------------------------
         Allowed entries:
         - index.html → main app shell
         - projectEntry.tsx → prerender hydration boundary
      ------------------------------------------------------- */
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
          projectEntry: path.resolve(
            __dirname,
            "src/projectEntry.tsx"
          ),
        },

        output: {
          /* ---------------------------------------------------
             ENTRY OUTPUT NAMING
          --------------------------------------------------- */
entryFileNames(chunk) {
  if (chunk.name === "main") return "assets/main.js";

  // 🔒 projectEntry MUST be hashed
  if (chunk.name === "projectEntry")
    return "assets/projectEntry.[hash].js";

  return "shared/[name].[hash].js";
},

          /* ---------------------------------------------------
             SHARED CHUNKS
          --------------------------------------------------- */
          chunkFileNames: "shared/[name].[hash].js",

          assetFileNames(asset) {
            if (asset.name === "favicon.ico") return "favicon.ico";
            return "assets/[name].[ext]";
          },

          /* ---------------------------------------------------
             MANUAL CHUNKS (SAFE VERSION)
             ---------------------------------------------------
             ❗ React is isolated AND shared
             ❗ No duplicate React per entry
          --------------------------------------------------- */
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (
                id.includes("react") ||
                id.includes("react-dom")
              ) {
                return "react";
              }

              if (id.includes("react-router-dom")) {
                return "router";
              }

              if (id.includes("framer-motion")) {
                return "animation";
              }

              if (id.includes("@radix-ui")) {
                return "radix";
              }

              if (id.includes("date-fns")) {
                return "date";
              }
            }
          },
        },
      },

      chunkSizeWarningLimit: 800,
    },

    /* ---------------------------------------------------------
       PREVIEW
    --------------------------------------------------------- */
    preview: {
      port: 4173,
    },
  };
});
