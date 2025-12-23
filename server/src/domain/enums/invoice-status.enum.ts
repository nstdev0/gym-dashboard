import z from "zod";

export const InvoiceStatusEnum = z.enum(
  ["PENDING", "PAID", "CANCELLED", "PARTIALLY_PAID"],
  {
    error: () => {
      return "El estado de la factura debe ser PENDING, PAID, CANCELLED o PARTIALLY_PAID";
    },
  }
);

export type InvoiceStatus = z.infer<typeof InvoiceStatusEnum>;
