// src/templates/common/brochure/DocumentList.tsx
import { memo } from "react";
import DocumentItem from "./DocumentItem";

const DocumentList = memo(function DocumentList({ documents = [] }) {
  if (!documents.length) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-semibold mb-4">Official Documents</h3>

      <ul className="space-y-3">
        {documents.map((doc, i) => (
          <DocumentItem key={i} doc={doc} />
        ))}
      </ul>
    </div>
  );
});

export default DocumentList;
