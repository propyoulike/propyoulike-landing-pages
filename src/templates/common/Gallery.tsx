import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface GalleryProps {
  images: Array<{
    url: string;
    caption?: string;
    category?: string;
  }>;
}

const Gallery = ({ images }: GalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Project Gallery
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore stunning visuals of our premium development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.url}
                alt={image.caption || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                {image.caption && (
                  <p className="text-primary-foreground font-medium">{image.caption}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        <Dialog open={selectedImage !== null} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-7xl w-full p-0 bg-primary/95 border-0">
            <div className="relative">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-50 p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full backdrop-blur-sm transition-colors"
              >
                <X className="w-6 h-6 text-primary-foreground" />
              </button>

              {selectedImage !== null && (
                <>
                  <img
                    src={images[selectedImage].url}
                    alt={images[selectedImage].caption || ""}
                    className="w-full h-auto max-h-[90vh] object-contain"
                  />

                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full backdrop-blur-sm transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-primary-foreground" />
                  </button>

                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full backdrop-blur-sm transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-primary-foreground" />
                  </button>

                  {images[selectedImage].caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-primary to-transparent">
                      <p className="text-primary-foreground text-center text-lg">
                        {images[selectedImage].caption}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Gallery;
