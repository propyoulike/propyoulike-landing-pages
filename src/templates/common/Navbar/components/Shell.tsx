// src/templates/common/Navbar/components/Shell.tsx
export default function NavbarShell({ sticky, shrink, children }) {
  return (
    <header
      className={`
        w-full z-[9999] transition-all duration-300
        ${sticky
          ? "fixed top-0 bg-background/95 backdrop-blur-md shadow-sm border-b"
          : "absolute top-0 bg-transparent"
        }
      `}
    >
      <nav
        className={`
          container mx-auto px-4 flex items-center justify-between transition-all duration-300
          ${shrink ? "py-2" : "py-3 md:py-4"}
        `}
      >
        {children}
      </nav>
    </header>
  );
}
