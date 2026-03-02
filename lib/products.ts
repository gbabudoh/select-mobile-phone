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
  shipping: string;
  inStock: boolean;
  country: "US" | "CA" | "US/CA";
  tags?: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "1", name: "iPhone 18 Pro 256GB", brand: "Apple", category: "HANDSET",
    condition: "New", price: 1199, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    rating: 4.9, reviews: 342, seller: "TechWholesale Inc.", sellerType: "Wholesaler",
    isSelectVerified: true, diagnosticScore: 50, shipping: "Free 2-Day",
    inStock: true, country: "US/CA", tags: ["5G", "Dual eSIM", "Titanium", "Bulk"],
    specs: { Storage: "256GB", RAM: "8GB", Display: "6.3\" OLED", Chip: "A20 Pro" },
    bulkAvailable: true, minOrderQty: 10,
  },
  {
    id: "2", name: "Galaxy S26 Ultra 512GB", brand: "Samsung", category: "HANDSET",
    condition: "New", price: 1299, originalPrice: 1419, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    rating: 4.8, reviews: 218, seller: "MobileHub Retail", sellerType: "Retailer",
    isSelectVerified: true, diagnosticScore: 50, shipping: "Free 2-Day",
    inStock: true, country: "US/CA", tags: ["5G", "S Pen", "200MP Camera"],
    specs: { Storage: "512GB", RAM: "12GB", Display: "6.9\" AMOLED", Chip: "Snapdragon 8 Gen 5" },
  },
  {
    id: "3", name: "Pixel 10 Pro 256GB", brand: "Google", category: "HANDSET",
    condition: "New", price: 999, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    rating: 4.7, reviews: 156, seller: "PixelDirect", sellerType: "Retailer",
    isSelectVerified: true, diagnosticScore: 48, shipping: "Free 2-Day",
    inStock: true, country: "US", tags: ["5G", "AI Camera", "Tensor G5"],
    specs: { Storage: "256GB", RAM: "12GB", Display: "6.3\" LTPO", Chip: "Tensor G5" },
  },
  {
    id: "4", name: "iPhone 17 Pro 128GB", brand: "Apple", category: "HANDSET",
    condition: "Certified Pre-Owned", price: 749, originalPrice: 1099, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    rating: 4.6, reviews: 89, seller: "CertifiedMobile", sellerType: "Individual",
    isSelectVerified: true, diagnosticScore: 47, shipping: "Free 2-Day",
    inStock: true, country: "US/CA", tags: ["5G", "Certified", "Like New"],
    specs: { Storage: "128GB", RAM: "8GB", Display: "6.1\" OLED", Chip: "A19 Pro" },
  },
  {
    id: "5", name: "Galaxy S25 FE 256GB", brand: "Samsung", category: "HANDSET",
    condition: "Refurbished", price: 449, originalPrice: 699, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    rating: 4.4, reviews: 67, seller: "BudgetPhones CA", sellerType: "Retailer",
    isSelectVerified: true, diagnosticScore: 45, shipping: "Standard 5-Day",
    inStock: true, country: "CA", tags: ["5G", "Budget", "Great Value"],
    specs: { Storage: "256GB", RAM: "8GB", Display: "6.7\" AMOLED", Chip: "Exynos 2500" },
  },
  {
    id: "6", name: "MagSafe Charger Pro Stand", brand: "Apple", category: "ACCESSORY",
    condition: "New", price: 79, image: "https://images.unsplash.com/photo-1608751819407-f1d1f68fd74c?w=400&h=400&fit=crop",
    rating: 4.5, reviews: 203, seller: "AccessoryWorld", sellerType: "Retailer",
    isSelectVerified: true, shipping: "Free 2-Day",
    inStock: true, country: "US/CA", tags: ["MagSafe", "Wireless", "Fast Charge"],
  },
  {
    id: "7", name: "AirPods Pro 3", brand: "Apple", category: "ACCESSORY",
    condition: "New", price: 249, image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop",
    rating: 4.8, reviews: 512, seller: "TechWholesale Inc.", sellerType: "Wholesaler",
    isSelectVerified: true, shipping: "Free 2-Day",
    inStock: true, country: "US/CA", tags: ["ANC", "Spatial Audio", "USB-C", "Bulk"],
    bulkAvailable: true, minOrderQty: 25,
  },
  {
    id: "8", name: "Cross-Border Unlimited eSIM", brand: "SelectMobile", category: "ESIM_PLAN",
    condition: "New", price: 35, image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
    rating: 4.6, reviews: 1024, seller: "SelectMobile Network", sellerType: "Network Provider",
    isSelectVerified: true, shipping: "Instant eSIM",
    inStock: true, country: "US/CA", tags: ["Unlimited", "US + Canada", "No Contract"],
    planDetails: { data: "Unlimited", talk: "Unlimited", text: "Unlimited", contract: "None" },
  },
  {
    id: "9", name: "OnePlus 14 Pro 256GB", brand: "OnePlus", category: "HANDSET",
    condition: "New", price: 899, image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop",
    rating: 4.5, reviews: 78, seller: "OnePlus Direct", sellerType: "Retailer",
    isSelectVerified: true, diagnosticScore: 49, shipping: "Free 2-Day",
    inStock: true, country: "US", tags: ["5G", "120W Charge", "Hasselblad"],
    specs: { Storage: "256GB", RAM: "16GB", Display: "6.8\" LTPO", Chip: "Snapdragon 8 Gen 5" },
  },
  {
    id: "10", name: "Samsung Galaxy Buds4 Pro", brand: "Samsung", category: "ACCESSORY",
    condition: "New", price: 199, originalPrice: 229, image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop",
    rating: 4.6, reviews: 189, seller: "MobileHub Retail", sellerType: "Retailer",
    isSelectVerified: true, shipping: "Free 2-Day",
    inStock: true, country: "US/CA", tags: ["ANC", "360 Audio", "IPX7"],
  },
  {
    id: "11", name: "Mint Mobile 5GB BYOP Plan", brand: "Mint Mobile", category: "ESIM_PLAN",
    condition: "New", price: 15, image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
    rating: 4.3, reviews: 2340, seller: "Mint Mobile", sellerType: "Network Provider",
    isSelectVerified: true, shipping: "Instant eSIM",
    inStock: true, country: "US", tags: ["MVNO", "Budget", "No Contract"],
    planDetails: { data: "5GB", talk: "Unlimited", text: "Unlimited", contract: "None" },
  },
  {
    id: "12", name: "Pixel 9a 128GB", brand: "Google", category: "HANDSET",
    condition: "Used — Like New", price: 299, originalPrice: 499, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    rating: 4.3, reviews: 45, seller: "PhoneFlip Mike", sellerType: "Individual",
    isSelectVerified: true, diagnosticScore: 44, shipping: "Standard 5-Day",
    inStock: true, country: "US", tags: ["Budget", "AI Camera", "Verified"],
    specs: { Storage: "128GB", RAM: "8GB", Display: "6.1\" OLED", Chip: "Tensor G4" },
  },
  // ─── Additional Wholesaler listings ───
  {
    id: "13", name: "Galaxy S26 Ultra 256GB (Bulk)", brand: "Samsung", category: "HANDSET",
    condition: "New", price: 1149, originalPrice: 1299, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    rating: 4.8, reviews: 94, seller: "NorthStar Wholesale", sellerType: "Wholesaler",
    isSelectVerified: true, diagnosticScore: 50, shipping: "Free 2-Day",
    inStock: true, country: "US/CA", tags: ["5G", "Bulk Pricing", "B2B"],
    specs: { Storage: "256GB", RAM: "12GB", Display: "6.9\" AMOLED", Chip: "Snapdragon 8 Gen 5" },
    bulkAvailable: true, minOrderQty: 5,
  },
  {
    id: "14", name: "iPhone 18 128GB (Pallet — 50 Units)", brand: "Apple", category: "HANDSET",
    condition: "New", price: 899, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    rating: 4.9, reviews: 18, seller: "TechWholesale Inc.", sellerType: "Wholesaler",
    isSelectVerified: true, diagnosticScore: 50, shipping: "Freight / B2B",
    inStock: true, country: "US", tags: ["Pallet", "50 Units", "B2B Only"],
    specs: { Storage: "128GB", RAM: "8GB", Display: "6.1\" OLED", Chip: "A20" },
    bulkAvailable: true, minOrderQty: 50,
  },
  // ─── Additional Retailer listings ───
  {
    id: "15", name: "Nothing Phone (3) 256GB", brand: "Nothing", category: "HANDSET",
    condition: "New", price: 599, image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop",
    rating: 4.4, reviews: 112, seller: "MobileHub Retail", sellerType: "Retailer",
    isSelectVerified: true, diagnosticScore: 49, shipping: "Free 2-Day",
    inStock: true, country: "US", tags: ["Glyph", "Clean OS", "5G"],
    specs: { Storage: "256GB", RAM: "12GB", Display: "6.7\" LTPO", Chip: "Snapdragon 7+ Gen 4" },
  },
  {
    id: "16", name: "Otterbox Defender Pro — iPhone 18", brand: "Otterbox", category: "ACCESSORY",
    condition: "New", price: 59, image: "https://images.unsplash.com/photo-1608751819407-f1d1f68fd74c?w=400&h=400&fit=crop",
    rating: 4.7, reviews: 340, seller: "AccessoryWorld", sellerType: "Retailer",
    isSelectVerified: true, shipping: "Free 2-Day",
    inStock: true, country: "US/CA", tags: ["Rugged", "MIL-STD", "MagSafe"],
  },
  // ─── Additional Individual Seller listings ───
  {
    id: "17", name: "Galaxy S25 Ultra 512GB", brand: "Samsung", category: "HANDSET",
    condition: "Used — Like New", price: 699, originalPrice: 1299, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    rating: 4.5, reviews: 12, seller: "Sarah_TechDeals", sellerType: "Individual",
    isSelectVerified: true, diagnosticScore: 46, shipping: "Standard 5-Day",
    inStock: true, country: "CA", tags: ["Like New", "S Pen", "Verified Seller"],
    specs: { Storage: "512GB", RAM: "12GB", Display: "6.9\" AMOLED", Chip: "Snapdragon 8 Gen 4" },
  },
  {
    id: "18", name: "iPhone 16 Pro Max 256GB", brand: "Apple", category: "HANDSET",
    condition: "Certified Pre-Owned", price: 649, originalPrice: 1199, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    rating: 4.4, reviews: 31, seller: "DeviceSwap_Jay", sellerType: "Individual",
    isSelectVerified: true, diagnosticScore: 45, shipping: "Free 2-Day",
    inStock: true, country: "US", tags: ["CPO", "Titanium", "48/50 Diag"],
    specs: { Storage: "256GB", RAM: "8GB", Display: "6.7\" OLED", Chip: "A18 Pro" },
  },
  // ─── Additional Network Provider listings ───
  {
    id: "19", name: "Visible+ Unlimited Plan", brand: "Visible", category: "ESIM_PLAN",
    condition: "New", price: 45, image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
    rating: 4.5, reviews: 1890, seller: "Visible (Verizon MVNO)", sellerType: "Network Provider",
    isSelectVerified: true, shipping: "Instant eSIM",
    inStock: true, country: "US", tags: ["Unlimited", "Verizon Network", "No Contract"],
    planDetails: { data: "Unlimited (50GB Premium)", talk: "Unlimited", text: "Unlimited", contract: "None" },
  },
  {
    id: "20", name: "Koodo 20GB Canada Plan", brand: "Koodo", category: "ESIM_PLAN",
    condition: "New", price: 40, image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
    rating: 4.2, reviews: 876, seller: "Koodo (Telus Flanker)", sellerType: "Network Provider",
    isSelectVerified: true, shipping: "Instant eSIM",
    inStock: true, country: "CA", tags: ["20GB", "Telus Network", "Budget"],
    planDetails: { data: "20GB", talk: "Unlimited Canada-wide", text: "Unlimited", contract: "None" },
  },
  {
    id: "21", name: "Fido 30GB + US Roaming", brand: "Fido", category: "ESIM_PLAN",
    condition: "New", price: 55, image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
    rating: 4.3, reviews: 432, seller: "Fido (Rogers Flanker)", sellerType: "Network Provider",
    isSelectVerified: true, shipping: "Instant eSIM",
    inStock: true, country: "US/CA", tags: ["30GB", "US Roaming", "Rogers Network"],
    planDetails: { data: "30GB", talk: "Unlimited", text: "Unlimited", contract: "None" },
  },
  {
    id: "22", name: "AT&T Prepaid 15GB eSIM", brand: "AT&T", category: "ESIM_PLAN",
    condition: "New", price: 40, image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
    rating: 4.1, reviews: 2100, seller: "AT&T Prepaid", sellerType: "Network Provider",
    isSelectVerified: true, shipping: "Instant eSIM",
    inStock: true, country: "US", tags: ["Prepaid", "15GB", "No Credit Check"],
    planDetails: { data: "15GB", talk: "Unlimited", text: "Unlimited", contract: "None" },
  },
];

export function getProductById(id: string) {
  return PRODUCTS.find(p => p.id === id);
}
