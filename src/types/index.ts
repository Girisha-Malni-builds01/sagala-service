// SAGALA SERVICE - Core TypeScript Types & Interfaces

export type UserRole = 'customer' | 'vendor' | 'admin';

export type ShopStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type EventType =
  | 'offer_view'
  | 'offer_click'
  | 'shop_view'
  | 'call_tap'
  | 'whatsapp_tap'
  | 'directions_tap'
  | 'favourite_add'
  | 'share'
  | 'search';

export interface Category {
  id: string;
  name_en: string;
  name_ta: string;
  icon: string;
  sort_order: number;
  parent_id?: string;
  group?: string;
  created_at?: string;
}

export interface Locality {
  id: string;
  name: string;
  pincode: string;
  created_at?: string;
}

export interface Shop {
  id: string;
  owner_id?: string;
  name: string;
  category_id: string;
  locality_id: string;
  address: string;
  phone: string;
  whatsapp: string;
  logo_url: string;
  banner_url: string;
  timings: string;
  status: ShopStatus;
  is_verified: boolean;
  created_at?: string;
}

export interface Variant {
  id: string;
  product_id: string;
  label: string; // e.g. "55 inch", "Blue / XL", "25 kg"
  price: number;
  in_stock: boolean;
  created_at?: string;
}

export interface Product {
  id: string;
  shop_id: string;
  category_id?: string;
  name: string;
  description?: string;
  image_url: string;
  variants?: Variant[];
  created_at?: string;
}

export interface Offer {
  id: string;
  shop_id: string;
  product_id?: string;
  title: string;
  description: string;
  image_url: string;
  old_price?: number;
  offer_price: number;
  discount_pct?: number;
  coupon_code: string; // e.g. "SGL-4821"
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  is_featured: boolean;
  created_at?: string;
  // Hydrated helper properties
  shop?: Shop;
  product?: Product;
}

export interface Favourite {
  user_id: string;
  shop_id: string;
  created_at?: string;
}

export interface AnalyticsEvent {
  id: string;
  event_type: EventType;
  offer_id?: string;
  shop_id?: string;
  product_id?: string;
  session_id: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Sale {
  id: string;
  offer_id?: string;
  shop_id: string;
  coupon_code: string;
  amount: number;
  confirmed_at: string;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  phone?: string;
  email?: string;
}

export interface VendorAnalytics {
  shop_id: string;
  shop_name: string;
  shop_views: number;
  offer_views: number;
  total_enquiries: number; // call + wa + directions
  call_taps: number;
  whatsapp_taps: number;
  directions_taps: number;
  favourites_count: number;
  confirmed_sales: number;
  total_revenue_influenced: number;
  conversion_pct: number;
}
