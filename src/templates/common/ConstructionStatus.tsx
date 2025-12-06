import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ConstructionTower {
  name: string;
  image: string;
  status: string[];
  achieved: string[];
  upcoming: string[];
}

export default function ConstructionStatus({ updates }: { updates: ConstructionTower[] }) {
  const [open, setOpen] = useState<number | null>(null);

  if (!Array.isArray(updates) || updates.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 space-y-8">

        {updates.map((tower, i) => {
          const isOpen = open === i;

          return (
            <div key={i} className="border rounded-xl p-6 shadow-md">

              {/* IMAGE */}
              <div className="aspect-video rounded-lg overflow-hidden mb-4">
                <img
                  src={tower.image}
                  alt={tower.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* NAME + TOGGLE */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{tower.name}</h2>

                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="p-2 rounded-lg hover:bg-gray-200"
                >
                  {isOpen ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>

              {/* EXPANDED INFO */}
              {isOpen && (
                <div className="mt-6 space-y-6">

                  {/* Status */}
                  {tower.status.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-1">Current Status</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {tower.status.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Achieved */}
                  {tower.achieved.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-1">Achieved</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {tower.achieved.map((a, idx) => (
                          <li key={idx}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Upcoming */}
                  {tower.upcoming.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-1">Upcoming</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {tower.upcoming.map((u, idx) => (
                          <li key={idx}>{u}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>
    </section>
  );
}
