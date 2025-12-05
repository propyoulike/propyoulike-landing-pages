import React from "react";
export default function SupportedBanks({ banks }) {
  if (!banks || banks.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="text-sm font-medium mb-2">Banks Supporting This Project</div>
      <div className="flex flex-wrap gap-2">
        {banks.map((b, i) => (
          <div
            key={i}
            className="px-3 py-1 border rounded-full text-sm bg-muted/50"
          >
            {b}
          </div>
        ))}
      </div>
    </div>
  );
}
