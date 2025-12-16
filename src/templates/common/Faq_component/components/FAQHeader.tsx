// src/templates/common/Faq_component/components/FAQHeader.tsx
import React from "react";

export default function FAQHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-10">
      <h2 className="text-3xl lg:text-5xl font-bold">{title}</h2>
      {subtitle && (
        <p className="text-lg text-muted-foreground mt-3">{subtitle}</p>
      )}
    </div>
  );
}
