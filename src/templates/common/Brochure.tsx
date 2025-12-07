import { memo, useState } from "react";
import { FileText } from "lucide-react";
import CTAButtons from "@/components/CTAButtons";

interface Document {
  title: string;
  url: string;
}

interface BrochureProps {
  coverImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  documents?: Document[];
  onCtaClick: () => void;
}

const FALLBACK_IMAGE =
  "https://via.placeholder.com/800x600?text=Brochure+Unavailable";

const Brochure = memo(
  ({
    coverImage,
    heroTitle = "A lifestyle project that suits your needs.",
    heroSubtitle = "Explore detailed information on floor plans, amenities, pricing, layout plans and official documents.",
    documents = [],
    onCtaClick
  }: BrochureProps) => {
    const [imgSrc, setImgSrc] = useState(coverImage || FALLBACK_IMAGE);

    return (
      <section id="brochure" className="py-20 lg:py-28 bg-muted/30 scroll-mt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 items-center">

            {/* LEFT: Brochure Image */}
            <div className="lg:w-1/2 w-full">
              <img
                src={imgSrc}
                alt={heroTitle}
                loading="lazy"
                className="w-full h-auto rounded-2xl shadow-lg object-cover transition-opacity duration-300"
                onError={() => setImgSrc(FALLBACK_IMAGE)}
              />
            </div>

            {/* RIGHT: Content */}
            <div className="lg:w-1/2 w-full flex flex-col justify-center space-y-6">

              <header>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">{heroTitle}</h2>
                <p className="text-lg text-muted-foreground">{heroSubtitle}</p>
              </header>

              {/* Documents */}
              {Array.isArray(documents) && documents.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold mb-4 text-foreground">Official Documents</h3>
                  <ul className="space-y-3">
                    {documents.map((doc, idx) =>
                      doc?.title && doc?.url ? (
                        <li key={idx}>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary-dark flex items-center gap-3 group transition-colors"
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <FileText className="w-5 h-5" />
                            </div>
                            <span className="font-medium">{doc.title}</span>
                          </a>
                        </li>
                      ) : null
                    )}
                  </ul>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="pt-2">
                <CTAButtons onFormOpen={onCtaClick} variant="compact" />
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }
);

Brochure.displayName = "Brochure";

export default Brochure;
