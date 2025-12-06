// src/components/widgets/HomeSizeAdvisor/calculator.ts
import { HouseholdInput, LifestyleInput, TenureInput, CalculatorOutput, Recommendation, Applicant } from "./types";

function roomsNeeded(hh: HouseholdInput, lifestyle: LifestyleInput): number {
  let rooms = 1; // master bedroom
  rooms += Math.ceil((hh.adults - 2) / 2);
  rooms += Math.ceil(hh.kids / 2);
  if (hh.elderly > 0) rooms += 1;
  if (lifestyle.wfh) rooms += 1;
  if (lifestyle.guests === "frequent") rooms += 1;
  return Math.max(2, rooms);
}

function maxTenureAllowedFor(primary: Applicant, coApplicant: Applicant | null): number {
  const maxAge = 60;
  const primaryTenure = Math.max(5, maxAge - primary.age);
  if (coApplicant !== null) {
    const coTenure = Math.max(5, maxAge - coApplicant.age);
    return Math.min(primaryTenure, coTenure);
  }
  return Math.min(primaryTenure, 30);
}

function generateCombo(rooms: number): string[] {
  if (rooms <= 4) return ["3 BHK Royale"];
  if (rooms <= 6) return ["3 BHK", "3 BHK"];
  return ["3 BHK Royale", "3 BHK"];
}

function comboCapacity(combo: string): number {
  const parts = combo.split(" + ");
  return parts.reduce((sum, part) => {
    if (part.includes("Royale")) return sum + 4;
    if (part.includes("3 BHK")) return sum + 3;
    if (part.includes("2 BHK")) return sum + 2;
    return sum + 3;
  }, 0);
}

function buildRationale(rooms: number, lifestyle: LifestyleInput, tenure: number): string[] {
  const reasons: string[] = [];
  if (rooms >= 3) reasons.push("Adequate space for family");
  if (lifestyle.wfh) reasons.push("Includes home office space");
  if (lifestyle.guests === "frequent") reasons.push("Guest accommodation considered");
  if (tenure >= 20) reasons.push("Long-term investment friendly");
  return reasons;
}

export function calculateRecommendation(
  hh: HouseholdInput,
  lifestyle: LifestyleInput,
  tenure: TenureInput
): CalculatorOutput {
  const rooms = roomsNeeded(hh, lifestyle);

  const maxTenureAllowed = maxTenureAllowedFor(tenure.primary, tenure.coApplicant ?? null);

  // multi-unit suggestion
  const multiUnitSuggestion = rooms > 4 ? generateCombo(rooms).join(" + ") : null;

  let primary: Recommendation;
  let backup: Recommendation;

  if (multiUnitSuggestion) {
    primary = {
      type: multiUnitSuggestion,
      size: `${comboCapacity(multiUnitSuggestion)} room capacity`,
      rationale: [],
    };
    backup = { type: "3 BHK Royale", size: "1756–1779 sq.ft", rationale: [] };
  } else if (rooms <= 2) {
    primary = { type: "2 BHK", size: "883 sq.ft", rationale: [] };
    backup = { type: "3 BHK", size: "1082 sq.ft", rationale: ["Future flexibility"] };
  } else if (rooms === 3) {
    primary = { type: "3 BHK", size: "1082 sq.ft", rationale: [] };
    backup = {
      type: "3 BHK Royale",
      size: "1756–1779 sq.ft",
      rationale: ["More spacious living"],
    };
  } else {
    primary = { type: "3 BHK Royale", size: "1756–1779 sq.ft", rationale: [] };
    backup = { type: "3 BHK", size: "1082 sq.ft", rationale: ["Compact alternative"] };
  }

  // attach rationale
  primary.rationale = buildRationale(rooms, lifestyle, tenure.preferred ?? maxTenureAllowed);

  // space pressure
  const spacePressureScore = Math.min(
    100,
    Math.round(rooms / (multiUnitSuggestion ? comboCapacity(multiUnitSuggestion) : 4) * 100)
  );

  return {
    primary,
    backup,
    roomsNeeded: rooms,
    multiUnitSuggestion: multiUnitSuggestion ?? undefined,
    maxTenureAllowed,
    spacePressureScore,
  };
}
