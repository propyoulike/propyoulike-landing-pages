"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export interface NavItem {
  label: string;
  targetId: string; // element ID to scroll to
}

interface NavbarProps {
  logoUrl?: string;
  navItems: NavItem[];
  ctaLabel?: string;
  onCtaClick: () => void;
}

export default function Navbar({
  logoUrl,
  navItems,
  ctaLabel = "Enquire Now",
  onCtaClick,
}: NavbarProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const anchor = document.getElementById("navbar-anchor");

    const handleScroll = () => {
      if (!anchor) return;
      const anchorTop = anchor.getBoundingClientRect().top;
      setIsSticky(anchorTop <= 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <div
      className={`w-full z-[9999] transition-all duration-300 ${
        isSticky ? "fixed top-0 left-0 bg-white shadow-md" : "relative bg-white"
      }`}
    >
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo (optional generic) */}
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Project Logo"
            className="h-10 w-auto cursor-pointer"
          />
        ) : (
          <div className="text-lg font-bold">Project</div>
        )}

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-sm font-medium">
          {navItems.map((item) => (
            <li
              key={item.targetId}
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
          {ctaLabel}
        </button>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden">
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <ul className="flex flex-col p-4 text-base">
            {navItems.map((item) => (
              <li
                key={item.targetId}
                className="py-3 border-b cursor-pointer"
                onClick={() => scrollToSection(item.targetId)}
              >
                {item.label}
              </li>
            ))}

            {/* Mobile CTA */}
            <button
              onClick={onCtaClick}
              className="mt-4 w-full px-4 py-3 bg-primary text-white rounded-lg"
            >
              {ctaLabel}
            </button>
          </ul>
        </div>
      )}
    </div>
  );
}
