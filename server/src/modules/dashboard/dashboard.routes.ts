import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  getAgentDashboardController,
  getAdminDashboardController,
} from "./dashboard.controller.js";

const router = Router();

router.get(
  "/agent",
  authenticate,
  authorize("AGENT"),
  asyncHandler(getAgentDashboardController),
);

router.get(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(getAdminDashboardController),
);

export default router;