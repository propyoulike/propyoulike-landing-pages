/**
 * ============================================================
 * DEV-ONLY GLOBAL ACCESS GUARD
 * ============================================================
 *
 * PURPOSE
 * ------------------------------------------------------------
 * Prevent sections/templates from accidentally accessing
 * illegal globals like `project`, `builder`, `slug`.
 *
 * This catches architecture violations EARLY in DEV.
 * NO-OP in PROD.
 *
 * ============================================================
 */

export function forbidGlobals(names: string[]) {
  if (!import.meta.env.DEV) return;

  for (const name of names) {
    if ((globalThis as any)[name] !== undefined) {
      throw new Error(
        `[ARCHITECTURE VIOLATION]
Illegal global access detected: "${name}"

Sections must NOT access global project identity.
Use context/providers instead.`
      );
    }
  }
}
