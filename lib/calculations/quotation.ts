import type { Quotation, QuotationItem, QuotationSummary, QuotationView } from "@/types/quotation";

type CustomerLookup = Record<string, { customer_name: string }>;
type BranchLookup = Record<string, { branch_name: string }>;
type ProductLookup = Record<string, { product_name: string }>;

function safeNumber(value: unknown): number {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function roundTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

export function enrichQuotations(
  quotations: Quotation[],
  items: QuotationItem[],
  customers: CustomerLookup,
  branches: BranchLookup,
  products: ProductLookup
): QuotationView[] {
  return quotations.map((quotation) => {
    const quotationItems = items.filter((item) => item.quotation_id === quotation.id);
    const quotationTotal = quotationItems.reduce((sum, item) => sum + safeNumber(item.line_total), 0);
    const totalQuantity = quotationItems.reduce((sum, item) => sum + safeNumber(item.quantity), 0);
    const productNames = quotationItems
      .map((item) => products[item.product_id]?.product_name ?? "Unknown product")
      .filter(Boolean);

    return {
      ...quotation,
      customer_name: customers[quotation.customer_id]?.customer_name ?? "Unknown customer",
      branch_name: quotation.branch_id ? branches[quotation.branch_id]?.branch_name ?? "Unknown branch" : "No branch",
      item_count: quotationItems.length,
      total_quantity: roundTwo(totalQuantity),
      quotation_total: roundTwo(quotationTotal),
      product_summary: productNames.length > 0 ? productNames.join(", ") : "No items",
    };
  });
}

export function summarizeQuotations(quotations: QuotationView[]): QuotationSummary {
  return {
    total_quotations: quotations.length,
    draft_count: quotations.filter((quotation) => quotation.status === "draft").length,
    sent_count: quotations.filter((quotation) => quotation.status === "sent").length,
    accepted_count: quotations.filter((quotation) => quotation.status === "accepted").length,
    rejected_count: quotations.filter((quotation) => quotation.status === "rejected").length,
    total_value: roundTwo(quotations.reduce((sum, quotation) => sum + quotation.quotation_total, 0)),
    accepted_value: roundTwo(
      quotations
        .filter((quotation) => quotation.status === "accepted")
        .reduce((sum, quotation) => sum + quotation.quotation_total, 0)
    ),
  };
}
