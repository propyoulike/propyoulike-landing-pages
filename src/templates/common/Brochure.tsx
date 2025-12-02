import { FileText } from "lucide-react";
import CTAButtons from "./CTAButtons";
import { useEffect, useRef } from "react";

export interface DocumentLink {
  label: string;
  href: string;
}

interface BrochureProps {
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  documents?: DocumentLink[];
  onCtaClick: () => void;
}

const Brochure = ({
  title,
  subtitle,
  description,
  imageUrl,
  documents = [],
  onCtaClick,
}: BrochureProps) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (typeof (window as any).gtag === "function") {
            (window as any).gtag("event", "section_view", {
              event_category: "engagement",
              event_label: "Brochure Section",
            });
          }

          if (typeof (window as any).fbq === "function") {
            (window as any).fbq("trackCustom", "BrochureSectionViewed");
          }
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 lg:py-24 scroll-mt-32 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div
            className="bg-card rounded-2xl p-6 sm:p-8 lg:p-12"
            style={{ boxShadow: "var(--shadow-strong)" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* LEFT IMAGE */}
              <div className="w-full">
                <div className="w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={imageUrl}
                    alt="Brochure Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* RIGHT TEXT */}
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground leading-tight">
                  {title} <br />
                  {subtitle && <span className="text-primary">{subtitle}</span>}
                </h2>

                <p className="text-lg text-muted-foreground mb-6 lg:mb-8 leading-relaxed">
                  {description}
                </p>

                {/* DOCUMENT LINKS */}
                {documents.length > 0 && (
                  <div className="pt-4">
                    <h3 className="text-xl font-bold mb-4 text-foreground">
                      Official Documents
                    </h3>
                    <div className="flex flex-col gap-3">
                      {documents.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
                        >
                          <FileText className="w-5 h-5" /> {doc.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 pt-8 border-t border-border w-full">
              <div className="w-full flex flex-col sm:flex-row gap-4">
                <CTAButtons onFormOpen={onCtaClick} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Brochure;
