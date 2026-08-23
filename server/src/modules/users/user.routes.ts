import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  getMyProfileController,
  getUsersController,
  updateMyProfileController,
  uploadMyProfileImageController,
} from "./user.controller.js";

import { validateMyProfile } from "../../middleware/validateMyProfile.js";

import { uploadProfileImage } from "../../middleware/upload.js";

import { getUsersQuerySchema } from "./user.validation.js";

const router = Router();

// GET /api/v1/users/me/profile
router.get(
  "/me/profile",
  authenticate,
  asyncHandler(getMyProfileController)
);

// PATCH /api/v1/users/me/profile
router.patch(
  "/me/profile",
  authenticate,
  validateMyProfile,
  asyncHandler(updateMyProfileController)
);

// POST /api/v1/users/me/profile/image
router.post(
  "/me/profile/image",
  authenticate,
  uploadProfileImage,
  asyncHandler(uploadMyProfileImageController)
);

// GET /api/v1/users — admin only
router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(getUsersQuerySchema, "query"),
  asyncHandler(getUsersController)
);


export default router;