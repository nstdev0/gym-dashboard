import z from "zod";

export const PaymentMethodEnum = z.enum(
  [
    "CREDIT_CARD",
    "DEBIT_CARD",
    "CASH",
    "BANK_TRANSFER",
    "YAPE",
    "PLIN",
    "OTHER",
  ],
  {
    error: () => {
      return "El método de pago es inválido";
    },
  }
);

export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;
