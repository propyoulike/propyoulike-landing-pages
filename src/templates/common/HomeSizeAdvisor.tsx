import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, Layers, Info } from "lucide-react";

type Recommendation = { type: string; size: string; rationale: string[] };
type Result = { primary: Recommendation; backup: Recommendation } | null;

interface UnitConfig {
  label: string;
  capacity: number;
  size?: string;
}

interface HomeSizeAdvisorProps {
  className?: string;
  units: UnitConfig[]; // e.g., [{ label: "2 BHK", capacity: 2, size: "883 sq.ft" }, ...]
  defaultAdults?: number;
  defaultKids?: number;
  defaultElderly?: number;
}

export default function HomeSizeAdvisor({
  className = "",
  units,
  defaultAdults = 2,
  defaultKids = 0,
  defaultElderly = 0,
}: HomeSizeAdvisorProps) {
  const [adults, setAdults] = useState(defaultAdults);
  const [kids, setKids] = useState(defaultKids);
  const [elderly, setElderly] = useState(defaultElderly);
  const [wfh, setWfh] = useState(false);
  const [guests, setGuests] = useState<string>("rare");
  const [result, setResult] = useState<Result>(null);
  const [fadeIn, setFadeIn] = useState(false);

  const totalRoomsNeeded = () => Math.max(1, Math.ceil(adults / 2)) + Math.ceil(kids / 2) + Math.ceil(elderly / 2) + (wfh ? 1 : 0);

  const generateMultiUnitCombo = (required: number) => {
    const out: string[] = [];
    let rem = required;

    const push = (unit: UnitConfig) => {
      out.push(unit.label);
      rem -= unit.capacity;
    };

    const sortedUnits = [...units].sort((a, b) => b.capacity - a.capacity);

    while (rem > 0.001) {
      const suitable = sortedUnits.find((u) => u.capacity <= rem) || sortedUnits[sortedUnits.length - 1];
      push(suitable);
    }

    const counts: Record<string, number> = {};
    out.forEach((u) => (counts[u] = (counts[u] || 0) + 1));
    return Object.entries(counts).map(([u, c]) => (c === 1 ? u : `${c} × ${u}`));
  };

  const buildMultiUnitCombos = () => {
    const rooms = totalRoomsNeeded();
    if (rooms <= Math.max(...units.map((u) => u.capacity))) return [];
    const combo = generateMultiUnitCombo(rooms);
    return combo.length ? [`Consider: ${combo.join(" + ")}`] : [];
  };

  const capacityFromComboString = (comboStr: string) => {
    const cleaned = comboStr.replace(/^Consider:\s*/, "");
    return cleaned.split(" + ").reduce((sum, p) => {
      const u = units.find((u) => u.label === p.trim());
      return sum + (u?.capacity || 0);
    }, 0);
  };

  const calculateResult = () => {
    const rooms = totalRoomsNeeded();
    let primary: Recommendation = { type: units[0].label, size: units[0].size || "", rationale: [] };
    let backup: Recommendation = { type: units[1]?.label || units[0].label, size: units[1]?.size || "", rationale: [] };

    // Pick primary unit with enough capacity
    const suitablePrimary = units.find((u) => u.capacity >= rooms) || units[units.length - 1];
    primary = { type: suitablePrimary.label, size: suitablePrimary.size || "", rationale: [] };

    // Pick backup as next larger unit
    const suitableBackupIndex = Math.max(0, units.findIndex((u) => u.label === primary.type) + 1);
    const suitableBackup = units[suitableBackupIndex] || suitablePrimary;
    backup = { type: suitableBackup.label, size: suitableBackup.size || "", rationale: ["Backup option"] };

    const rationale: string[] = [];
    rationale.push(`Rooms needed: ${rooms}`);
    if (wfh) rationale.push("Includes workspace (WFH)");
    if (kids > 0) rationale.push("Kids require separate space");
    if (elderly > 0) rationale.push("Elderly accommodation recommended");
    if (guests === "frequent") rationale.push("Frequent guests — consider extra flexibility");

    primary.rationale = rationale;
    setResult({ primary, backup });
    setFadeIn(true);
    setTimeout(() => setFadeIn(false), 260);
  };

  useEffect(() => {
    calculateResult();
  }, [adults, kids, elderly, wfh, guests]);

  const resetForm = () => {
    setAdults(defaultAdults);
    setKids(defaultKids);
    setElderly(defaultElderly);
    setWfh(false);
    setGuests("rare");
    setResult(null);
  };

  return (
    <div className={`w-full flex justify-center bg-[#F5F7FA] p-4 md:p-8 ${className}`}>
      <Card className="w-full max-w-4xl p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-[#1A365D]">Home Size Advisor</CardTitle>
        </CardHeader>

        <CardContent className="md:flex md:gap-6 md:items-start">
          {/* Input Controls */}
          <div className="md:w-1/2 space-y-6">
            {/* Household & Lifestyle Inputs */}
            {/* ... Same input layout as your original, using adults/kids/elderly/wfh/guests ... */}
            <div className="flex gap-3">
              <Button className="flex-1 h-12 bg-[#1A365D] text-white" onClick={resetForm}>Reset</Button>
            </div>
          </div>

          {/* Results */}
          <div className="md:w-1/2 md:sticky md:top-6 h-fit mt-6 md:mt-0">
            <div className={`${fadeIn ? 'opacity-100 transition-opacity duration-300' : 'opacity-100'}`}>
              {result && (
                <div className="p-4 border rounded-xl bg-white shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Layers className="w-5 h-5 text-[#2D3748]" />
                      <div>
                        <div className="text-sm text-[#4A5568]">Recommended Unit</div>
                        <div className="text-lg font-semibold text-[#1A365D]">{result.primary.type}</div>
                        <div className="text-xs text-[#718096]">{result.primary.size}</div>
                      </div>
                    </div>
                  </div>

                  {buildMultiUnitCombos().length > 0 && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="text-sm font-semibold text-orange-800">Multi-Unit Recommendation</div>
                      <div className="text-sm text-orange-700 mt-1">{buildMultiUnitCombos()[0]}</div>
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-white rounded-lg border">
                    <div className="text-sm font-medium text-[#2D3748] mb-2">Needs Summary</div>
                    <ul className="text-sm text-[#4A5568] space-y-1 list-disc list-inside">
                      <li>Adults: {adults}</li>
                      <li>Kids: {kids}</li>
                      <li>Elderly: {elderly}</li>
                      <li>WFH: {wfh ? "Yes" : "No"}</li>
                      <li>Guests: {guests}</li>
                      <li className="font-semibold">Total rooms needed: {totalRoomsNeeded()}</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
