import { Invoice } from "../entities/invoice";

export type CreateInvoiceDTO = Omit<Invoice, "id" | "createdAt" | "updatedAt">;

export type UpdateInvoiceDTO = Omit<
  CreateInvoiceDTO,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "memberId"
  | "membershipId"
  | "issuedAt"
  | "issuedBy"
  | "amount"
  | "method"
>;
