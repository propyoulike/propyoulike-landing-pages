// src/templates/common/Navbar/components/LogoBlock.tsx
export default function LogoBlock({ builderLogo, logo, shrink, projectName, onClick }) {
  return (
    <button
      className="flex items-center gap-3 focus:outline-none rounded"
      onClick={onClick}
    >
      {builderLogo && (
        <img
          src={builderLogo}
          className={`${shrink ? "h-7" : "h-9"} transition-all`}
          alt="Builder logo"
        />
      )}

      {builderLogo && logo && (
        <div className={`${shrink ? "h-6" : "h-8"} w-px bg-border`} />
      )}

      {logo ? (
        <img
          src={logo}
          className={`${shrink ? "h-8" : "h-10"} transition-all`}
          alt="Project logo"
        />
      ) : (
        <span className={`${shrink ? "text-sm" : "text-base"} font-bold`}>
          {projectName}
        </span>
      )}
    </button>
  );
}
