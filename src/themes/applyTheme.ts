function toKebab(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export function applyTheme(theme: Record<string, any>) {
  const root = document.documentElement;

  Object.entries(theme).forEach(([group, values]) => {
    if (typeof values !== "object" || values === null) return;

    Object.entries(values).forEach(([key, value]) => {
      const cssVar = `--${toKebab(key)}`;
      root.style.setProperty(cssVar, String(value));
    });
  });
}
