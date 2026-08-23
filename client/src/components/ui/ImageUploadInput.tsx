import { useRef, type ChangeEvent } from "react";
import { Upload, Loader2 } from "lucide-react";

interface ImageUploadInputProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
  label?: string;
  currentImageUrl?: string | null;
}

export function ImageUploadInput({
  onFileSelected,
  isUploading,
  label = "Upload image",
  currentImageUrl,
}: ImageUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
    event.target.value = ""; // allow re-selecting the same file
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 text-sm text-muted-foreground transition-colors hover:border-secondary hover:text-foreground disabled:opacity-50"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            Uploading...
          </>
        ) : currentImageUrl ? (
          <>
            <img
              src={currentImageUrl}
              alt="Current"
              className="h-20 w-20 rounded-lg object-cover"
            />
            <span>{label} (click to replace)</span>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6" />
            {label}
          </>
        )}
      </button>

      <p className="mt-1.5 text-center text-xs text-muted-foreground">
        JPEG, PNG, WebP, or AVIF · up to 5MB
      </p>
    </div>
  );
}