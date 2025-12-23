import z from "zod";

export const auditZ = z.object({
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export const baseZ = z
  .object({
    id: z.number("ID inválido (Debe ser número)"),
  })
  .extend(auditZ.shape);
