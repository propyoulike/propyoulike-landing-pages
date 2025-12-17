// src/templates/common/Navbar/Navbar.tsx
import { memo, useMemo, useRef } from "react";

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
  logo?: string;
  builderLogo?: string;
  projectName?: string;
  autoMenu?: NavbarMenuItem[];
  ctaLabel?: string;
  onCtaClick?: () => void;
}

/* -------------------------------------------------
   Component
-------------------------------------------------- */
function Navbar({
  logo,
  builderLogo,
  projectName,
  autoMenu = [],
  ctaLabel,
  onCtaClick,
}: NavbarProps) {
  const { sticky, shrink, mobileOpen, toggleMobile, closeMobile } =
    useNavbarState();

  // 🔒 shared lock between scrollTo & scrollSpy
  const scrollLockRef = useRef(false);

  const scrollTo = useScrollTo(scrollLockRef);

  // stable ids for spy
  const ids = useMemo(() => autoMenu.map((m) => m.id), [autoMenu]);

  const activeId = useScrollSpy(ids, scrollLockRef);

  const handleSelect = (id: string) => {
    scrollTo(id);
    closeMobile(); // mobile UX fix
  };

  return (
    <>
      <Shell sticky={sticky} shrink={shrink}>
        <LogoBlock
          builderLogo={builderLogo}
          logo={logo}
          projectName={projectName}
          shrink={shrink}
          onClick={() => scrollTo("hero")}
        />

        <DesktopMenu
          menu={autoMenu}
          activeId={activeId}
          onSelect={handleSelect}
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
        onCtaClick={onCtaClick}
      />
    </>
  );
}

export default memo(Navbar);
