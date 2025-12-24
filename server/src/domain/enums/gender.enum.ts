import z from "zod";

export const GenderEnum = z.enum(["MALE", "FEMALE"], {
  error: () => {
    return "El género debe ser Masculino o Femenino";
  },
});

export type Gender = z.infer<typeof GenderEnum>;
