import type { ProductionRecord, ProductionRecordView, ProductionSummary } from "@/types/production";

type ProductLookup = Record<string, { product_name: string }>;
type BranchLookup = Record<string, { branch_name: string }>;

function safeNumber(value: unknown): number {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function roundTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

export function enrichProductionRecords(
  records: ProductionRecord[],
  products: ProductLookup,
  branches: BranchLookup
): ProductionRecordView[] {
  return records.map((record) => {
    const quantityProduced = safeNumber(record.quantity_produced);
    const lossesQuantity = safeNumber(record.losses_quantity);
    const hppBaseCost = safeNumber(record.hpp_base_cost);
    const netQuantity = Math.max(quantityProduced - lossesQuantity, 0);

    return {
      ...record,
      quantity_produced: quantityProduced,
      losses_quantity: lossesQuantity,
      hpp_base_cost: hppBaseCost,
      product_name: products[record.product_id]?.product_name ?? "Unknown product",
      branch_name: record.branch_id ? branches[record.branch_id]?.branch_name ?? "Unknown branch" : "No branch",
      net_quantity: roundTwo(netQuantity),
      hpp_per_unit: netQuantity > 0 ? roundTwo(hppBaseCost / netQuantity) : 0,
      losses_percentage: quantityProduced > 0 ? roundTwo((lossesQuantity / quantityProduced) * 100) : 0,
    };
  });
}

export function summarizeProduction(records: ProductionRecordView[]): ProductionSummary {
  const totalProduced = records.reduce((sum, record) => sum + record.quantity_produced, 0);
  const totalLosses = records.reduce((sum, record) => sum + record.losses_quantity, 0);
  const totalNetQuantity = records.reduce((sum, record) => sum + record.net_quantity, 0);
  const totalHppBaseCost = records.reduce((sum, record) => sum + record.hpp_base_cost, 0);

  return {
    total_produced: roundTwo(totalProduced),
    total_losses: roundTwo(totalLosses),
    total_net_quantity: roundTwo(totalNetQuantity),
    total_hpp_base_cost: roundTwo(totalHppBaseCost),
    average_hpp_per_unit: totalNetQuantity > 0 ? roundTwo(totalHppBaseCost / totalNetQuantity) : 0,
    losses_percentage: totalProduced > 0 ? roundTwo((totalLosses / totalProduced) * 100) : 0,
  };
}
