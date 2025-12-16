// src/templates/common/Views_component/ViewLightbox.tsx

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export default function ViewLightbox({ open, index, images, onClose }) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={images.map((i) => ({ src: i.src, title: i.title }))}
      plugins={[Captions, Thumbnails]}
      captions={{ showToggle: true }}
    />
  );
}
