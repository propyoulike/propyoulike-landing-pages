// src/templates/common/Navbar/hooks/useScrollTo.ts
export function useScrollTo() {
  return function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    const navbar = document.querySelector("header");
    const offset = navbar ? navbar.clientHeight + 12 : 80;

    const top =
      el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });

    // Update URL
    window.history.replaceState(null, "", `#${id}`);
  };
}
