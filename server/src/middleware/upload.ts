import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function buildUploader(folder: string) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `estatehub/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
      transformation: [{ width: 1600, height: 1600, crop: "limit" }],
    } as any, // multer-storage-cloudinary's types lag behind Cloudinary's SDK
  });

  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE_BYTES },
    fileFilter: (_req, file, cb) => {
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(new Error("Only JPEG, PNG, AVIF and WebP images are allowed"));
        return;
      }
      cb(null, true);
    },
  });
}

// Property images: estatehub/properties/<propertyId or generic>
export const uploadPropertyImage = buildUploader("properties").single("image");

// Profile images: estatehub/profiles
export const uploadProfileImage = buildUploader("profiles").single("image");