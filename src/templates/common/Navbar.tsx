import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  logo?: string | null;
  menu?: { label: string; targetId: string }[];
  onCtaClick: () => void;
}

export default function Navbar({ logo, menu = [], onCtaClick }: NavbarProps) {
  const [sticky, setSticky] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");

    const onScroll = () => {
      if (!hero) return;

      const rect = hero.getBoundingClientRect();
      setSticky(rect.bottom <= 0);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** ⚡ Ultra-safe scroll handler — no navigation, no reloads */
  const scrollToSection = (targetId: string) => {
    const cleanId = targetId.replace("#", "").trim(); // strip leading '#'
    const el = document.getElementById(cleanId);

    if (!el) {
      console.warn("⚠ Scroll target not found:", cleanId);
      return;
    }

    el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`w-full z-[9999] transition-all duration-300 ${
        sticky
          ? "fixed top-0 bg-white shadow-md"
          : "absolute top-0 bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        {logo && (
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-auto cursor-pointer"
            onClick={() => scrollToSection("#hero")}
          />
        )}

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-sm font-medium">
          {menu.map((item, index) => (
            <li
              key={index}
              className="cursor-pointer hover:text-primary transition"
              onClick={() => scrollToSection(item.targetId)}
            >
              {item.label}
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <button
          onClick={onCtaClick}
          className="hidden md:block px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
        >
          Enquire Now
        </button>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden">
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <ul className="flex flex-col p-4 text-base">
            {menu.map((item, index) => (
              <li
                key={index}
                className="py-3 border-b cursor-pointer"
                onClick={() => {
                  setMobileOpen(false);
                  scrollToSection(item.targetId);
                }}
              >
                {item.label}
              </li>
            ))}

            <button
              onClick={() => {
                setMobileOpen(false);
                onCtaClick();
              }}
              className="mt-4 w-full px-4 py-3 bg-primary text-white rounded-lg"
            >
              Enquire Now
            </button>
          </ul>
        </div>
      )}
    </div>
  );
}
