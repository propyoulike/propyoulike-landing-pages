// src/components/widgets/HomeSizeAdvisor/calculator.ts
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