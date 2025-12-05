// src/templates/common/FloatingQuickNav.tsx
import { Home, MapPin, Layout, Phone } from "lucide-react";
import type { AutoMenuItem } from "./buildAutoMenu";

export default function FloatingQuickNav({ items = [] as AutoMenuItem[] }) {
  // choose 4 primary items (or fallback)
  const pick = items.slice(0, 4);

  const iconFor = (label: string) => {
    if (/home/i.test(label)) return <Home />;
    if (/location|map/i.test(label)) return <MapPin />;
    if (/plan|floor/i.test(label)) return <Layout />;
    return <Phone />;
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 md:hidden z-[9999]">
      <div className="bg-white/95 backdrop-blur rounded-full px-3 py-2 shadow-lg border flex gap-4">
        {pick.map((it) => (
          <button
            key={it.id}
            className="flex flex-col items-center text-xs"
            onClick={() => {
              const el = document.getElementById(it.id);
              if (!el) return;
              el.scrollIntoView({ behavior: "smooth" });
            }}
            aria-label={it.label}
          >
            <div className="w-8 h-8 flex items-center justify-center">{iconFor(it.label)}</div>
            <div className="mt-1 text-[10px]">{it.label.split(" ").slice(0,1)[0]}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
