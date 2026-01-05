import PropYouLike from "@/content/global/propyoulike.json";
import { Youtube, Linkedin, Instagram, Facebook } from "lucide-react";

interface FooterProps {
  project?: {
    projectName?: string;
    city?: string;
    builder?: string; // 👈 builder slug
  };
  builder?: {
    name?: string;
    logo?: string;
  };
}

export default function Footer({ project, builder }: FooterProps) {
  const builderName = builder?.name;
  const builderLogo = builder?.logo;
  const projectName = project?.projectName;
  const city = project?.city;
  const builderSlug = project?.builder;

  const social = PropYouLike.social ?? {};

  return (
    <footer
      id="site-footer"
      className="relative mt-16 bg-gradient-to-b from-[#060B16] to-[#020617] text-muted-foreground"
    >
      <div className="container mx-auto px-4">

        {/* PLATFORM IDENTITY */}
        <div className="py-6 flex items-center gap-3">
          {PropYouLike.logo && (
            <img
              src={PropYouLike.logo}
              alt="PropYouLike"
              className="h-7 w-auto object-contain opacity-90"
              loading="lazy"
            />
          )}
          <div className="text-sm font-semibold text-white">
            {PropYouLike.name}
          </div>
        </div>

        <div className="border-t border-white/10" />

        {/* CONTEXT (BUILDER / PROJECT) */}
        {(builderName || projectName || city) && (
          <>
            <div className="py-6">
              <div className="flex items-center gap-3">
                {builderLogo && (
                  <img
                    src={builderLogo}
                    alt={builderName ?? "Builder"}
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

                  {/* 🔗 INTERNAL LINK: Project → Builder */}
                  {builderSlug && (
                    <div className="mt-2">
                      <a
                        href={`/${builderSlug}/`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        View all {builderName ?? builderSlug} projects
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-white/10" />
          </>
        )}

        {/* COMPLIANCE */}
        <div className="py-6 space-y-4 text-xs leading-relaxed">
          <p className="max-w-3xl">
            <strong>Channel Partner Disclosure:</strong>{" "}
            PropYouLike is a RERA-registered real estate marketing platform and
            acts as an official channel partner for select developers. We assist
            homebuyers with verified project information, pricing guidance, and
            site visit coordination. PropYouLike is not the developer, promoter,
            or owner of the projects listed on this website.
          </p>

          <p>
            <strong>Contact:</strong>{" "}
            <a href="mailto:hi@propyoulike.com">hi@propyoulike.com</a> | +91 93798
            22010
          </p>

          <p>
            <strong>Address:</strong> Banashankari 3rd Stage, Bengaluru,
            Karnataka, India – 560085
          </p>

          <p>
            <strong>RERA Registration ({PropYouLike.rera.state}):</strong>{" "}
            {PropYouLike.rera.id}
          </p>

          {(social.youtube ||
            social.linkedin ||
            social.instagram ||
            social.facebook) && (
            <div className="flex items-center gap-4 pt-2">
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-4 w-4" />
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-2">
            <a href="/legal/about" target="_blank" rel="noopener noreferrer">About Us</a>
            <a href="/legal/contact" target="_blank" rel="noopener noreferrer">Contact Us</a>
            <a href="/legal/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            <a href="/legal/terms" target="_blank" rel="noopener noreferrer">Terms of Use</a>
            <a href="/legal/rera" target="_blank" rel="noopener noreferrer">RERA Disclaimer</a>
          </div>

          <p className="pt-2 text-white/40">
            © {new Date().getFullYear()} PropYouLike. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
