export const PaymentMethod = {
  CREDIT_CARD: "credit_card",
  DEBIT_CARD: "debit_card",
  CASH: "cash",
  BANK_TRANSFER: "bank_transfer",
  YAPE: "yape",
  PLIN: "plin",
  OTHER: "other",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const InvoiceStatus = {
  PENDING: "pending",
  PAID: "paid",
  CANCELLED: "cancelled",
  PARTIALLY_PAID: "partially_paid",
} as const;
export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export type Invoice = {
  id: string;

  memberId: string;
  membershipId?: string;

  amount: number; // TODO: MEJORAR PARA USAR DECIMALES, PUEDE SER CON DECIMAL.JS

  issuedAt: Date;
  paidAt: Date | null;

  issuedBy: string;
  updatedBy: string;

  status: InvoiceStatus;
  method: PaymentMethod;

  createdAt: Date;
  updatedAt: Date;
};
