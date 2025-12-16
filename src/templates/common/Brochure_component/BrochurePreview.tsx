// src/templates/common/brochure/BrochurePreview.tsx
import { memo } from "react";

const BrochurePreview = memo(function BrochurePreview({
  image,
  title,
  subtitle,
  onPreviewClick,
}) {
  const hasImage = Boolean(image);

  return (
    <div className="lg:w-1/2 w-full">
      {hasImage ? (
        <button
          className="w-full text-left group"
          onClick={onPreviewClick}
        >
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-auto rounded-2xl shadow-lg object-cover group-hover:opacity-90 transition"
          />
        </button>
      ) : (
        <div className="w-full h-[320px] rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
          Brochure preview available on request
        </div>
      )}

      {/* Text */}
      <div className="mt-6">
        <h2 className="text-3xl lg:text-4xl font-bold mb-3">{title}</h2>
        <p className="text-muted-foreground text-lg">{subtitle}</p>
      </div>
    </div>
  );
});

export default BrochurePreview;
