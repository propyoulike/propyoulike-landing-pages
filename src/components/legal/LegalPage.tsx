import React from "react";

function renderMarkdown(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

export default function LegalPage({ title, updatedOn, content }) {
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
          <div key={i}>
            <h2 className="text-xl font-semibold mb-2">{section.heading}</h2>

            <p
              className="text-gray-700 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(section.body) }}
            ></p>
          </div>
        ))}
      </div>
    </div>
  );
}
