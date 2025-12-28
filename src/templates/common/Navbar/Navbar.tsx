// src/templates/common/Navbar/Navbar.tsx

import { memo, useMemo, useRef, useEffect } from "react";

import Shell from "./components/Shell";
import LogoBlock from "./components/LogoBlock";
import DesktopMenu from "./components/DesktopMenu";
import MobileMenu from "./components/MobileMenu";

import { useNavbarState } from "./hooks/useNavbarState";
import { useScrollTo } from "./hooks/useScrollTo";
import { useScrollSpy } from "./hooks/useScrollSpy";

/* -------------------------------------------------
   Types
-------------------------------------------------- */
export interface NavbarMenuItem {
  id: string;
  label: string;
}

interface NavbarProps {
  /** Brand logos */
  logo?: string;
  builderLogo?: string;

  /** Context */
  projectName?: string;

  /** Auto-generated menu from sections */
  autoMenu?: NavbarMenuItem[];

  /** CTA */
  ctaLabel?: string;
  onCtaClick?: (source?: string) => void;
}

/* -------------------------------------------------
   Component
-------------------------------------------------- */
function Navbar({
  logo,
  builderLogo,
  projectName,
  autoMenu = [],
  ctaLabel = "Book site visit",
  onCtaClick,
}: NavbarProps) {
  const {
    sticky,
    shrink,
    mobileOpen,
    toggleMobile,
    closeMobile,
  } = useNavbarState();

  // 🔒 Shared lock between scrollTo & scrollSpy
  const scrollLockRef = useRef(false);

  const scrollTo = useScrollTo(scrollLockRef);

  /* -------------------------------------------------
     DIAGNOSTIC LOGS (DEV ONLY)
  -------------------------------------------------- */
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    console.groupCollapsed("[Navbar] props snapshot");
    console.log("projectName:", projectName);
    console.log("logo:", logo);
    console.log("builderLogo:", builderLogo);
    console.log("autoMenu:", autoMenu);
    console.groupEnd();
  }, [projectName, logo, builderLogo, autoMenu]);

  // Stable ids for scroll spy
  const ids = useMemo(() => {
    const result = autoMenu.map((m) => m.id);

    if (import.meta.env.DEV) {
      console.log("[Navbar] scrollSpy ids:", result);
    }

    return result;
  }, [autoMenu]);

  const activeId = useScrollSpy(ids, scrollLockRef);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    console.log("[Navbar] activeId (scrollSpy):", activeId);
  }, [activeId]);

  const handleSelect = (id: string) => {
    if (import.meta.env.DEV) {
      console.log("[Navbar] menu click → scrollTo:", id);
    }

    scrollTo(id);
    closeMobile();
  };

  const handleCta = () => {
    if (import.meta.env.DEV) {
      console.log("[Navbar] CTA clicked");
    }

    onCtaClick?.("navbar_primary");
    closeMobile();
  };

  return (
    <>
      <Shell sticky={sticky} shrink={shrink}>
        <LogoBlock
          builderLogo={builderLogo}
          logo={logo}
          projectName={projectName}
          shrink={shrink}
          onClick={() => {
            if (import.meta.env.DEV) {
              console.log("[Navbar] logo click → scrollTo: hero");
            }
            scrollTo("hero");
          }}
        />

        <DesktopMenu
          menu={autoMenu}
          activeId={activeId}
          onSelect={handleSelect}
          ctaLabel={ctaLabel}
          onCtaClick={handleCta}
        />

        <button
          aria-label="Toggle navigation"
          className="lg:hidden p-2 rounded-lg hover:bg-muted"
          onClick={toggleMobile}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </Shell>

      <MobileMenu
        open={mobileOpen}
        menu={autoMenu}
        activeId={activeId}
        onSelect={handleSelect}
        onClose={closeMobile}
        ctaLabel={ctaLabel}
        onCtaClick={handleCta}
      />
    </>
  );
}

export default memo(Navbar);
