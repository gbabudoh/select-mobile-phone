import Stripe from "stripe";

// Initialize Stripe if API key is provided for live Stripe Tax integration
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-01-27" as any }) 
  : null;

export interface TaxCalculationParams {
  country: "US" | "CA";
  stateOrProvince: string; // e.g., "ON", "CA", "NY"
  postalCode: string;
  amount: number;
}

export interface TaxResult {
  taxRate: number; // e.g. 0.13 for 13%
  taxAmount: number;
  breakdown: {
    name: string;
    rate: number;
    amount: number;
  }[];
}

// Canadian tax rates by province/territory
const CANADIAN_TAX_RATES: Record<string, { gst?: number; hst?: number; pst?: number; qst?: number }> = {
  ON: { hst: 0.13 }, // Ontario
  BC: { gst: 0.05, pst: 0.07 }, // British Columbia
  AB: { gst: 0.05 }, // Alberta
  SK: { gst: 0.05, pst: 0.06 }, // Saskatchewan
  MB: { gst: 0.05, pst: 0.07 }, // Manitoba
  QC: { gst: 0.05, qst: 0.09975 }, // Quebec
  NS: { hst: 0.15 }, // Nova Scotia
  NB: { hst: 0.15 }, // New Brunswick
  PE: { hst: 0.15 }, // Prince Edward Island
  NL: { hst: 0.15 }, // Newfoundland and Labrador
  YT: { gst: 0.05 }, // Yukon
  NT: { gst: 0.05 }, // Northwest Territories
  NU: { gst: 0.05 }, // Nunavut
};

// Standard US state sales tax rates (average combined state and local)
const US_STATE_TAX_RATES: Record<string, number> = {
  AL: 0.0925, AK: 0.0176, AZ: 0.084, AR: 0.0946, CA: 0.0882, CO: 0.0781, CT: 0.0635, DE: 0.00,
  FL: 0.0702, GA: 0.0735, HI: 0.0444, ID: 0.0603, IL: 0.0884, IN: 0.07, IA: 0.0694, KS: 0.087,
  KY: 0.06, LA: 0.0955, ME: 0.055, MD: 0.06, MA: 0.0625, MI: 0.06, MN: 0.0749, MS: 0.0707,
  MO: 0.083, MT: 0.00, NE: 0.0694, NV: 0.0823, NH: 0.00, NJ: 0.066, NM: 0.0772, NY: 0.0852,
  NC: 0.07, ND: 0.0696, OH: 0.0724, OK: 0.0899, OR: 0.00, PA: 0.0634, RI: 0.07, SC: 0.0743,
  SD: 0.064, TN: 0.0955, TX: 0.082, UT: 0.0719, VT: 0.063, VA: 0.0575, WA: 0.0938, WV: 0.065,
  WI: 0.0543, WY: 0.0544, DC: 0.06,
};

export async function calculateTax(params: TaxCalculationParams): Promise<TaxResult> {
  const { country, stateOrProvince, postalCode, amount } = params;
  const normalizedState = stateOrProvince.trim().toUpperCase();

  // Try live Stripe Tax if available and configured
  if (stripe) {
    try {
      const calculation = await stripe.tax.calculations.create({
        currency: country === "CA" ? "cad" : "usd",
        line_items: [
          {
            amount: Math.round(amount * 100), // Stripe expects cents
            reference: "order_subtotal",
            tax_behavior: "exclusive",
          },
        ],
        customer_details: {
          address: {
            country: country,
            state: normalizedState,
            postal_code: postalCode,
          },
          address_source: "shipping",
        },
      });

      const calcAny = calculation as any;
      const taxAmount = (calcAny.tax_amount ?? 0) / 100;
      const taxRate = amount > 0 ? taxAmount / amount : 0;
      
      const breakdown = (calcAny.tax_breakdown || []).map((item: any) => ({
        name: item.tax_rate_details?.display_name ?? "Sales Tax",
        rate: item.tax_rate_details?.percentage_decimal 
          ? parseFloat(item.tax_rate_details.percentage_decimal) / 100 
          : 0,
        amount: item.amount / 100,
      }));

      return {
        taxRate,
        taxAmount,
        breakdown,
      };
    } catch (error) {
      console.warn("Stripe Tax calculation failed, falling back to local formulas:", error);
    }
  }

  // Fallback to local tax calculations
  const breakdown: TaxResult["breakdown"] = [];
  let totalRate = 0;

  if (country === "CA") {
    const provinceTax = CANADIAN_TAX_RATES[normalizedState] || { gst: 0.05 }; // Default to GST only
    
    if (provinceTax.hst) {
      totalRate += provinceTax.hst;
      breakdown.push({ name: "HST", rate: provinceTax.hst, amount: amount * provinceTax.hst });
    } else {
      if (provinceTax.gst) {
        totalRate += provinceTax.gst;
        breakdown.push({ name: "GST", rate: provinceTax.gst, amount: amount * provinceTax.gst });
      }
      if (provinceTax.pst) {
        totalRate += provinceTax.pst;
        breakdown.push({ name: "PST", rate: provinceTax.pst, amount: amount * provinceTax.pst });
      }
      if (provinceTax.qst) {
        totalRate += provinceTax.qst;
        breakdown.push({ name: "QST", rate: provinceTax.qst, amount: amount * provinceTax.qst });
      }
    }
  } else {
    // US calculations
    const stateRate = US_STATE_TAX_RATES[normalizedState] ?? 0.08; // Default US rate is 8%
    totalRate = stateRate;
    breakdown.push({ name: `${normalizedState} Sales Tax`, rate: stateRate, amount: amount * stateRate });
  }

  const taxAmount = Math.round(amount * totalRate * 100) / 100;

  return {
    taxRate: totalRate,
    taxAmount,
    breakdown,
  };
}
