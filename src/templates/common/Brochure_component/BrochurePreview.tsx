import { memo, useState } from "react";

const BrochurePreview = memo(function BrochurePreview({
  image,
  onPreviewClick,
}: {
  image?: string | null;
  onPreviewClick?: () => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(image) && !imageFailed;

  return (
    <div className="lg:w-1/2 w-full">
      {hasImage ? (
        <button
          className="w-full text-left group"
          onClick={onPreviewClick}
        >
          <img
            src={image!}
            alt="Project brochure preview"
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="
              w-full h-auto
              rounded-2xl shadow-lg
              object-cover
              group-hover:opacity-90
              transition
            "
          />
        </button>
      ) : (
        <div className="w-full h-[320px] rounded-2xl bg-muted flex items-center justify-center text-muted-foreground text-sm">
          Brochure preview available on request
        </div>
      )}
    </div>
  );
});

export default BrochurePreview;
