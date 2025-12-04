// src/components/widgets/HomeSizeAdvisor/index.tsx
import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, Layers, Info } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* HomeSizeAdvisor — household-only widget
   - Finance & tenure logic removed
   - Self-contained and portable for immediate use
-------------------------------------------------------------------------- */

/* -------------------- TYPES -------------------- */
type HouseholdInput = { adults: number; kids: number; elderly: number };
type LifestyleInput = { wfh: boolean; guests: "rare" | "sometimes" | "frequent" };
type Recommendation = { type: string; size: string; rationale: string[] };
type CalculatorOutput = {
  primary: Recommendation;
  backup: Recommendation;
  roomsNeeded: number;
  multiUnitSuggestion?: string;
  spacePressureScore: number;
};

/* -------------------- CALCULATOR -------------------- */
const UNIT_CAPACITY: Record<string, number> = {
  "2 BHK": 2,
  "3 BHK": 3,
  "3 BHK Royale": 3.5,
};

function roomsNeeded(hh: HouseholdInput, lifestyle: LifestyleInput) {
  const adultsRooms = Math.max(1, Math.ceil(hh.adults / 2));
  const kidsRooms = Math.ceil(hh.kids / 2);
  const elderlyRooms = Math.ceil(hh.elderly / 2);
  const wfhRoom = lifestyle.wfh ? 1 : 0;
  return adultsRooms + kidsRooms + elderlyRooms + wfhRoom;
}

function generateCombo(requiredRooms: number): string[] {
  const units: string[] = [];
  let remaining = requiredRooms;
  while (remaining > 0.001) {
    if (remaining >= 3.5) {
      units.push("3 BHK Royale");
      remaining -= 3.5;
    } else if (remaining >= 3) {
      units.push("3 BHK");
      remaining -= 3;
    } else {
      units.push("2 BHK");
      remaining -= 2;
    }
  }
  const count: Record<string, number> = {};
  for (const u of units) count[u] = (count[u] || 0) + 1;
  return Object.entries(count).map(([unit, c]) => (c === 1 ? unit : `${c} × ${unit}`));
}

function parseUnitCapacity(unit: string): number {
  const trimmed = unit.trim();
  const multiMatch = trimmed.match(/^(\d+)\s*×\s*(.*)$/);
  if (multiMatch) {
    const qty = Number(multiMatch[1]);
    const type = multiMatch[2].trim();
    return qty * (UNIT_CAPACITY[type] || 0);
  }
  return UNIT_CAPACITY[trimmed] || 0;
}

function comboCapacity(combo: string): number {
  if (!combo) return 0;
  return combo.split("+").map((s) => s.trim()).reduce((sum, part) => sum + parseUnitCapacity(part), 0);
}

function calculateRecommendation(hh: HouseholdInput, lifestyle: LifestyleInput): CalculatorOutput {
  const rooms = roomsNeeded(hh, lifestyle);
  const multiUnitSuggestion = rooms > 4 ? generateCombo(rooms).join(" + ") : undefined;

  let primary: Recommendation;
  let backup: Recommendation;

  if (multiUnitSuggestion) {
    primary = { type: multiUnitSuggestion, size: `${comboCapacity(multiUnitSuggestion)} room capacity`, rationale: [] };
    backup = { type: "3 BHK Royale", size: "1756–1779 sq.ft", rationale: [] };
  } else if (rooms <= 2) {
    primary = { type: "2 BHK", size: "883 sq.ft", rationale: [] };
    backup = { type: "3 BHK", size: "1082 sq.ft", rationale: ["Future flexibility"] };
  } else if (rooms === 3) {
    primary = { type: "3 BHK", size: "1082 sq.ft", rationale: [] };
    backup = { type: "3 BHK Royale", size: "1756–1779 sq.ft", rationale: ["More spacious living"] };
  } else {
    primary = { type: "3 BHK Royale", size: "1756–1779 sq.ft", rationale: [] };
    backup = { type: "3 BHK", size: "1082 sq.ft", rationale: ["Compact alternative"] };
  }

  primary.rationale = [];
  primary.rationale.push(`Rooms needed: ${rooms}`);
  if (lifestyle.wfh) primary.rationale.push("Includes workspace (WFH)");
  if (lifestyle.guests === "frequent") primary.rationale.push("Frequent guests—extra flexibility");

  const spacePressureScore = Math.min(100, Math.round((rooms / (multiUnitSuggestion ? comboCapacity(multiUnitSuggestion) : 4)) * 100));

  return { primary, backup, roomsNeeded: rooms, multiUnitSuggestion, spacePressureScore };
}

/* -------------------- Presentational helper -------------------- */
function CounterInput({ label, value, setValue, info }: { label: string; value: number; setValue: (v: number) => void; info: string }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-[#4A5568] mb-1">{label}</label>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => setValue(Math.max(0, value - 1))}>-</Button>
        <div className="min-w-[44px] text-center">{value}</div>
        <Button variant="outline" size="sm" onClick={() => setValue(value + 1)}>+</Button>
        <div className="relative group ml-1">
          <button className="cursor-pointer text-[#A0AEC0] text-xs p-1" type="button"><Info className="w-3 h-3" /></button>
          <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 left-0 top-8 z-10">{info}</div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Main Component -------------------- */
export default function HomeSizeAdvisor({ className = "" }: { className?: string }) {
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [elderly, setElderly] = useState(0);

  const [wfh, setWfh] = useState(false);
  const [guests, setGuests] = useState<"rare" | "sometimes" | "frequent">("rare");

  const hh: HouseholdInput = useMemo(() => ({ adults, kids, elderly }), [adults, kids, elderly]);
  const lifestyle: LifestyleInput = useMemo(() => ({ wfh, guests }), [wfh, guests]);

  const calc = useMemo(() => calculateRecommendation(hh, lifestyle), [hh, lifestyle]);

  const resetForm = () => {
    setAdults(2);
    setKids(0);
    setElderly(0);
    setWfh(false);
    setGuests("rare");
  };

  const meterValue = () => {
    if (calc.primary.type.includes("2 BHK")) return 33;
    if (calc.primary.type.includes("3 BHK Royale")) return 100;
    return 66;
  };

  return (
    <div className={`w-full flex justify-center bg-[#F5F7FA] p-4 md:p-8 ${className}`}>
      <Card className="w-full max-w-4xl p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-[#1A365D]">Home Size Advisor</CardTitle>
        </CardHeader>

        <CardContent className="md:flex md:gap-6 md:items-start">
          {/* LEFT */}
          <div className="md:w-1/2 space-y-6">
            {/* Household */}
            <div className="border rounded-lg p-3 bg-white">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2 text-[#2D3748]"><Users className="w-4 h-4" /> Household</h4>
                <span className="text-sm text-[#4A5568]">Enter composition</span>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <CounterInput label="Adults" value={adults} setValue={setAdults} info={`${Math.max(1, Math.ceil(adults / 2))} Adult room(s)`} />
                <CounterInput label="Kids" value={kids} setValue={setKids} info={`${Math.ceil(kids / 2)} Kid room(s)`} />
                <CounterInput label="Elderly" value={elderly} setValue={setElderly} info={`${Math.ceil(elderly / 2)} Elderly room(s)`} />
              </div>
            </div>

            {/* Lifestyle */}
            <div className="border rounded-lg p-3 bg-white space-y-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <h4 className="font-medium text-[#2D3748]">Lifestyle</h4>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={wfh} onChange={() => setWfh(!wfh)} />
                <span className="text-sm">Work from home</span>
              </label>

              <div>
                <div className="text-sm text-[#4A5568] mb-2">Guest Frequency</div>
                <div className="flex gap-2 flex-wrap">
                  {(["rare", "sometimes", "frequent"] as const).map((g) => (
                    <Button key={g} variant={guests === g ? "default" : "outline"} onClick={() => setGuests(g)}>
                      {g === "rare" ? "Rarely" : g === "sometimes" ? "Sometimes" : "Frequently"}
                    </Button>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex gap-3">
              <Button className="flex-1 h-12 bg-[#1A365D] text-white" onClick={() => { /* track event / lead */ }}>Discuss with an expert</Button>
              <Button className="flex-1 h-12" onClick={resetForm}>Reset</Button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="md:w-1/2 md:sticky md:top-6 h-fit mt-6 md:mt-0 hsa-sticky-summary">
            <div className="p-4 border rounded-xl bg-white shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-[#2D3748]" />
                  <div>
                    <div className="text-sm text-[#4A5568]">Recommended Unit</div>
                    <div className="text-lg font-semibold text-[#1A365D]">{calc.primary.type}</div>
                    <div className="text-xs text-[#718096]">{calc.primary.size}</div>
                  </div>
                </div>

                <span className={`px-2 py-1 rounded text-xs ${calc.primary.type.includes("2 BHK") ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                  {calc.primary.type.includes("2 BHK") ? "Stretch Fit" : "Best Fit"}
                </span>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div style={{ width: `${Math.min(100, calc.spacePressureScore)}%` }} className="h-2 bg-gradient-to-r from-indigo-500 to-teal-400" />
                </div>
                <div className="flex justify-between text-xs mt-2 text-[#4A5568]"><span>2 BHK</span><span>3 BHK</span><span>3 BHK Royale</span></div>
              </div>

              <div className="mt-4 text-sm text-[#4A5568]">
                <ul className="list-disc list-inside space-y-1">
                  {calc.primary.rationale.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {calc.multiUnitSuggestion && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="text-sm font-semibold text-orange-800">Multi-Unit Recommendation</div>
                  <div className="text-sm text-orange-700 mt-1">{calc.multiUnitSuggestion}</div>
                </div>
              )}

              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-[#2D3748]">Space Pressure Score</div>
                  <div className="text-sm text-[#4A5568]">{calc.spacePressureScore}%</div>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div style={{ width: `${calc.spacePressureScore}%` }} className={`${calc.spacePressureScore < 60 ? "bg-green-500" : calc.spacePressureScore < 90 ? "bg-yellow-500" : "bg-red-500"} h-2`} />
                </div>

                {calc.spacePressureScore >= 100 && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">Your needs exceed available capacity even with combos. Consider revising or exploring additional inventory.</div>
                )}
              </div>

              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="text-sm font-medium text-[#2D3748] mb-2">Needs Summary</div>
                <ul className="text-sm text-[#4A5568] space-y-1 list-disc list-inside">
                  <li>Adults: {adults} — {Math.max(1, Math.ceil(adults / 2))} Adult room(s)</li>
                  <li>Kids: {kids} — {Math.ceil(kids / 2)} Kid room(s)</li>
                  <li>Elderly: {elderly} — {Math.ceil(elderly / 2)} Elderly room(s)</li>
                  <li>WFH: {wfh ? "Yes" : "No"}</li>
                  <li>Guests: {guests === "rare" ? "Occasional" : guests === "sometimes" ? "Sometimes" : "Frequent"}</li>
                  <li className="font-semibold">Total rooms needed: {calc.roomsNeeded}</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
