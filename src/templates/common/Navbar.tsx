// src/templates/common/Navbar.tsx
import { useEffect, useState, useCallback, memo } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import type { AutoMenuItem } from "./buildAutoMenu";

interface NavbarProps {
  logo?: string | null;
  builderLogo?: string | null;
  projectName?: string;
  autoMenu?: AutoMenuItem[];
  ctaLabel?: string | null;
  onCtaClick?: () => void;
}

const Navbar = memo(function Navbar({
  logo,
  builderLogo,
  projectName,
  autoMenu = [],
  ctaLabel,
  onCtaClick,
}: NavbarProps) {
  const [sticky, setSticky] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  /* ----------------------------------------------------
     Sticky + Shrink Tracking
  ---------------------------------------------------- */
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

  /* ----------------------------------------------------
     ScrollTo with NAVBAR OFFSET (fix hidden sections)
  ---------------------------------------------------- */
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const navbar = document.querySelector("header");
    const offset = navbar ? navbar.clientHeight + 8 : 80;

    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  const handleMenuClick = useCallback(
    (id: string) => {
      scrollTo(id);
      setMobileOpen(false);
    },
    [scrollTo]
  );

  /* ----------------------------------------------------
     ScrollSpy with correct offsets
  ---------------------------------------------------- */
  useEffect(() => {
    let ticking = false;
    const ids = autoMenu.map((m) => m.id);

    const spy = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const navbar = document.querySelector("header");
        const offset = navbar ? navbar.clientHeight + 20 : 140;

        let current = "";
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;

          const top = el.getBoundingClientRect().top;
          const bottom = el.getBoundingClientRect().bottom;

          if (top <= offset && bottom >= offset) {
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

  /* ----------------------------------------------------
     ESC closes mobile menu
  ---------------------------------------------------- */
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  /* ----------------------------------------------------
     Lock scrolling when drawer is open
  ---------------------------------------------------- */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* NAVBAR SHELL */}
      <header
        className={`
          w-full z-[9999] transition-all duration-300
          ${sticky
            ? "fixed top-0 bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
            : "absolute top-0 bg-transparent"
          }
        `}
      >
        <nav
          className={`container mx-auto px-4 flex items-center justify-between transition-all duration-300
            ${shrink ? "py-2" : "py-3 md:py-4"}
          `}
        >
          {/* LOGO + BUILDER LOGO */}
          <button
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            aria-label="Go to top"
            onClick={() => scrollTo("hero")}
          >
            {builderLogo && (
              <img
                src={builderLogo}
                className={`transition-all duration-300 ${shrink ? "h-7" : "h-9"}`}
                alt="Builder Logo"
              />
            )}

            {builderLogo && logo && (
              <div
                className={`w-px bg-border transition-all duration-300 ${shrink ? "h-6" : "h-8"}`}
              />
            )}

            {logo ? (
              <img
                src={logo}
                className={`transition-all duration-300 ${shrink ? "h-8" : "h-10"}`}
                alt="Project Logo"
              />
            ) : (
              projectName && (
                <span
                  className={`font-bold text-foreground transition-all duration-300 ${
                    shrink ? "text-sm" : "text-base"
                  }`}
                >
                  {projectName}
                </span>
              )
            )}
          </button>

          {/* DESKTOP MENU */}
          <ul className="hidden lg:flex items-center gap-1">
            {autoMenu.map((m) => (
              <li key={m.id} className="relative group">
                {/* Parent w/ children */}
                {m.children?.length ? (
                  <>
                    <button
                      onClick={() => scrollTo(m.id)}
                      className={`
                        flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                        ${
                          activeId === m.id
                            ? "text-primary bg-primary/5"
                            : "text-foreground/80 hover:text-primary hover:bg-muted"
                        }
                      `}
                    >
                      {m.label}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>

                    <div
                      className="
                        absolute left-0 mt-1 min-w-[12rem] bg-card border border-border rounded-xl shadow-lg 
                        hidden group-hover:block z-50 animate-fade-in
                      "
                    >
                      <ul className="py-2">
                        {m.children.map((c) => (
                          <li key={c.id}>
                            <button
                              className="w-full text-left px-4 py-2.5 hover:bg-muted text-sm transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuClick(c.id);
                              }}
                            >
                              {c.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  /* Simple item */
                  <button
                    className={`
                      px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      ${
                        activeId === m.id
                          ? "text-primary bg-primary/5"
                          : "text-foreground/80 hover:text-primary hover:bg-muted"
                      }
                    `}
                    onClick={() => scrollTo(m.id)}
                  >
                    {m.label}
                  </button>
                )}
              </li>
            ))}

            {/* Desktop CTA */}
            {ctaLabel && onCtaClick && (
              <li>
                <button
                  className="ml-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent-dark transition-colors shadow-sm"
                  onClick={onCtaClick}
                >
                  {ctaLabel}
                </button>
              </li>
            )}
          </ul>

          {/* MOBILE MENU TOGGLER */}
          <button
            className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-muted transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((s) => !s)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[9997] animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <aside
        className={`
          lg:hidden fixed inset-y-0 right-0 w-[280px] max-w-[85vw] bg-background z-[9998]
          shadow-2xl transform transition-transform duration-300 ease-out
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="font-semibold">Menu</span>
            <button
              className="p-2 -mr-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Menu */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {autoMenu.map((m) => (
                <li key={m.id}>
                  <button
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors
                      ${
                        activeId === m.id
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-muted"
                      }
                    `}
                    onClick={() => handleMenuClick(m.id)}
                  >
                    {m.label}
                    {m.children?.length > 0 && <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </button>

                  {m.children?.length > 0 && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {m.children.map((c) => (
                        <li key={c.id}>
                          <button
                            className="w-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg text-left transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuClick(c.id);
                            }}
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

          {/* Drawer CTA */}
          {ctaLabel && onCtaClick && (
            <div className="p-4 border-t border-border">
              <button
                className="w-full py-3.5 rounded-xl bg-accent text-accent-foreground font-semibold shadow-sm active:scale-[0.98] transition"
                onClick={() => {
                  onCtaClick();
                  setMobileOpen(false);
                }}
              >
                {ctaLabel}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
});

export default Navbar;
