// src/templates/common/Views_component/ViewLightbox.tsx

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { cfImage } from "@/lib/media/cloudflareImage";

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

  const slides = images.map((img) => ({
    src: cfImage(img.src, {
      width: isMobile ? 1600 : 2400,
      quality: 90,
    }),
    title: img.title,
  }));

  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={slides}

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
