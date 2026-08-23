import type { ZodType } from "zod";
import { asyncHandler } from "./asyncHandler.js";



export const validate = (
  schema: ZodType,
  source: "body" | "query" | "params" = "body",
) =>
  asyncHandler(async (req, res, next) => {
    const parsed = schema.parse(req[source]);

    res.locals[source] = parsed;

    next();
  });






