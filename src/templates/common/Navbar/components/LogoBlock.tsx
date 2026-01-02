// src/templates/common/Navbar/components/LogoBlock.tsx

interface LogoBlockProps {
  builderLogo?: string | null;
  logo?: string | null;
  projectName?: string;
  shrink?: boolean;
  onClick?: () => void;
}

export default function LogoBlock({
  builderLogo,
  logo,
  projectName,
  shrink = false,
  onClick,
}: LogoBlockProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go to top of the page"
      className="
        flex items-center gap-3
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
        rounded-lg
      "
    >
      {/* -------- Builder Logo -------- */}
      {builderLogo && (
        <img
          src={builderLogo}
          alt="Builder logo"
          width={shrink ? 28 : 36}
          height={shrink ? 28 : 36}
          className="transition-all object-contain"
          draggable={false}
        />
      )}

      {/* -------- Divider -------- */}
      {builderLogo && (logo || projectName) && (
        <span
          aria-hidden
          className={`${
            shrink ? "h-6" : "h-8"
          } w-px bg-border`}
        />
      )}

      {/* -------- Project Logo OR Name -------- */}
{logo ? (
  <img
    src={logo}
    alt={projectName ? `${projectName} logo` : "Project logo"}
    width={shrink ? 32 : 40}
    height={shrink ? 32 : 40}
    className="transition-all object-contain"
    draggable={false}
  />
) : projectName ? (
  <span
    className={`${
      shrink ? "text-sm" : "text-base"
    } font-bold leading-none text-foreground whitespace-nowrap`}
  >
    {projectName}
  </span>
) : null}
    </button>
  );
}
