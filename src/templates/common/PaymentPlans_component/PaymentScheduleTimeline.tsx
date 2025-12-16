import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";

export default function PaymentScheduleTimeline({ stages = [] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  // animate vertical line when in view
  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) line.dataset.visible = "true";
      },
      { threshold: 0.3 }
    );

    obs.observe(line);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative pl-8">
      {/* Timeline vertical line */}
      <div
        ref={lineRef}
        className="absolute top-0 left-2 w-1 bg-primary/20 rounded-full h-0 
          transition-all duration-1000 ease-out data-[visible=true]:h-full"
      />

      <div className="space-y-10">
        {stages.map((stage, i) => {
          const open = openIndex === i;
          const hasItems = stage.items?.length > 0;

          return (
            <div
              key={i}
              className="relative animate-fade-in"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <button
                className="w-full flex items-center justify-between"
                onClick={() => hasItems && setOpenIndex(open ? null : i)}
              >
                <span className="text-lg font-semibold">{stage.title}</span>

                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">{stage.percentage}</span>
                  {hasItems &&
                    (open ? (
                      <ChevronUp className="text-primary" />
                    ) : (
                      <ChevronDown className="text-primary" />
                    ))}
                </div>
              </button>

              {open && hasItems && (
                <ul className="mt-4 space-y-2 text-muted-foreground ml-1">
                  {stage.items.map((p, idx) => (
                    <li key={idx} className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-1" />
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
