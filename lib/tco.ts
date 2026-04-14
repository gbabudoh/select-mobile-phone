import { Product, PRODUCTS } from "./products";

export interface TCOInputs {
  devicePrice: number;
  carrierPlanMonthly: number;
  byopPlanMonthly: number;
  months: number;
  carrierActivationFee?: number;
  insuranceMonthly?: number;
  financingInterestPct?: number;
}

export interface TCOResult {
  carrierTotal: number;
  byopTotal: number;
  saved: number;
  monthlySavings: number;
  carrierBreakdown: {
    device: number;
    plan: number;
    activation: number;
    insurance: number;
    interest: number;
  };
  byopBreakdown: {
    device: number;
    plan: number;
  };
}

export function calculateTCO(inputs: TCOInputs): TCOResult {
  const {
    devicePrice,
    carrierPlanMonthly,
    byopPlanMonthly,
    months,
    carrierActivationFee = 35,
    insuranceMonthly = 15,
    financingInterestPct = 0,
  } = inputs;

  const carrierPlan = carrierPlanMonthly * months;
  const carrierInsurance = insuranceMonthly * months;
  const carrierInterest = devicePrice * (financingInterestPct / 100);
  const carrierDevice = devicePrice; // financed but still full price over term

  const carrierTotal =
    carrierDevice + carrierPlan + carrierActivationFee + carrierInsurance + carrierInterest;

  const byopPlan = byopPlanMonthly * months;
  const byopDevice = devicePrice;
  const byopTotal = byopDevice + byopPlan;

  const saved = carrierTotal - byopTotal;
  const monthlySavings = months > 0 ? saved / months : 0;

  return {
    carrierTotal,
    byopTotal,
    saved,
    monthlySavings,
    carrierBreakdown: {
      device: carrierDevice,
      plan: carrierPlan,
      activation: carrierActivationFee,
      insurance: carrierInsurance,
      interest: carrierInterest,
    },
    byopBreakdown: {
      device: byopDevice,
      plan: byopPlan,
    },
  };
}

export function getHandsets(): Product[] {
  return PRODUCTS.filter(
    (p) => p.category === "HANDSET" && p.inStock
  );
}

export function getEsimPlans(): Product[] {
  return PRODUCTS.filter(
    (p) => p.category === "ESIM_PLAN" && p.inStock
  );
}
