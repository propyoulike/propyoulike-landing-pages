// src/templates/common/Views_component/ViewLightbox.tsx

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface ViewLightboxProps {
  open: boolean;
  index: number;
  images: { src: string; title?: string }[];
  onClose: () => void;
}

export default function ViewLightbox({
  open,
  index,
  images,
  onClose,
}: ViewLightboxProps) {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={images.map((img) => ({
        src: img.src,
        title: img.title,
      }))}

      /* UX defaults */
      controller={{ closeOnBackdropClick: true }}
      carousel={{ finite: false }}

      /* Plugins */
      plugins={isMobile ? [Captions] : [Captions, Thumbnails]}

      captions={{
        showToggle: false, // 🔒 always visible
      }}
    />
  );
}
