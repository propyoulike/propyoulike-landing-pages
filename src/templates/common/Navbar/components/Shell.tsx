// src/templates/common/Navbar/components/Shell.tsx

interface NavbarShellProps {
  sticky: boolean;
  shrink: boolean;
  children: React.ReactNode;
}

const NAVBAR_HEIGHT = "h-16 md:h-20"; // 🔒 SINGLE SOURCE OF TRUTH

export default function NavbarShell({
  sticky,
  shrink,
  children,
}: NavbarShellProps) {
  return (
    <>
      {/* 🔒 FIXED spacer — NEVER changes height */}
      <div aria-hidden className={NAVBAR_HEIGHT} />

      <header
        className={[
          "w-full z-[9999]",
          "fixed top-0", // 🔒 always fixed → no mode switch
          "bg-background/95 backdrop-blur-md border-b",
          "motion-reduce:transition-none",
        ].join(" ")}
        style={{
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        <nav
          className={[
            "container mx-auto px-4",
            NAVBAR_HEIGHT,
            "flex items-center justify-between",
          ].join(" ")}
        >
          {/* 🔒 Inner wrapper animates visually */}
          <div
            className={[
              "flex items-center justify-between w-full",
              "transition-transform duration-200",
              shrink ? "scale-[0.94]" : "scale-100",
            ].join(" ")}
          >
            {children}
          </div>
        </nav>
      </header>
    </>
  );
}
