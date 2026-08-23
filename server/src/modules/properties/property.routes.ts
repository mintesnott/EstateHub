import { Router } from "express";
import { 
        createPropertyController, 
        deletePropertyController, 
        getMyPropertiesController, 
        getPropertiesController,
        getPropertyByIdController,
        updatePropertyController,
} from "./property.controller.js";

import { 
        createPropertySchema,
        getPropertiesQuerySchema, 
        propertyIdParamSchema,
        updatePropertySchema,
} from "./property.validation.js";

import { validate } from "../../middleware/validate.js";
import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const router = Router();

router.post(
        "/",
        authenticate,
        authorize("ADMIN", "AGENT"),
        validate(createPropertySchema, "body"),
        asyncHandler(createPropertyController)
        );

router.get(
        "/",
        validate(getPropertiesQuerySchema, "query"),
        asyncHandler(getPropertiesController)
        );

router.get(
  "/mine",
  authenticate,
  authorize("ADMIN", "AGENT"),
  validate(getPropertiesQuerySchema, "query"),
  asyncHandler(getMyPropertiesController)
);

router.get(
        "/:id",
        validate(propertyIdParamSchema, "params"),
        asyncHandler(getPropertyByIdController),
        );

router.patch(
        "/:id",
        authenticate,
        authorize("ADMIN", "AGENT"),
        validate(propertyIdParamSchema, "params"),
        validate(updatePropertySchema, "body"),
        asyncHandler(updatePropertyController),
        );

router.delete(
        "/:id",
        authenticate,
        authorize("ADMIN", "AGENT"),
        validate(propertyIdParamSchema, "params"),
        asyncHandler(deletePropertyController),
        )

export default router;