import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type {
  Property,
  PropertyImage,
} from "../types/property.types";

interface PropertyGalleryProps {
  property: Property;
  images: PropertyImage[];
}

export function PropertyGallery({
  property,
  images,
}: PropertyGalleryProps) {
  const galleryImages =
    images.length > 0
      ? images
      : property.primaryImage
        ? [property.primaryImage]
        : [];

  const [activeIndex, setActiveIndex] = useState(0);

  if (galleryImages.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-xl bg-muted">
        <p className="text-muted-foreground">
          No images available
        </p>
      </div>
    );
  }

  const activeImage = galleryImages[activeIndex];

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0
        ? galleryImages.length - 1
        : current - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === galleryImages.length - 1
        ? 0
        : current + 1,
    );
  };

  return (
    <div>
      {/* Main image */}
      <div className="group relative overflow-hidden rounded-xl bg-muted">
        <img
          src={activeImage.imageUrl}
          alt={`${property.title} - image ${activeIndex + 1}`}
          className="h-[500px] w-full object-cover"
        />

        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow-md transition hover:scale-105"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={showNext}
              aria-label="Next image"
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow-md transition hover:scale-105"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-4 right-4 rounded-md bg-background/90 px-3 py-1 text-sm font-medium">
              {activeIndex + 1} / {galleryImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {galleryImages.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
          {galleryImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 overflow-hidden rounded-lg border-2 ${
                index === activeIndex
                  ? "border-primary"
                  : "border-transparent"
              }`}
            >
              <img
                src={image.imageUrl}
                alt={`${property.title} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}