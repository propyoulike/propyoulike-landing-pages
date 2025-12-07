// src/components/widgets/HomeSizeAdvisor/index.tsx
import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, Layers, Info, RotateCcw, MessageCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/* -------------------------------------------------------------------------- */
/* HomeSizeAdvisor — household-only widget
   - Uses semantic design tokens
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
      <label className="text-sm text-muted-foreground mb-1">{label}</label>
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setValue(Math.max(0, value - 1))}
          className="h-8 w-8 p-0"
        >
          -
        </Button>
        <div className="min-w-[44px] text-center font-medium text-foreground">{value}</div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setValue(value + 1)}
          className="h-8 w-8 p-0"
        >
          +
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors p-1" type="button">
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{info}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

/* -------------------- Main Component -------------------- */
export default function HomeSizeAdvisor({ className = "", onCtaClick }: { className?: string; onCtaClick?: () => void }) {
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

  return (
    <section id="home-size-advisor" className={`py-20 lg:py-28 bg-muted/30 scroll-mt-32 ${className}`}>
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
            Home Size Advisor
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Find the perfect home size based on your household composition and lifestyle needs.
          </p>
        </div>

        <Card className="max-w-5xl mx-auto rounded-2xl border shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* LEFT - Inputs */}
              <div className="space-y-6">
                {/* Household */}
                <div className="border border-border rounded-xl p-5 bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold flex items-center gap-2 text-foreground">
                      <Users className="w-5 h-5 text-primary" /> Household
                    </h4>
                    <span className="text-sm text-muted-foreground">Enter composition</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <CounterInput label="Adults" value={adults} setValue={setAdults} info={`${Math.max(1, Math.ceil(adults / 2))} Adult room(s)`} />
                    <CounterInput label="Kids" value={kids} setValue={setKids} info={`${Math.ceil(kids / 2)} Kid room(s)`} />
                    <CounterInput label="Elderly" value={elderly} setValue={setElderly} info={`${Math.ceil(elderly / 2)} Elderly room(s)`} />
                  </div>
                </div>

                {/* Lifestyle */}
                <div className="border border-border rounded-xl p-5 bg-card space-y-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Lifestyle</h4>
                  </div>

                  <label className="inline-flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={wfh} 
                      onChange={() => setWfh(!wfh)} 
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">Work from home</span>
                  </label>

                  <div>
                    <div className="text-sm text-muted-foreground mb-3">Guest Frequency</div>
                    <div className="flex gap-2 flex-wrap">
                      {(["rare", "sometimes", "frequent"] as const).map((g) => (
                        <Button 
                          key={g} 
                          variant={guests === g ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setGuests(g)}
                          className="rounded-full"
                        >
                          {g === "rare" ? "Rarely" : g === "sometimes" ? "Sometimes" : "Frequently"}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary-dark" 
                    onClick={onCtaClick}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Discuss with an expert
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-12 px-6" 
                    onClick={resetForm}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* RIGHT - Summary */}
              <div className="lg:sticky lg:top-24 h-fit space-y-4">
                <div className="p-5 border border-border rounded-xl bg-card shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Layers className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Recommended Unit</div>
                        <div className="text-xl font-bold text-foreground">{calc.primary.type}</div>
                        <div className="text-sm text-muted-foreground">{calc.primary.size}</div>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      calc.primary.type.includes("2 BHK") 
                        ? "bg-warning/10 text-warning" 
                        : "bg-success/10 text-success"
                    }`}>
                      {calc.primary.type.includes("2 BHK") ? "Stretch Fit" : "Best Fit"}
                    </span>
                  </div>

                  {/* Unit Meter */}
                  <div className="mb-4">
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        style={{ width: `${Math.min(100, calc.spacePressureScore)}%` }} 
                        className="h-2 bg-gradient-to-r from-primary to-accent transition-all duration-500" 
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                      <span>2 BHK</span>
                      <span>3 BHK</span>
                      <span>3 BHK Royale</span>
                    </div>
                  </div>

                  {/* Rationale */}
                  {calc.primary.rationale.length > 0 && (
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mb-4">
                      {calc.primary.rationale.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  )}

                  {/* Multi-Unit Suggestion */}
                  {calc.multiUnitSuggestion && (
                    <div className="p-3 bg-warning/5 border border-warning/20 rounded-lg mb-4">
                      <div className="text-sm font-semibold text-warning">Multi-Unit Recommendation</div>
                      <div className="text-sm text-muted-foreground mt-1">{calc.multiUnitSuggestion}</div>
                    </div>
                  )}
                </div>

                {/* Space Pressure Score */}
                <div className="p-5 border border-border rounded-xl bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-foreground">Space Pressure Score</div>
                    <div className="text-sm font-semibold text-foreground">{calc.spacePressureScore}%</div>
                  </div>

                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${calc.spacePressureScore}%` }} 
                      className={`h-2 transition-all duration-500 ${
                        calc.spacePressureScore < 60 
                          ? "bg-success" 
                          : calc.spacePressureScore < 90 
                            ? "bg-warning" 
                            : "bg-destructive"
                      }`} 
                    />
                  </div>

                  {calc.spacePressureScore >= 100 && (
                    <div className="mt-3 p-3 bg-destructive/5 border border-destructive/20 rounded-lg text-destructive text-sm">
                      Your needs exceed available capacity. Consider revising or exploring additional options.
                    </div>
                  )}
                </div>

                {/* Needs Summary */}
                <div className="p-5 border border-border rounded-xl bg-card">
                  <div className="text-sm font-medium text-foreground mb-3">Needs Summary</div>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex justify-between">
                      <span>Adults ({adults})</span>
                      <span className="font-medium">{Math.max(1, Math.ceil(adults / 2))} room(s)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Kids ({kids})</span>
                      <span className="font-medium">{Math.ceil(kids / 2)} room(s)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Elderly ({elderly})</span>
                      <span className="font-medium">{Math.ceil(elderly / 2)} room(s)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Work from Home</span>
                      <span className="font-medium">{wfh ? "Yes (+1)" : "No"}</span>
                    </li>
                    <li className="flex justify-between border-t border-border pt-2 mt-2">
                      <span className="font-semibold text-foreground">Total Rooms Needed</span>
                      <span className="font-bold text-primary">{calc.roomsNeeded}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
