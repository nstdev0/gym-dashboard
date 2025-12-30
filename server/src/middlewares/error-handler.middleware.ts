import { Request, Response, NextFunction } from "express";
import z, { ZodError, ZodIssue } from "zod";
import { BaseError } from "../domain/errors/base-error";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Manejo de Errores Personalizados (BaseError y subclases)
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      isSuccess: false,
      message: err.message,
      code: err.code,
    });
  }

  // 2. Manejo de Errores de Validación (Zod)
  // Transforma el array complejo de Zod al objeto simple { campo: [errores] }
  if (err instanceof ZodError) {
    const zodError = err as any;
    const errors = zodError.errors.reduce(
      (acc: Record<string, string[]>, curr: z.core.$ZodIssue) => {
        const field = curr.path[0] as string; // Ej: "email"
        const message = curr.message;

        if (!acc[field]) {
          acc[field] = [];
        }
        acc[field].push(message);
        return acc;
      },
      {} as Record<string, string[]>
    );

    return res.status(400).json({
      isSuccess: false,
      message: "Error de validación en los datos enviados.",
      errors: errors, // 👈 Esto es lo que lee tu frontend para pintar inputs en rojo
    });
  }

  // 3. Manejo de Errores de Prisma
  // esto quizás no sea necesario aquí, pero sirve de respaldo.
  if ((err as any).code === "P2002") {
    return res.status(409).json({
      isSuccess: false,
      message: "Ya existe un registro con este valor único (ej. email o DNI).",
      code: "UNIQUE_CONSTRAINT",
    });
  }

  // 4. Error Desconocido (Bug o Crash)
  console.error("🔴 ERROR NO CONTROLADO:", err);
  return res.status(500).json({
    isSuccess: false,
    message: "Error interno del servidor. Por favor intenta más tarde.",
  });
};
