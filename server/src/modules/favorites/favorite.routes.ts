import { Router } from "express";
import {
  addFavoriteController,
  removeFavoriteController,
  getMyFavoritesController,
} from "./favorite.controller.js";

import { propertyIdParamSchema } from "./favorite.validation.js";
import { validate } from "../../middleware/validate.js";
import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const router = Router();

// All routes require CLIENT authorization
router.use(authenticate, authorize("CLIENT"));

// GET /api/v1/favorites
router.get("/", asyncHandler(getMyFavoritesController));

// POST /api/v1/favorites/:propertyId
router.post(
  "/:propertyId",
  validate(propertyIdParamSchema, "params"),
  asyncHandler(addFavoriteController)
);

// DELETE /api/v1/favorites/:propertyId
router.delete(
  "/:propertyId",
  validate(propertyIdParamSchema, "params"),
  asyncHandler(removeFavoriteController)
);

export default router;