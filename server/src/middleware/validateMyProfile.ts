import { getUpdateMyProfileSchema } from "../modules/users/user.profile.validation.js";
import { asyncHandler } from "./asyncHandler.js";

export const validateMyProfile = asyncHandler(
  async (req, res, next) => {
    const schema = getUpdateMyProfileSchema(req.user!.role);

    const parsed = schema.parse(req.body);

    res.locals.body = parsed;

    next();
  },
);