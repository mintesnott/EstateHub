import { Router } from "express";
import {
  createInquiryController,
  cancelInquiryController,
  closeInquiryController,
  getInquiryByIdController,
  getAllInquiriesController,
  getMyInquiriesController,
} from "./inquiry.controller.js";
import {
  propertyIdParamSchema,
  inquiryIdParamSchema,
  createInquirySchema,
  inquiryQuerySchema,
} from "./inquiry.validation.js";
import { validate } from "../../middleware/validate.js";
import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { processBreachedInquiries } from "./inquiry.service.js";

const router = Router({ mergeParams: true });

// CLIENT
router.post(
  "/properties/:propertyId/inquiries",
  authenticate,
  authorize("CLIENT"),
  validate(propertyIdParamSchema, "params"),
  validate(createInquirySchema, "body"),
  asyncHandler(createInquiryController)
);

router.get(
  "/inquiries/me",
  authenticate,
  authorize("CLIENT",),
  validate(inquiryQuerySchema, "query"),
  asyncHandler(getMyInquiriesController)
);

router.patch(
  "/inquiries/:id/cancel",
  authenticate,
  authorize("CLIENT"),
  validate(inquiryIdParamSchema, "params"),
  asyncHandler(cancelInquiryController)
);

// AGENT STATUS ACTIONS
router.patch(
  "/inquiries/:id/close",
  authenticate,
  authorize("ADMIN","AGENT", "CLIENT"),
  validate(inquiryIdParamSchema, "params"),
  asyncHandler(closeInquiryController)
);

// SHARED / AGENT / ADMIN
router.get(
  "/inquiries",
  authenticate,
  authorize("AGENT", "ADMIN"),
  validate(inquiryQuerySchema, "query"),
  asyncHandler(getAllInquiriesController)
);

router.get(
  "/inquiries/:id",
  authenticate,
  authorize("CLIENT", "AGENT", "ADMIN"),
  validate(inquiryIdParamSchema, "params"),
  asyncHandler(getInquiryByIdController)
);

// In inquiry.routes.ts or a dev-only route
router.post(
  "/inquiries/process-breached",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(async (_req, res) => {
    const count = await processBreachedInquiries();
    res.status(200).json({
      success: true,
      message: `Processed ${count} breached inquiries`,
      data: { count },
    });
  })
);

export default router;