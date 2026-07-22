export interface Product {
  id: string;
  name: string;
  brand: string;
  category: "HANDSET" | "ACCESSORY" | "SIM_CARD" | "ESIM_PLAN" | "BUNDLE";
  condition: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  seller: string;
  sellerType: "Wholesaler" | "Retailer" | "Individual" | "Network Provider";
  isSelectVerified: boolean;
  bulkAvailable?: boolean;
  minOrderQty?: number;
  planDetails?: { data: string; talk: string; text: string; contract: string };
  diagnosticScore?: number;
  specs?: Record<string, string>;
  colors?: { name: string; hex: string; image?: string }[];
  images?: string[];
  shipping: string;
  inStock: boolean;
  country: "US" | "CA" | "US/CA";
  tags?: string[];
}

export const PRODUCTS: Product[] = [];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
