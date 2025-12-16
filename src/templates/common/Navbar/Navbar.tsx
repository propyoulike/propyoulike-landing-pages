// src/templates/common/Navbar/Navbar.tsx
import { memo } from "react";

import Shell from "./components/Shell";
import LogoBlock from "./components/LogoBlock";
import DesktopMenu from "./components/DesktopMenu";
import MobileMenu from "./components/MobileMenu";

import { useNavbarState } from "./hooks/useNavbarState";
import { useScrollTo } from "./hooks/useScrollTo";
import { useScrollSpy } from "./hooks/useScrollSpy";

function Navbar({ logo, builderLogo, projectName, autoMenu = [], ctaLabel, onCtaClick }) {
  const { sticky, shrink, mobileOpen, toggleMobile, closeMobile } = useNavbarState();
  const scrollTo = useScrollTo();

  // ScrollSpy
  const ids = autoMenu.map((m) => m.id);
  const activeId = useScrollSpy(ids);

  const handleSelect = (id: string) => scrollTo(id);

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

        <DesktopMenu menu={autoMenu} activeId={activeId} onSelect={handleSelect} />

        {/* Mobile toggle */}
        <button
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

export default Navbar;
