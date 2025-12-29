// src/lib/analytics/builderIds.ts

/**
 * =====================================================
 * CANONICAL BUILDER IDS (FROZEN)
 * =====================================================
 *
 * Purpose:
 * - Stable identifiers for builders/developers
 * - Used in analytics, attribution, reporting
 *
 * Rules:
 * - snake_case values
 * - Do NOT rename once released (breaking change)
 * - UI labels must NEVER be used
 */

export enum BuilderId {
  PROVIDENT = "provident",
  PRESTIGE = "prestige",
  SOBHA = "sobha",
  BRIGADE = "brigade",
  GODREJ = "godrej",
  LODHA = "lodha",
}
