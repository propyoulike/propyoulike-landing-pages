// src/templates/common/Faq_component/components/FAQHeader.tsx

export default function FAQHeader({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  if (!title && !subtitle) return null;

  return (
    <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
      {title && (
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
          {title}
        </h2>
      )}

      {subtitle && (
        <p className="text-base md:text-lg text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}
