import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client";
import { CustomAPIError } from "../errors";

import { MulterError } from "multer";

export const errorMiddleware = ( error: Error, _req: Request,
                            res: Response, _next: NextFunction,
) => {

 console.error("💥 Error Logged:", error);


 // Catch ALL modular custom API errors
  if (error instanceof CustomAPIError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // handle Zod Validation Errors -> 400 Bad Request
  if (error instanceof ZodError) {
    const firstErrorMessage = error.issues[0]?.message || "Validation failed";

    return res.status(400).json({
      success: false,
      message: firstErrorMessage,
    });
  }

   // Handle Multer upload errors (file size, file count, etc.) -> 400
  if (error instanceof MulterError) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // Handle our custom fileFilter rejection (wrong MIME type) -> 400
  if (error.message?.includes("Only JPEG, PNG, and WebP")) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // handle Prisma Unique Constraint Errors -> 409 Conflict
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return res.status(409).json({
      success: false,
      message: "An account with this email address already exists",
    });
  }

 

  // fallback for unhandled errors -> 500
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};