import { z } from "zod";

import { updateUserProfileSchema } from "./user.validation.js";
import { updateClientProfileSchema } from "../clients/client.validation.js";
import { updateAgentProfileSchema } from "../agents/agent.validation.js";

export const updateClientProfileCombinedSchema = z.object({
  ...updateUserProfileSchema.shape,
  ...updateClientProfileSchema.shape,
});

export const updateAgentProfileCombinedSchema = z.object({
  ...updateUserProfileSchema.shape,
  ...updateAgentProfileSchema.shape,
});

export const getUpdateMyProfileSchema = (role: string) => {
  switch (role) {
    case "CLIENT":
      return updateClientProfileCombinedSchema;

    case "AGENT":
      return updateAgentProfileCombinedSchema;

    case "ADMIN":
      return updateUserProfileSchema;

    default:
      return updateUserProfileSchema;
  }
};

export type UpdateClientProfileInput = z.infer<
  typeof updateClientProfileCombinedSchema
>;

export type UpdateAgentProfileInput = z.infer<
  typeof updateAgentProfileCombinedSchema
>;

export type UpdateMyProfileInput =
  | UpdateClientProfileInput
  | UpdateAgentProfileInput;