import {
  Building2,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";

import CTAButtons from "@/components/CTAButtons";
import useEmblaCarousel from "embla-carousel-react";
import { useState } from "react";

function Modal({ data, onClose }: { data: any; onClose: () => void }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-card rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative shadow-xl">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl font-bold"
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold mb-4">{data.name}</h3>

        {/* Status */}
        {data.status?.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Current Status</h4>
            <ul className="list-disc pl-5 space-y-1">
              {data.status.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Achieved */}
        {data.achieved?.length > 0 && (
          <div className="mb-6 border-t pt-4">
            <h4 className="font-semibold mb-2">Achieved Milestones</h4>
            <ul className="list-disc pl-5 space-y-1">
              {data.achieved.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Upcoming */}
        {data.upcoming?.length > 0 && (
          <div className="mb-6 border-t pt-4">
            <h4 className="font-semibold mb-2">Upcoming Milestones</h4>
            <ul className="list-disc pl-5 space-y-1">
              {data.upcoming.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConstructionStatus({ updates, onCtaClick }: any) {
  if (!updates?.length) return null;

  const [emblaRef] = useEmblaCarousel({ align: "start" });
  const [selected, setSelected] = useState<any>(null);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">

        <h2 className="text-3xl font-bold mb-10 text-center">
          Construction Progress
        </h2>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {updates.map((tower: any, i: number) => (
              <div
                key={i}
                onClick={() => setSelected(tower)}
                className="flex-[0_0_80%] md:flex-[0_0_45%] lg:flex-[0_0_32%] bg-card rounded-2xl shadow cursor-pointer"
              >
                <div className="aspect-video bg-muted rounded-t-2xl overflow-hidden">
                  <img
                    src={tower.image}
                    alt={tower.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="text-primary" />
                    <h3 className="font-bold">{tower.name}</h3>
                  </div>
                  <ChevronRight className="text-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <CTAButtons onFormOpen={onCtaClick} variant="compact" />
        </div>

        {/* Modal */}
        {selected && (
          <Modal data={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </section>
  );
}
