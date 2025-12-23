import z from "zod";

export const DocTypeEnum = z.enum(["DNI", "PASSPORT", "CE"], {
  error: () => {
    return "El tipo de documento debe ser DNI, PASSPORT o CE";
  },
});

export type DocType = z.infer<typeof DocTypeEnum>;
