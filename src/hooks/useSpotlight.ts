export function useSpotlight() {
  return (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", e.clientX - rect.left + "px");
    e.currentTarget.style.setProperty("--y", e.clientY - rect.top + "px");
  };
}
