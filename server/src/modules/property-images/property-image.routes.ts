import { Router } from "express";
import {
  addPropertyImageController,
  getPropertyImagesController,
  updatePropertyImageController,
  deletePropertyImageController,
} from "./property-image.controller.js";
import {
  propertyIdParamSchema,
  propertyAndImageParamsSchema,
  createPropertyImageSchema,
  updatePropertyImageSchema,
} from "./property-image.validation.js";
import { validate } from "../../middleware/validate.js";
import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

import { uploadPropertyImage } from "../../middleware/upload.js";
import { uploadPropertyImageController } from "./property-image.controller.js";

const router = Router({ mergeParams: true });

// GET /api/v1/properties/:propertyId/images (Public)
router.get(
  "/",
  validate(propertyIdParamSchema, "params"),
  asyncHandler(getPropertyImagesController)
);

// POST /api/v1/properties/:propertyId/images (AGENT, ADMIN)
router.post(
  "/",
  authenticate,
  authorize("AGENT", "ADMIN"),
  validate(propertyIdParamSchema, "params"),
  validate(createPropertyImageSchema, "body"),
  asyncHandler(addPropertyImageController)
);

// PATCH /api/v1/properties/:propertyId/images/:imageId (AGENT, ADMIN)
router.patch(
  "/:imageId",
  authenticate,
  authorize("AGENT", "ADMIN"),
  validate(propertyAndImageParamsSchema, "params"),
  validate(updatePropertyImageSchema, "body"),
  asyncHandler(updatePropertyImageController)
);

// DELETE /api/v1/properties/:propertyId/images/:imageId (AGENT, ADMIN)
router.delete(
  "/:imageId",
  authenticate,
  authorize("AGENT", "ADMIN"),
  validate(propertyAndImageParamsSchema, "params"),
  asyncHandler(deletePropertyImageController)
);

// POST /api/v1/properties/:propertyId/images/upload (AGENT, ADMIN)
router.post(
  "/upload",
  authenticate,
  authorize("AGENT", "ADMIN"),
  validate(propertyIdParamSchema, "params"),
  uploadPropertyImage,
  asyncHandler(uploadPropertyImageController)
);

export default router;