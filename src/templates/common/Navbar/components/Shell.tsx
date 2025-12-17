// src/templates/common/Navbar/components/Shell.tsx

interface NavbarShellProps {
  sticky: boolean;
  shrink: boolean;
  children: React.ReactNode;
}

export default function NavbarShell({
  sticky,
  shrink,
  children,
}: NavbarShellProps) {
  return (
    <>
      {/* Spacer prevents layout shift when navbar becomes fixed */}
      {sticky && (
        <div
          aria-hidden
          className={shrink ? "h-14" : "h-16 md:h-20"}
        />
      )}

      <header
        className={`
          w-full z-[9999]
          transition-all duration-300
          motion-reduce:transition-none
          pointer-events-auto
          ${sticky
            ? "fixed top-0 bg-background/95 backdrop-blur-md shadow-sm border-b"
            : "absolute top-0 bg-transparent"
          }
        `}
        style={{
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        <nav
          className={`
            container mx-auto px-4
            flex items-center justify-between
            transition-all duration-300
            motion-reduce:transition-none
            ${shrink ? "py-2" : "py-3 md:py-4"}
          `}
        >
          {children}
        </nav>
      </header>
    </>
  );
}
