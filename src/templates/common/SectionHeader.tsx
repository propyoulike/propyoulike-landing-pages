import type { SectionMeta } from "@/content/types/sectionMeta";

interface SectionHeaderProps extends SectionMeta {
  align?: "left" | "center";
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  tagline,
  align = "left",
}: SectionHeaderProps) {
  return (
    <header
      className={`max-w-4xl ${
        align === "center" ? "mx-auto text-center" : ""
      }`}
    >
      {eyebrow && (
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-2">
          {eyebrow}
        </p>
      )}

      <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 text-lg text-muted-foreground">
          {subtitle}
        </p>
      )}

      {tagline && (
        <p className="mt-4 text-sm text-muted-foreground italic">
          {tagline}
        </p>
      )}
    </header>
  );
}
