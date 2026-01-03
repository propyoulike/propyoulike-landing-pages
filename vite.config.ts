// vite.config.ts

/**
 * ============================================================
 * Vite Configuration — Canonical Runtime Build (LOCKED)
 * ============================================================
 *
 * GUARANTEES
 * ------------------------------------------------------------
 * 1. Single React instance (no invalid hook calls)
 * 2. Multi-entry support (app + projectEntry)
 * 3. Deterministic asset paths
 * 4. No phantom /shared chunks
 * 5. BigRock + Cloudflare safe
 *
 * ============================================================
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/* ============================================================
   DEBUG SWITCH
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
    /* --------------------------------------------------------
       BASE
       --------------------------------------------------------
       MUST be "/" because:
       - prerendered HTML uses absolute paths
       - BigRock does not support sub-path rewrites
    -------------------------------------------------------- */
    base: "/",

    /* --------------------------------------------------------
       DEV SERVER
    -------------------------------------------------------- */
    server: {
      host: "::",
      port: 5173,
    },

    /* --------------------------------------------------------
       PLUGINS
    -------------------------------------------------------- */
    plugins: [react()],

    /* --------------------------------------------------------
       MODULE RESOLUTION (CRITICAL)
       --------------------------------------------------------
       🔒 HARD SINGLE-REACT GUARANTEE
    -------------------------------------------------------- */
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),

        // 🔑 DO NOT REMOVE — prevents duplicate React copies
        react: path.resolve(__dirname, "./node_modules/react"),
        "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
        "react/jsx-runtime": path.resolve(
          __dirname,
          "./node_modules/react/jsx-runtime"
        ),
      },
      dedupe: ["react", "react-dom"],
    },

    /* --------------------------------------------------------
       BUILD
    -------------------------------------------------------- */
    build: {
      manifest: true,            // REQUIRED for prerender
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: false,
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 800,

      /* ======================================================
         🔒 CRITICAL FIX (DO NOT REMOVE)
         ------------------------------------------------------
         Prevents Vite from injecting <link rel="modulepreload">
         which caused stale hash references like:
         /assets/AppProviders.CBWPnK2d.js (404)
      ====================================================== */
      modulePreload: false,

      /* ------------------------------------------------------
         MULTI ENTRY
         ------------------------------------------------------
         - index.html → main SPA shell
         - projectEntry.tsx → prerender hydration entry
      ------------------------------------------------------ */
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
          projectEntry: path.resolve(
            __dirname,
            "src/projectEntry.tsx"
          ),
        },

        output: {
          /* --------------------------------------------------
             ENTRY FILES
          -------------------------------------------------- */
          entryFileNames(chunk) {
            if (chunk.name === "main") {
              return "assets/main.js";
            }

            if (chunk.name === "projectEntry") {
              return "assets/projectEntry.[hash].js";
            }

            return "assets/[name].[hash].js";
          },

          /* --------------------------------------------------
             ALL CHUNKS LIVE IN /assets
             (NO /shared — prevents missing files)
          -------------------------------------------------- */
          chunkFileNames: "assets/[name].[hash].js",

          /* --------------------------------------------------
             ASSETS
          -------------------------------------------------- */
          assetFileNames(asset) {
            if (asset.name === "favicon.ico") {
              return "favicon.ico";
            }
            return "assets/[name].[ext]";
          },

          /* --------------------------------------------------
             MANUAL CHUNKS (SAFE + STABLE)
          -------------------------------------------------- */
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
    },

    /* --------------------------------------------------------
       PREVIEW
    -------------------------------------------------------- */
    preview: {
      port: 4173,
    },
  };
});
