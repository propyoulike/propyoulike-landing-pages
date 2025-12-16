// src/templates/common/brochure/DocumentItem.tsx
import { memo } from "react";
import { FileText } from "lucide-react";

const DocumentItem = memo(function DocumentItem({ doc }) {
  if (!doc?.title || !doc?.url) return null;

  return (
    <li>
      <a
        href={doc.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 text-primary group"
      >
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
          <FileText className="w-5 h-5" />
        </div>
        <span className="font-medium">{doc.title}</span>
      </a>
    </li>
  );
});

export default DocumentItem;
