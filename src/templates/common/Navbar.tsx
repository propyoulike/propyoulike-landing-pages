// src/templates/common/Navbar.tsx
import { useEffect, useState, useCallback, memo } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import type { AutoMenuItem } from "./buildAutoMenu";

interface NavbarProps {
  logo?: string | null;
  autoMenu?: AutoMenuItem[];
  ctaLabel?: string | null;
  onCtaClick?: () => void;
}

const Navbar = memo(function Navbar({ logo, autoMenu = [], ctaLabel, onCtaClick }: NavbarProps) {
  const [sticky, setSticky] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  // Throttled scroll handler for performance
  useEffect(() => {
    let ticking = false;
    const hero = document.getElementById("hero");

    const handler = () => {
      if (ticking) return;
      ticking = true;
      
      requestAnimationFrame(() => {
        if (hero) {
          const rect = hero.getBoundingClientRect();
          setSticky(rect.bottom <= 0);
          setShrink(rect.bottom <= -48);
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Throttled scrollspy for active section
  useEffect(() => {
    let ticking = false;
    const ids = autoMenu.map((m) => m.id);

    const spy = () => {
      if (ticking) return;
      ticking = true;
      
      requestAnimationFrame(() => {
        let current = "";
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            current = id;
            break;
          }
        }
        setActiveId(current);
        ticking = false;
      });
    };

    window.addEventListener("scroll", spy, { passive: true });
    spy();
    return () => window.removeEventListener("scroll", spy);
  }, [autoMenu]);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  const handleMenuClick = useCallback((id: string) => {
    scrollTo(id);
    setMobileOpen(false);
  }, [scrollTo]);

  return (
    <>
      <header
        className={`w-full z-[9999] transition-all duration-300 ${
          sticky 
            ? "fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md shadow-sm border-b border-border" 
            : "absolute top-0 left-0 right-0 bg-transparent"
        }`}
      >
        <nav className={`container mx-auto px-4 transition-all duration-300 flex items-center justify-between ${
          shrink ? "py-2" : "py-3 md:py-4"
        }`}>
          
          {/* Logo */}
          <button 
            className="flex items-center gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            onClick={() => scrollTo("hero")}
            aria-label="Go to top"
          >
            {logo ? (
              <img
                src={logo}
                alt="logo"
                className={`transition-all duration-300 ${shrink ? "h-8" : "h-10"}`}
                loading="eager"
                width="auto"
                height={shrink ? 32 : 40}
              />
            ) : (
              <span className={`font-bold text-foreground ${shrink ? "text-base" : "text-lg"}`}>
                Project
              </span>
            )}
          </button>

          {/* Desktop menu */}
          <ul className="hidden lg:flex items-center gap-1">
            {autoMenu.map((m) => (
              <li key={m.id} className="relative group">
                {m.children && m.children.length > 0 ? (
                  <>
                    <button
                      className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeId === m.id 
                          ? "text-primary bg-primary/5" 
                          : "text-foreground/80 hover:text-primary hover:bg-muted"
                      }`}
                      onClick={() => scrollTo(m.id)}
                    >
                      <span>{m.label}</span>
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>

                    <div className="absolute left-0 mt-1 hidden group-hover:block min-w-[12rem] bg-card rounded-xl shadow-lg border border-border overflow-hidden z-50 animate-fade-in">
                      <ul className="py-2">
                        {m.children.map((c) => (
                          <li key={c.id}>
                            <button 
                              className="w-full px-4 py-2.5 hover:bg-muted text-sm text-left transition-colors"
                              onClick={() => scrollTo(c.id)}
                            >
                              {c.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <button
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeId === m.id 
                        ? "text-primary bg-primary/5" 
                        : "text-foreground/80 hover:text-primary hover:bg-muted"
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
              <li className="ml-2">
                <button
                  className="px-5 py-2.5 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent-dark transition-colors shadow-sm"
                  onClick={onCtaClick}
                >
                  {ctaLabel}
                </button>
              </li>
            )}
          </ul>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((s) => !s)} 
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-[9997] animate-fade-in"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div 
        className={`lg:hidden fixed inset-y-0 right-0 w-[280px] max-w-[85vw] bg-background z-[9998] shadow-2xl transform transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="font-semibold text-foreground">Menu</span>
            <button 
              className="p-2 -mr-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {autoMenu.map((m) => (
                <li key={m.id}>
                  <button
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors ${
                      activeId === m.id 
                        ? "bg-primary/10 text-primary font-semibold" 
                        : "hover:bg-muted"
                    }`}
                    onClick={() => handleMenuClick(m.id)}
                  >
                    <span>{m.label}</span>
                    {m.children && m.children.length > 0 && (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  
                  {m.children && m.children.length > 0 && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {m.children.map((c) => (
                        <li key={c.id}>
                          <button
                            className="w-full px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg text-left transition-colors"
                            onClick={() => handleMenuClick(c.id)}
                          >
                            {c.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile CTA */}
          {ctaLabel && onCtaClick && (
            <div className="p-4 border-t border-border">
              <button
                className="w-full py-3.5 rounded-xl bg-accent text-accent-foreground font-semibold shadow-sm active:scale-[0.98] transition-transform"
                onClick={() => { onCtaClick(); setMobileOpen(false); }}
              >
                {ctaLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

export default Navbar;
