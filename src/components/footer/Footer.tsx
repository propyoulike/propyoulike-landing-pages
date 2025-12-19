import PropYouLike from "@/content/global/propyoulike.json";
import {
  Youtube,
  Linkedin,
  Instagram,
  Facebook,
} from "lucide-react";

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
  /* -------------------------------------------------
     Resolve context (Project → Builder → City → Home)
  -------------------------------------------------- */
  const resolvedBuilder =
    project?.aboutBuilder ?? builder ?? null;

  const builderName = resolvedBuilder?.name;
  const builderLogo = resolvedBuilder?.logo;
  const projectName = project?.projectName;

  const showContext =
    builderName || projectName || city;

  const social = PropYouLike.social ?? {};

  return (
    <footer className="relative mt-16 bg-gradient-to-b from-[#060B16] to-[#020617] text-muted-foreground">
      <div className="container mx-auto px-4">

        {/* ─────────────────────────────────
           TOP CONTEXT (hidden on homepage)
        ───────────────────────────────── */}
        {showContext && (
          <>
            <div className="py-6">
              <div className="flex items-center gap-3">
                {builderLogo && (
                  <img
                    src={builderLogo}
                    alt={builderName}
                    className="h-6 w-auto object-contain opacity-80"
                    loading="lazy"
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

            <div className="border-t border-white/10" />
          </>
        )}

        {/* ─────────────────────────────────
           BOTTOM: Brand + Compliance + Social
        ───────────────────────────────── */}
        <div className="py-6 space-y-4 text-xs leading-relaxed">

          {/* Brand + RERA Disclaimer */}
          {PropYouLike?.rera?.disclaimer && (
            <div className="flex items-start gap-3">
              {PropYouLike.logo && (
                <img
                  src={PropYouLike.logo}
                  alt="PropYouLike"
                  className="h-5 w-auto opacity-70"
                  loading="lazy"
                />
              )}
              <p className="max-w-3xl">
                {PropYouLike.rera.disclaimer}
              </p>
            </div>
          )}

          {/* RERA Registration */}
          {PropYouLike?.rera?.id && (
            <p>
              <span className="font-medium text-white/80">
                RERA Registration ({PropYouLike.rera.state}):
              </span>{" "}
              {PropYouLike.rera.id}
            </p>
          )}

          {/* Social Icons (trust zone only) */}
          {(social.youtube ||
            social.linkedin ||
            social.instagram ||
            social.facebook) && (
            <div className="flex items-center gap-4 pt-2">
              {social.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="hover:text-white transition"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}

              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="hover:text-white transition"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}

              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-white transition"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}

              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="hover:text-white transition"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          )}

          {/* Legal links */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white">
              Terms of Use
            </a>
            {PropYouLike?.rera?.verificationUrl && (
              <a
                href={PropYouLike.rera.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                RERA Disclaimer
              </a>
            )}
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
