import z from "zod";

export const RoleEnum = z.enum(["OWNER", "ADMIN", "STAFF"], {
  error: () => {
    return "El rol debe ser OWNER, ADMIN o STAFF";
  },
});

export type Role = z.infer<typeof RoleEnum>;
