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
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-10">

          {/* LEFT: Brochure Image */}
          <div className="lg:w-1/2 w-full">
            <img
              src={imgSrc}
              alt={heroTitle}
              loading="lazy"
              className="
                w-full h-auto rounded-xl shadow-md object-cover
                transition-opacity duration-300
              "
              onError={() => setImgSrc(FALLBACK_IMAGE)}
            />
          </div>

          {/* RIGHT: Content */}
          <div className="lg:w-1/2 w-full flex flex-col justify-center space-y-6">

            <header>
              <h2 className="text-3xl font-bold mb-4">{heroTitle}</h2>
              <p className="text-gray-600">{heroSubtitle}</p>
            </header>

            {/* Documents */}
            {Array.isArray(documents) && documents.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Official Documents</h3>
                <ul className="space-y-3">
                  {documents.map((doc, idx) =>
                    doc?.title && doc?.url ? (
                      <li key={idx}>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-2 group"
                        >
                          <FileText className="group-hover:text-blue-800" />
                          <span>{doc.title}</span>
                        </a>
                      </li>
                    ) : null
                  )}
                </ul>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="w-full flex flex-wrap gap-4 pt-4">
              <CTAButtons onFormOpen={onCtaClick} />
            </div>

          </div>
        </div>
      </section>
    );
  }
);

Brochure.displayName = "Brochure";

export default Brochure;
