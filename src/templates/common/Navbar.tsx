// src/templates/common/Navbar.tsx
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import type { AutoMenuItem } from "./buildAutoMenu";

interface NavbarProps {
  logo?: string | null;
  autoMenu?: AutoMenuItem[];
  ctaLabel?: string | null;
  onCtaClick?: () => void;
}

export default function Navbar({ logo, autoMenu = [], ctaLabel, onCtaClick }: NavbarProps) {
  const [sticky, setSticky] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  // sticky + shrink behaviour
  useEffect(() => {
    const hero = document.getElementById("hero");

    const handler = () => {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      setSticky(rect.bottom <= 0);
      setShrink(rect.bottom <= -48);
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ACTIVE SECTION SCROLLSPY ⭐
  useEffect(() => {
    const ids = autoMenu.map((m) => m.id);

    const spy = () => {
      let current = "";
      for (let id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          current = id;
          break;
        }
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", spy, { passive: true });
    spy();
    return () => window.removeEventListener("scroll", spy);
  }, [autoMenu]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`); // SEO-friendly hash
  };

  return (
    <>
      <div
        className={`w-full z-[9999] transition-all duration-300 ${
          sticky ? "fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow" : "absolute top-0 left-0 right-0 bg-transparent"
        }`}
      >
        <nav className={`container mx-auto px-4 transition-all duration-300 flex items-center justify-between ${shrink ? "py-2" : "py-4"}`}>
          
          {/* Logo */}
          <div className="flex items-center gap-4">
            {logo ? (
              <img
                src={logo}
                alt="logo"
                className={`h-10 transition-all ${shrink ? "h-8" : "h-10"} cursor-pointer`}
                onClick={() => scrollTo("hero")}
              />
            ) : (
              <div className={`text-lg font-bold ${shrink ? "text-base" : "text-lg"}`} onClick={() => scrollTo("hero")}>
                Project
              </div>
            )}
          </div>

          {/* Desktop menu */}
          <ul className="hidden md:flex items-center gap-6">
            {autoMenu.map((m) => (
              <li key={m.id} className="relative group">
                {m.children && m.children.length > 0 ? (
                  <>
                    <button
                      className={`flex items-center gap-2 text-sm font-medium transition ${
                        activeId === m.id ? "text-primary font-semibold" : "hover:text-primary"
                      }`}
                      onClick={() => scrollTo(m.id)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <span>{m.label}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    <div className="absolute left-0 mt-2 hidden group-hover:block min-w-[12rem] bg-white rounded-lg shadow-md border overflow-hidden z-50">
                      <ul className="py-2">
                        {m.children!.map((c) => (
                          <li key={c.id} className="px-4 py-2 hover:bg-muted cursor-pointer text-sm" onClick={() => scrollTo(c.id)}>
                            {c.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <button
                    className={`text-sm font-medium transition ${
                      activeId === m.id ? "text-primary font-semibold" : "hover:text-primary"
                    }`}
                    onClick={() => scrollTo(m.id)}
                  >
                    {m.label}
                  </button>
                )}
              </li>
            ))}

            {/* CTA (desktop) */}
            {ctaLabel && onCtaClick && (
              <li>
                <button
                  className="ml-4 px-4 py-2 rounded-full border bg-primary text-white font-semibold hover:opacity-95 transition"
                  onClick={onCtaClick}
                >
                  {ctaLabel}
                </button>
              </li>
            )}
          </ul>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMobileOpen((s) => !s)} aria-label="Toggle menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-[64px] bg-white z-[9998] border-t shadow-lg max-h-[60vh] overflow-auto">
          <ul className="flex flex-col">
            {autoMenu.map((m) => (
              <li key={m.id} className="border-b">
                <div className="flex items-center justify-between px-4 py-3">
                  <button
                    className={`text-base font-medium text-left ${
                      activeId === m.id ? "text-primary font-semibold" : ""
                    }`}
                    onClick={() => { scrollTo(m.id); setMobileOpen(false); }}
                  >
                    {m.label}
                  </button>
                  {m.children && m.children.length > 0 ? (
                    <div className="ml-2">
                      <details>
                        <summary className="cursor-pointer list-none" />
                        <ul className="pl-4 pb-2">
                          {m.children.map((c) => (
                            <li key={c.id} className="py-2 text-sm" onClick={() => { scrollTo(c.id); setMobileOpen(false); }}>
                              {c.label}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}

            {/* Mobile CTA */}
            {ctaLabel && onCtaClick && (
              <li className="p-4">
                <button
                  className="w-full rounded-full px-4 py-3 bg-primary text-white font-semibold"
                  onClick={() => { onCtaClick(); setMobileOpen(false); }}
                >
                  {ctaLabel}
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
