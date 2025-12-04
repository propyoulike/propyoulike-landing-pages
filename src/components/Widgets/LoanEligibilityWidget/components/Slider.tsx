// src/components/widgets/LoanEligibilityWidget/components/Slider.tsx
import React from "react";

export default function Slider({ min, max, value, onChange }: { min: number; max: number; value: number; onChange: (v: number) => void; }) {
  return <input type="range" min={min} max={max} value={value} step={1} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />;
}
