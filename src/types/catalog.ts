export type SupplementForm = 'Powder' | 'Tablets' | 'Capsules' | 'Liquid' | 'Gummies';

export type CollagenSource =
  | 'Marine (Fish)'
  | 'Grass-Fed Bovine'
  | 'Multi-Collagen (I, II, III, V, X)'
  | 'Vegan Collagen Builder';

export type SubCategory =
  | 'all'
  | 'peptides'
  | 'marine'
  | 'tablets-capsules'
  | 'liquid-gummies'
  | 'beauty-skin';

export type SortOption =
  | 'best-match'
  | 'best-selling'
  | 'highest-rated'
  | 'price-asc'
  | 'price-desc'
  | 'newest';

export interface ProductVariant {
  id: string;
  label: string;
  weightText: string;
  servings: number;
  priceSgd: number;
  listPriceSgd?: number;
  inStock: boolean;
}

export interface SupplementFactRow {
  nutrient: string;
  amount: string;
  dailyValue: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  date: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Product {
  id: string;
  sku: string;
  brand: string;
  title: string;
  shortTitle: string;
  imageUrl: string;
  kicker?: 'Best Seller' | 'iHerb Quality Pick' | 'Super Special' | 'Top Rated' | 'New';
  rating: number;
  reviewCount: number;
  soldRecentlyText: string;
  bestSellingRank: number;
  releasedOrder: number;
  form: SupplementForm;
  source: CollagenSource;
  subCategories: SubCategory[];
  certifications: string[];
  healthTopics: string[];
  variants: ProductVariant[];
  defaultVariantId: string;
  autoShipDiscountPct: number;
  promoText?: string;
  description: string;
  suggestedUse: string;
  servingSize: string;
  supplementFacts: SupplementFactRow[];
  otherIngredients: string;
  reviews: CustomerReview[];
}

export interface FilterState {
  searchQuery: string;
  subCategory: SubCategory;
  inStockOnly: boolean;
  brands: string[];
  sources: CollagenSource[];
  forms: SupplementForm[];
  minRating: number | null;
  certifications: string[];
  minPrice: string;
  maxPrice: string;
  savedOnly: boolean;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  purchaseType: 'one-time' | 'autoship';
}

export interface OrderRecord {
  orderNumber: string;
  date: string;
  itemsCount: number;
  totalSgd: number;
  status: string;
  recipientName: string;
  address: string;
}
