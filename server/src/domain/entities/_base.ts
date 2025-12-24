import z from "zod";

export const auditZ = z.object({
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export const baseZ = z
  .object({
    id: z.cuid2("ID inválido"),
  })
  .extend(auditZ.shape);
