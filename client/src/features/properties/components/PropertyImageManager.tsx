import { useState } from "react";
import { Star, Trash2, Loader2, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { usePropertyImages, useUploadPropertyImage } from "../api/property.queries";
import { useImageManagerMutations } from "../api/property.image.queries";
import { validateImageFile } from "@/lib/upload";
import type { PropertyImage } from "../types/property.types";

interface PropertyImageManagerProps {
  propertyId: string;
}

export function PropertyImageManager({
  propertyId,
}: PropertyImageManagerProps) {
  const [uploading, setUploading] = useState(false);

  const { data: images = [], isLoading } = usePropertyImages(propertyId);
  const { mutate: uploadImage } = useUploadPropertyImage();
  const { setAsPrimary, deleteImage } = useImageManagerMutations(propertyId);

  const handleFileSelected = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setUploading(true);

    uploadImage(
      { propertyId, file },
      {
        onSuccess: () => {
          toast.success("Image uploaded");
          setUploading(false);
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          toast.error(
            err.response?.data?.message ?? "Failed to upload image",
          );
          setUploading(false);
        },
      },
    );
  };

  const handleSetPrimary = (image: PropertyImage) => {
    if (image.isPrimary) return;

    setAsPrimary.mutate(
      { imageId: image.id, isPrimary: true },
      {
        onSuccess: () => toast.success("Primary image updated"),
        onError: () => toast.error("Failed to update primary image"),
      },
    );
  };

  const handleDelete = (image: PropertyImage) => {
    deleteImage.mutate(
      { imageId: image.id },
      {
        onSuccess: () => toast.success("Image deleted"),
        onError: () => toast.error("Failed to delete image"),
      },
    );
  };

  return (
    <section className="rounded-xl border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border p-6">
        <div>
          <h2 className="font-semibold">Property images</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The primary image is shown in search results and listing cards.
          </p>
        </div>

        <label
          htmlFor="propertyImageUpload"
          className={`inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 ${
            uploading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          {uploading ? "Uploading..." : "Add image"}
        </label>

        <input
          id="propertyImageUpload"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          disabled={uploading}
          onChange={handleFileSelected}
        />
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-video animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No images yet. Add one to make your listing stand out.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((image) => (
              <div
                key={image.id}
                className={`group relative aspect-video overflow-hidden rounded-lg border-2 transition ${
                  image.isPrimary
                    ? "border-primary"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image.imageUrl}
                  alt="Property"
                  className="h-full w-full object-cover"
                />

                {/* Primary badge */}
                {image.isPrimary && (
                  <div className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                    Primary
                  </div>
                )}

                {/* Actions overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  {!image.isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(image)}
                      disabled={setAsPrimary.isPending}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
                      aria-label="Set as primary"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(image)}
                    disabled={deleteImage.isPending}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-red-500/70"
                    aria-label="Delete image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}