import multer from "multer";
import type { RequestHandler } from "express";

import cloudinary from "../config/cloudinary.js";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(new Error("Only JPEG, PNG, AVIF and WebP images are allowed"));
      return;
    }

    cb(null, true);
  },
});

function uploadToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `estatehub/${folder}`,
        transformation: [
          {
            width: 1600,
            height: 1600,
            crop: "limit",
          },
        ],
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
}

function buildUploader(folder: string): RequestHandler {
  const multerMiddleware = upload.single("image");

  return (req, res, next) => {
    multerMiddleware(req, res, async (error) => {
      if (error) {
        next(error);
        return;
      }

      if (!req.file) {
        next();
        return;
      }

      try {
        const result = await uploadToCloudinary(req.file.buffer, folder);

        req.file.path = result.secure_url;
        req.file.filename = result.public_id;

        next();
      } catch (uploadError) {
        next(uploadError);
      }
    });
  };
}

export const uploadPropertyImage = buildUploader("properties");

export const uploadProfileImage = buildUploader("profiles");