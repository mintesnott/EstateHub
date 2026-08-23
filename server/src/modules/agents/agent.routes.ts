import { Router } from "express";
import { createAgentController, deleteAgentController, getAgentByIdController, getAgentPropertiesController, getAgentsController, updateAgentController } from "./agent.controller.js";
import { agentIdParamSchema, createAgentSchema, getAgentsQuerySchema, updateAgentProfileSchema } from "./agent.validation.js";
import { validate } from "../../middleware/validate.js";
import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { getPropertiesQuerySchema } from "../properties/property.validation.js";


const router = Router();

// POST /api/v1/agents
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createAgentSchema, "body"),
  asyncHandler(createAgentController)
);

// POST /api/v1/agents — create agent (ADMIN only)
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createAgentSchema, "body"),
  asyncHandler(createAgentController),
);

// GET /api/v1/agents — list agents (ADMIN only)
router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(getAgentsQuerySchema, "query"),
  asyncHandler(getAgentsController),
);

// GET /api/v1/agents/:id — single agent (ADMIN only)
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(agentIdParamSchema, "params"),
  asyncHandler(getAgentByIdController),
);

// PATCH /api/v1/agents/:id — update agent profile (ADMIN only)
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(agentIdParamSchema, "params"),
  validate(updateAgentProfileSchema, "body"),
  asyncHandler(updateAgentController),
);

// DELETE /api/v1/agents/:id — delete agent (ADMIN only)
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(agentIdParamSchema, "params"),
  asyncHandler(deleteAgentController),
);

// GET /api/v1/agents/:id/properties — admin only
router.get(
  "/:id/properties",
  authenticate,
  authorize("ADMIN"),
  validate(agentIdParamSchema, "params"),
  validate(getPropertiesQuerySchema, "query"),
  asyncHandler(getAgentPropertiesController)
);


export default router;