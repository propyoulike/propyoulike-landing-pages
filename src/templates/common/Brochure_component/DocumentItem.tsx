// src/templates/common/brochure/DocumentItem.tsx
import { memo } from "react";
import { FileText } from "lucide-react";

interface DocumentItemProps {
  doc?: {
    title?: string;
    url?: string;
  };
}

const DocumentItem = memo(function DocumentItem({ doc }: DocumentItemProps) {
  if (!doc?.title || !doc?.url) return null;

  return (
    <li>
      <a
        href={doc.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open document: ${doc.title}`}
        className="
          group flex items-center gap-4
          rounded-xl border border-border
          px-4 py-3
          bg-background
          hover:bg-muted/50
          transition-colors
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-primary
        "
      >
        {/* Icon */}
        <div
          className="
            w-10 h-10 rounded-lg
            bg-muted flex items-center justify-center
            group-hover:bg-primary/10
            transition-colors
          "
          aria-hidden
        >
          <FileText className="w-5 h-5 text-primary" />
        </div>

        {/* Title */}
        <span className="font-medium text-foreground">
          {doc.title}
        </span>
      </a>
    </li>
  );
});

export default DocumentItem;
