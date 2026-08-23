export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB, matches backend
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

// Mirrors the backend's fileFilter rules so users get instant feedback
// instead of waiting on a round-trip that's guaranteed to fail.
export function validateImageFile(file: File): FileValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPEG, PNG, WebP, and AVIF images are allowed",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: "Image must be smaller than 5MB",
    };
  }

  return { valid: true };
}

export function buildImageFormData(file: File): FormData {
  const formData = new FormData();
  formData.append("image", file); // field name MUST match multer's .single("image")
  return formData;
}