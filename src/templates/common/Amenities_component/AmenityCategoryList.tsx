import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function AmenityCategoryList({ categories = [] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!categories.length) return null;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto fade-up">
      {categories.map((category, index) => {
        const open = openIndex === index;

        return (
          <div
            key={index}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              open ? "border-primary/50 shadow-xl" : "border-border shadow-md"
            }`}
          >
            <button
              onClick={() => setOpenIndex(open ? null : index)}
              className="w-full p-5 flex items-center justify-between hover:bg-muted/40"
            >
              <h3 className="text-lg font-semibold">{category.title}</h3>
              {open ? <ChevronUp /> : <ChevronDown />}
            </button>

            {open && (
              <div className="p-5 animate-accordion-down">
                <ul className="space-y-2">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-start text-muted-foreground">
                      <span className="text-primary mr-2 mt-[3px]">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
