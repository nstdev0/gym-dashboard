import z from "zod";
import { InvoiceStatusEnum } from "../../../../server/src/domain/enums/invoice-status.enum";
import { PaymentMethodEnum } from "../../../../server/src/domain/enums/payment-method.enum";

// ---------------------------------------------------------
// BASE SHAPE
// ---------------------------------------------------------
const invoiceBaseShape = z.object({
  memberId: z.string().cuid("ID de miembro requerido"),

  // Opcional porque puedes vender productos sueltos sin membresía
  membershipId: z.string().cuid().optional().nullable(),

  amount: z.coerce
    .number("Monto requerido")
    .min(0, "El monto no puede ser negativo"),

  currency: z.string().default("PEN"), // Soles por defecto

  status: InvoiceStatusEnum.default("PENDING"),
  method: PaymentMethodEnum,

  notes: z.string().optional().nullable(),

  // Fechas que pueden venir manuales o ser calculadas
  issuedAt: z.coerce.date().default(() => new Date()),
  paidAt: z.coerce.date().optional().nullable(),

  // IDs de staff (normalmente se inyectan en backend, pero el form puede requerirlo)
  issuedBy: z.string().cuid().optional(),
});

// ---------------------------------------------------------
// SCHEMAS CONCRETOS
// ---------------------------------------------------------

export const invoiceSchema = invoiceBaseShape.extend({
  id: z.string().cuid(),
  serialNumber: z.string().nullable(), // Backend lo genera
  amount: z.number().or(z.string()), // Salida Decimal
  createdAt: z.date(),
  updatedAt: z.date(),
  // issuedBy es obligatorio en la BD, aquí lo forzamos en la salida
  issuedBy: z.string().cuid(),
});
export type Invoice = z.infer<typeof invoiceSchema>;

/** CREATE: SerialNumber no se envía, lo genera el sistema */
export const invoiceCreateSchema = invoiceBaseShape;
export type InvoiceCreateInput = z.infer<typeof invoiceCreateSchema>;

export const invoiceUpdateSchema = invoiceBaseShape.partial();
export type InvoiceUpdateInput = z.infer<typeof invoiceUpdateSchema>;
