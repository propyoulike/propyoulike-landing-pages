// src/components/footer/FooterAccordion.tsx
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FooterAccordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        className="w-full flex justify-between items-center py-3 text-white md:cursor-default"
        onClick={() => setOpen(!open)}
      >
        {/* FIXED: Keep title (logo + name) together */}
        <div className="flex items-center gap-2 text-lg font-semibold">
          {title}
        </div>

        <ChevronDown
          className={`h-5 transition-transform md:hidden ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 md:block ${
          open ? "max-h-[500px] py-2" : "max-h-0 md:max-h-full"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
