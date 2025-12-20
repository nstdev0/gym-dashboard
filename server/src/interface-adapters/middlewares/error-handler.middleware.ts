import { Request, Response, NextFunction } from "express";
import { BaseError } from "../../domain/errors/base-error";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Global Error Caught:", err);

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      // Stack trace only in development if needed, or omit for security
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  // Handle specific Prisma or other third-party errors if not already caught in repos
  // However, the plan is to wrap them in the repository layer.
  // We keep a fallback here just in case.
  if (err.code === "P2003") {
     return res.status(400).json({
        success: false,
        error: "Constraint violation",
        message: "No se puede eliminar este registro porque tiene relaciones activas (ej. membresias, pagos).",
     });
   }

  // Fallback for unhandled errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
