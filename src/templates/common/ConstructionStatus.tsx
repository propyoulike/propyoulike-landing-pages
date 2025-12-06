import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ConstructionTower {
  name: string;
  image: string;
  status: string[];
  achieved: string[];
  upcoming: string[];
}

export default function ConstructionStatus({ data }: { data: ConstructionTower[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 space-y-10">

        {data.map((tower, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="border rounded-2xl p-6 shadow-sm"
            >
              {/* IMAGE */}
              <div className="w-full aspect-video rounded-xl overflow-hidden mb-4">
                <img
                  src={tower.image}
                  alt={tower.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* NAME */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{tower.name}</h2>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  {isOpen ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>

              {/* EXPANDED DETAILS */}
              {isOpen && (
                <div className="mt-6 space-y-6">

                  {/* STATUS */}
                  {tower.status?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium uppercase mb-2">
                        Current Status
                      </h3>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {tower.status.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ACHIEVED */}
                  {tower.achieved?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium uppercase mb-2">
                        Achieved Milestones
                      </h3>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {tower.achieved.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* UPCOMING */}
                  {tower.upcoming?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium uppercase mb-2">
                        Upcoming Milestones
                      </h3>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {tower.upcoming.map((item, i) => (
                          <li key={i}>{item}</li>
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
