
import { Router } from "express";
import { registerController, loginController, getMeController, changePasswordController, changeEmailController } from "./auth.controller.js";
import { registerSchema, loginSchema, changePasswordSchema, changeEmailSchema} from "./auth.validation.js";

import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { authenticate } from "../../middleware/auth.js";


const router = Router();

router.post(
    "/register", 
    validate(registerSchema, "body"), 
    asyncHandler(registerController),
    );

router.post(
    "/login", 
    validate(loginSchema, "body"), 
    asyncHandler(loginController),);

router.get(
    "/me", 
    authenticate,
    asyncHandler(getMeController)
    );

// POST /api/v1/auth/change-password
router.patch(
  "/change-password",
  authenticate,
  validate(changePasswordSchema, "body"),
  asyncHandler(changePasswordController)
);

router.patch(
  "/change-email",
  authenticate,
  validate(changeEmailSchema, "body"),
  asyncHandler(changeEmailController)
);


export default router;