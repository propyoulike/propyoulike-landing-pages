import React from "react";
import PropYouLike from "@/content/global/propyoulike.json";

/* -------------------------------------------------
   Minimal markdown renderer (SAFE)
-------------------------------------------------- */
function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
.replace(
  /##RERA_DYNAMIC##/g,
  `<strong>RERA Registration (${PropYouLike.rera.state}):</strong> ${PropYouLike.rera.id}<br/>
   <a href="${PropYouLike.rera.verificationUrl}" target="_blank" rel="noopener noreferrer">
     Verify on State RERA Portal
   </a>`
);
}

/* -------------------------------------------------
   Types (STRICT)
-------------------------------------------------- */
interface LegalSection {
  heading: string;
  body: string;
}

interface LegalPageProps {
  title: string;
  updatedOn?: string;
  content: LegalSection[];
}

/* =================================================
   Legal Page
================================================== */
export default function LegalPage({
  title,
  updatedOn,
  content,
}: LegalPageProps) {
  return (
    <div className="container mx-auto px-4 py-12 text-gray-800 max-w-3xl">
      <h1 className="text-3xl font-semibold mb-4">{title}</h1>

      {updatedOn && (
        <p className="text-sm text-gray-500 mb-6">
          Last Updated: {updatedOn}
        </p>
      )}

      <div className="space-y-8">
        {content.map((section, i) => (
          <section key={i}>
            <h2 className="text-xl font-semibold mb-2">
              {section.heading}
            </h2>

            <p
              className="text-gray-700 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(section.body),
              }}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
