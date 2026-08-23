import { Router } from "express";
import {
  createMessageController,
  getMessagesController,
  markMessagesAsReadController,
} from "./message.controller.js";
import {
  inquiryIdParamSchema,
  createMessageSchema,
  messageQuerySchema,
} from "./message.validation.js";
import { validate } from "../../middleware/validate.js";
import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const router = Router({ mergeParams: true });

router.post(
  "/inquiries/:id/messages",
  authenticate,
  authorize("CLIENT", "AGENT"),
  validate(inquiryIdParamSchema, "params"),
  validate(createMessageSchema, "body"),
  asyncHandler(createMessageController)
);

router.get(
  "/inquiries/:id/messages",
  authenticate,
  authorize("CLIENT", "AGENT", "ADMIN"),
  validate(inquiryIdParamSchema, "params"),
  validate(messageQuerySchema, "query"),
  asyncHandler(getMessagesController)
);

router.patch(
  "/inquiries/:id/messages/read",
  authenticate,
  authorize("CLIENT", "AGENT"), // admin can't participate, no reason to mark-read either
  validate(inquiryIdParamSchema, "params"),
  asyncHandler(markMessagesAsReadController)
);

export default router;