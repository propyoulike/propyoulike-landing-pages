import PropYouLike from "@/content/global/propyoulike.json";

interface FooterProps {
  project?: any;
  builder?: {
    name?: string;
    logo?: string;
  };
  city?: string;
}

export default function Footer({
  project,
  builder,
  city,
}: FooterProps) {
  // Resolve context safely
  const resolvedBuilder =
    project?.aboutBuilder ?? builder ?? null;

  const builderName = resolvedBuilder?.name;
  const builderLogo = resolvedBuilder?.logo;
  const projectName = project?.projectName;

  return (
    <footer className="relative mt-16 bg-gradient-to-b from-[#060B16] to-[#020617] text-muted-foreground">
      <div className="container mx-auto px-4">

        {/* ─────────────────────────────────
           TOP: Context (Builder / Project / City)
        ───────────────────────────────── */}
        {(builderName || projectName || city) && (
          <div className="py-6">
            <div className="flex items-center gap-3">
              {builderLogo && (
                <img
                  src={builderLogo}
                  alt={builderName}
                  className="h-8 w-auto object-contain opacity-90"
                />
              )}

              <div>
                {builderName && (
                  <div className="text-sm font-semibold text-white">
                    {builderName}
                  </div>
                )}

                {projectName && (
                  <div className="text-xs text-muted-foreground">
                    {projectName}
                  </div>
                )}

                {!projectName && city && (
                  <div className="text-xs text-muted-foreground">
                    Properties in {city}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-white/10" />

        {/* ─────────────────────────────────
           BOTTOM: Compliance + Legal
        ───────────────────────────────── */}
        <div className="py-6 space-y-3 text-xs leading-relaxed">

          {/* Brand + RERA */}
          <div className="flex items-start gap-3">
            <img
              src={PropYouLike.logo}
              alt="PropYouLike"
              className="h-6 w-auto opacity-80"
            />
            <p className="max-w-3xl">
              {PropYouLike.rera.disclaimer}
            </p>
          </div>

          {/* RERA Registration */}
          {PropYouLike.rera?.id && (
            <p>
              <span className="font-medium text-white/80">
                RERA Registration ({PropYouLike.rera.state}):
              </span>{" "}
              {PropYouLike.rera.id}
            </p>
          )}

          {/* Legal links */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white">
              Terms of Use
            </a>
            <a
              href={PropYouLike.rera.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              RERA Disclaimer
            </a>
          </div>

          {/* Copyright */}
          <p className="pt-2 text-white/40">
            © {new Date().getFullYear()} PropYouLike. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
