import { InvoiceError } from "./errors";

export function assertInvoiceCoversAllocatedPayments(
  invoiceAmount: number,
  paidAmount: number,
): void {
  if (paidAmount > invoiceAmount)
    throw new InvoiceError(
      "Nilai invoice tidak boleh lebih kecil dari pembayaran yang sudah dialokasikan.",
    );
}

export function assertActiveInvoiceTotal(
  projectTotal: number,
  otherActiveInvoiceTotal: number,
  nextInvoiceAmount: number,
): void {
  if (otherActiveInvoiceTotal + nextInvoiceAmount > projectTotal)
    throw new InvoiceError("Total invoice aktif melebihi nilai proyek.");
}

export function assertInvoicePaymentCapacity(input: {
  invoiceAmount: number;
  allocatedAmount: number;
  previousAllocation: number;
  paymentAmount: number;
}): void {
  if (
    input.allocatedAmount - input.previousAllocation + input.paymentAmount >
    input.invoiceAmount
  ) {
    throw new InvoiceError("Pembayaran melebihi sisa nilai invoice.");
  }
}

export function assertProjectPaymentCapacity(input: {
  projectTotal: number;
  paidAmount: number;
  previousPaymentAmount: number;
  paymentAmount: number;
}): void {
  if (
    input.paidAmount - input.previousPaymentAmount + input.paymentAmount >
    input.projectTotal
  ) {
    throw new InvoiceError("Total pembayaran melebihi nilai proyek.");
  }
}
