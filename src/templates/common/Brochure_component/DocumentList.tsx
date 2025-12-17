// src/templates/common/brochure/DocumentList.tsx
import { memo } from "react";
import DocumentItem from "./DocumentItem";

interface DocumentListProps {
  documents?: {
    title?: string;
    url?: string;
  }[];
}

const DocumentList = memo(function DocumentList({
  documents = [],
}: DocumentListProps) {
  const validDocs = documents.filter(
    (d) => d?.title && d?.url
  );

  if (!validDocs.length) return null;

  return (
    <section
      aria-labelledby="official-documents-heading"
      className="
        bg-card border border-border
        rounded-2xl
        p-5 md:p-6
        shadow-sm
      "
    >
      {/* Header */}
      <h3
        id="official-documents-heading"
        className="text-base font-semibold mb-4 text-foreground"
      >
        Official Documents
      </h3>

      {/* List */}
      <ul className="space-y-3">
        {validDocs.map((doc, i) => (
          <DocumentItem key={i} doc={doc} />
        ))}
      </ul>
    </section>
  );
});

export default DocumentList;
