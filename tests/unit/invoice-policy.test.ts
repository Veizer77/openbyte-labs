import { describe, expect, it } from "vitest";
import {
  assertActiveInvoiceTotal,
  assertInvoiceCoversAllocatedPayments,
  assertInvoicePaymentCapacity,
  assertProjectPaymentCapacity,
} from "@/lib/invoices/policy";

describe("invoice/payment ledger policy", () => {
  it("permits an invoice total equal to the project value, but rejects excess", () => {
    expect(() => assertActiveInvoiceTotal(1_000, 700, 300)).not.toThrow();
    expect(() => assertActiveInvoiceTotal(1_000, 700, 301)).toThrow("Total invoice aktif");
  });

  it("never reduces an invoice below its recorded allocation", () => {
    expect(() => assertInvoiceCoversAllocatedPayments(500, 500)).not.toThrow();
    expect(() => assertInvoiceCoversAllocatedPayments(499, 500)).toThrow("pembayaran yang sudah dialokasikan");
  });

  it("accounts for an edited payment allocation before checking remaining invoice value", () => {
    expect(() => assertInvoicePaymentCapacity({
      invoiceAmount: 1_000,
      allocatedAmount: 800,
      previousAllocation: 300,
      paymentAmount: 500,
    })).not.toThrow();
    expect(() => assertInvoicePaymentCapacity({
      invoiceAmount: 1_000,
      allocatedAmount: 800,
      previousAllocation: 300,
      paymentAmount: 501,
    })).toThrow("sisa nilai invoice");
  });

  it("caps project ledger payments at the agreed project cost", () => {
    expect(() => assertProjectPaymentCapacity({
      projectTotal: 1_000,
      paidAmount: 700,
      previousPaymentAmount: 200,
      paymentAmount: 500,
    })).not.toThrow();
    expect(() => assertProjectPaymentCapacity({
      projectTotal: 1_000,
      paidAmount: 700,
      previousPaymentAmount: 200,
      paymentAmount: 501,
    })).toThrow("nilai proyek");
  });
});
