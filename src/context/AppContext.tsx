import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  ShopStatus,
  Category,
  Locality,
  Shop,
  Product,
  Variant,
  Offer,
  Sale,
  AnalyticsEvent,
  VendorAnalytics
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_LOCALITIES,
  INITIAL_SHOPS,
  INITIAL_PRODUCTS,
  INITIAL_VARIANTS,
  INITIAL_OFFERS,
  INITIAL_SALES,
  INITIAL_EVENTS
} from '../data/seedData';
import { generateCouponCode } from '../lib/utils';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { trackEvent } from '../lib/eventTracker';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedShopId: string | null;
  setSelectedShopId: (id: string | null) => void;

  // Data
  categories: Category[];
  localities: Locality[];
  shops: Shop[];
  products: Product[];
  variants: Variant[];
  offers: Offer[];
  sales: Sale[];
  events: AnalyticsEvent[];

  // Filters
  filterCategory: string | null;
  setFilterCategory: (id: string | null) => void;
  filterLocality: string | null;
  setFilterLocality: (id: string | null) => void;
  filterFeed: 'all' | 'trending' | 'ending_soon';
  setFilterFeed: (feed: 'all' | 'trending' | 'ending_soon') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterMinDiscount: number | null;
  setFilterMinDiscount: (discount: number | null) => void;

  // Favourites
  favourites: string[];
  toggleFavourite: (shopId: string) => void;
  isFavourite: (shopId: string) => boolean;

  // Product Comparison (up to 3 products)
  compareProducts: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;

  // Vendor Functions
  currentVendorShopId: string;
  setCurrentVendorShopId: (shopId: string) => void;
  addOffer: (offerData: Omit<Offer, 'id' | 'coupon_code' | 'created_at'>) => void;
  updateOffer: (offerId: string, updates: Partial<Offer>) => void;
  deleteOffer: (offerId: string) => void;
  toggleOfferActive: (offerId: string) => void;
  addProduct: (productData: Omit<Product, 'id'>, variants: Omit<Variant, 'id' | 'product_id'>[]) => void;
  markSale: (couponCode: string, amount: number) => { success: boolean; message: string; sale?: Sale };
  registerShop: (shopData: Omit<Shop, 'id' | 'status' | 'is_verified' | 'created_at'>) => void;
  getVendorAnalytics: (shopId: string) => VendorAnalytics;

  // Admin Functions
  updateShopStatus: (shopId: string, status: ShopStatus) => void;
  toggleFeaturedOffer: (offerId: string) => void;
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addLocality: (loc: Omit<Locality, 'id'>) => void;
  deleteLocality: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user role ('customer' | 'vendor' | 'admin')
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('sagala_role') as UserRole) || 'customer';
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [currentVendorShopId, setCurrentVendorShopId] = useState<string>('shop-1');

  // Core Data State (Initialized from localStorage or Seed Data with smart upgrade)
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('sagala_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length >= INITIAL_CATEGORIES.length) return parsed;
      } catch (e) {}
    }
    return INITIAL_CATEGORIES;
  });

  const [localities, setLocalities] = useState<Locality[]>(() => {
    const saved = localStorage.getItem('sagala_localities');
    return saved ? JSON.parse(saved) : INITIAL_LOCALITIES;
  });

  const [shops, setShops] = useState<Shop[]>(() => {
    const saved = localStorage.getItem('sagala_shops');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length >= INITIAL_SHOPS.length) return parsed;
      } catch (e) {}
    }
    return INITIAL_SHOPS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sagala_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length >= INITIAL_PRODUCTS.length) return parsed;
      } catch (e) {}
    }
    return INITIAL_PRODUCTS;
  });

  const [variants, setVariants] = useState<Variant[]>(() => {
    const saved = localStorage.getItem('sagala_variants');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length >= INITIAL_VARIANTS.length) return parsed;
      } catch (e) {}
    }
    return INITIAL_VARIANTS;
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem('sagala_offers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length >= INITIAL_OFFERS.length) return parsed;
      } catch (e) {}
    }
    return INITIAL_OFFERS;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('sagala_sales');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length >= INITIAL_SALES.length) return parsed;
      } catch (e) {}
    }
    return INITIAL_SALES;
  });

  const [events, setEvents] = useState<AnalyticsEvent[]>(() => {
    const saved = localStorage.getItem('sagala_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  // Filters State
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterLocality, setFilterLocality] = useState<string | null>(null);
  const [filterFeed, setFilterFeed] = useState<'all' | 'trending' | 'ending_soon'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMinDiscount, setFilterMinDiscount] = useState<number | null>(null);

  // Favourites State
  const [favourites, setFavourites] = useState<string[]>(() => {
    const saved = localStorage.getItem('sagala_favs');
    return saved ? JSON.parse(saved) : ['shop-1', 'shop-2'];
  });

  // Compare Drawer State
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  // Persist State Changes
  useEffect(() => {
    localStorage.setItem('sagala_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('sagala_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('sagala_localities', JSON.stringify(localities));
  }, [localities]);

  useEffect(() => {
    localStorage.setItem('sagala_shops', JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem('sagala_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sagala_variants', JSON.stringify(variants));
  }, [variants]);

  useEffect(() => {
    localStorage.setItem('sagala_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('sagala_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('sagala_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('sagala_favs', JSON.stringify(favourites));
  }, [favourites]);

  // Event Listener for First-Party Analytics Event Dispatch
  useEffect(() => {
    const handleEventTracked = (e: any) => {
      if (e.detail) {
        setEvents((prev) => [e.detail, ...prev]);
      }
    };
    window.addEventListener('sagala_event_tracked', handleEventTracked);
    return () => window.removeEventListener('sagala_event_tracked', handleEventTracked);
  }, []);

  // Supabase Realtime Integration (if credentials configured)
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return;
    const client = supabase;

    // Load initial data from Supabase
    const loadSupabaseData = async () => {
      try {
        const [catRes, locRes, shopRes, offRes] = await Promise.all([
          client.from('categories').select('*'),
          client.from('localities').select('*'),
          client.from('shops').select('*'),
          client.from('offers').select('*')
        ]);
        if (catRes.data?.length) setCategories(catRes.data);
        if (locRes.data?.length) setLocalities(locRes.data);
        if (shopRes.data?.length) setShops(shopRes.data);
        if (offRes.data?.length) setOffers(offRes.data);
      } catch (err) {
        console.warn('Using local store, Supabase sync:', err);
      }
    };
    loadSupabaseData();

    // Subscribe to live offers updates
    const channel = client
      .channel('public:offers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'offers' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setOffers((prev) => [payload.new as Offer, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setOffers((prev) =>
            prev.map((o) => (o.id === payload.new.id ? (payload.new as Offer) : o))
          );
        } else if (payload.eventType === 'DELETE') {
          setOffers((prev) => prev.filter((o) => o.id === payload.old.id));
        }
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  // Favourites Toggle
  const toggleFavourite = (shopId: string) => {
    setFavourites((prev) => {
      const exists = prev.includes(shopId);
      const next = exists ? prev.filter((id) => id !== shopId) : [...prev, shopId];
      if (!exists) {
        trackEvent({
          eventType: 'favourite_add',
          shopId
        });
      }
      return next;
    });
  };

  const isFavourite = (shopId: string) => favourites.includes(shopId);

  // Product Comparison (max 3)
  const addToCompare = (product: Product) => {
    setCompareProducts((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      if (prev.length >= 3) {
        return [...prev.slice(1), product];
      }
      return [...prev, product];
    });
    setIsCompareOpen(true);
  };

  const removeFromCompare = (productId: string) => {
    setCompareProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareProducts([]);
    setIsCompareOpen(false);
  };

  // Vendor: Add Offer (under 30s)
  const addOffer = (offerData: Omit<Offer, 'id' | 'coupon_code' | 'created_at'>) => {
    const couponCode = generateCouponCode();
    const newOffer: Offer = {
      ...offerData,
      id: 'off-' + Date.now().toString(36),
      coupon_code: couponCode,
      created_at: new Date().toISOString()
    };
    setOffers((prev) => [newOffer, ...prev]);

    if (isSupabaseConfigured() && supabase) {
      supabase.from('offers').insert(newOffer).then();
    }
  };

  const updateOffer = (offerId: string, updates: Partial<Offer>) => {
    setOffers((prev) =>
      prev.map((off) => (off.id === offerId ? { ...off, ...updates } : off))
    );
    if (isSupabaseConfigured() && supabase) {
      supabase.from('offers').update(updates).eq('id', offerId).then();
    }
  };

  const deleteOffer = (offerId: string) => {
    setOffers((prev) => prev.filter((off) => off.id !== offerId));
    if (isSupabaseConfigured() && supabase) {
      supabase.from('offers').delete().eq('id', offerId).then();
    }
  };

  const toggleOfferActive = (offerId: string) => {
    setOffers((prev) =>
      prev.map((off) =>
        off.id === offerId ? { ...off, is_active: !off.is_active } : off
      )
    );
  };

  // Vendor: Add Product with Variants
  const addProduct = (
    productData: Omit<Product, 'id'>,
    newVariants: Omit<Variant, 'id' | 'product_id'>[]
  ) => {
    const productId = 'prod-' + Date.now().toString(36);
    const createdProduct: Product = {
      ...productData,
      id: productId,
      created_at: new Date().toISOString()
    };

    const createdVariants: Variant[] = newVariants.map((v, i) => ({
      ...v,
      id: `var-${Date.now().toString(36)}-${i}`,
      product_id: productId,
      created_at: new Date().toISOString()
    }));

    setProducts((prev) => [createdProduct, ...prev]);
    setVariants((prev) => [...prev, ...createdVariants]);

    if (isSupabaseConfigured() && supabase) {
      supabase.from('products').insert(createdProduct).then();
      supabase.from('variants').insert(createdVariants).then();
    }
  };

  // Vendor: Mark Sale (Sales Boost confirmation via coupon code)
  const markSale = (couponCode: string, amount: number) => {
    const cleanCode = couponCode.trim().toUpperCase();
    const matchedOffer = offers.find(
      (o) => o.coupon_code.toUpperCase() === cleanCode && o.shop_id === currentVendorShopId
    );

    if (!matchedOffer) {
      return {
        success: false,
        message: 'Invalid Coupon Code or coupon belongs to another shop.'
      };
    }

    const saleAmount = amount > 0 ? amount : matchedOffer.offer_price;
    const newSale: Sale = {
      id: 'sale-' + Date.now().toString(36),
      offer_id: matchedOffer.id,
      shop_id: matchedOffer.shop_id,
      coupon_code: matchedOffer.coupon_code,
      amount: saleAmount,
      confirmed_at: new Date().toISOString()
    };

    setSales((prev) => [newSale, ...prev]);

    if (isSupabaseConfigured() && supabase) {
      supabase.from('sales').insert(newSale).then();
    }

    return {
      success: true,
      message: `Sale Confirmed! ₹${saleAmount} logged for "${matchedOffer.title}".`,
      sale: newSale
    };
  };

  // Vendor: Simple Signup / Register Shop
  const registerShop = (shopData: Omit<Shop, 'id' | 'status' | 'is_verified' | 'created_at'>) => {
    const newShopId = 'shop-' + Date.now().toString(36);
    const newShop: Shop = {
      ...shopData,
      id: newShopId,
      status: 'pending', // Pending until admin approval
      is_verified: false,
      created_at: new Date().toISOString()
    };
    setShops((prev) => [...prev, newShop]);
    setCurrentVendorShopId(newShopId);
    setRole('vendor');
    setActiveTab('vendor_dashboard');

    if (isSupabaseConfigured() && supabase) {
      supabase.from('shops').insert(newShop).then();
    }
  };

  // Vendor Analytics Computation
  const getVendorAnalytics = (shopId: string): VendorAnalytics => {
    const shop = shops.find((s) => s.id === shopId);
    const shopEvents = events.filter((e) => e.shop_id === shopId);
    const shopSales = sales.filter((s) => s.shop_id === shopId);

    const shop_views = shopEvents.filter((e) => e.event_type === 'shop_view').length;
    const offer_views = shopEvents.filter((e) => e.event_type === 'offer_view').length;
    const call_taps = shopEvents.filter((e) => e.event_type === 'call_tap').length;
    const whatsapp_taps = shopEvents.filter((e) => e.event_type === 'whatsapp_tap').length;
    const directions_taps = shopEvents.filter((e) => e.event_type === 'directions_tap').length;
    const favourites_count = shopEvents.filter((e) => e.event_type === 'favourite_add').length;
    const total_enquiries = call_taps + whatsapp_taps + directions_taps;

    const confirmed_sales = shopSales.length;
    const total_revenue_influenced = shopSales.reduce((acc, s) => acc + (s.amount || 0), 0);
    const conversion_pct = offer_views > 0 ? Number(((confirmed_sales / offer_views) * 100).toFixed(1)) : 0;

    return {
      shop_id: shopId,
      shop_name: shop ? shop.name : 'My Shop',
      shop_views,
      offer_views,
      total_enquiries,
      call_taps,
      whatsapp_taps,
      directions_taps,
      favourites_count,
      confirmed_sales,
      total_revenue_influenced,
      conversion_pct
    };
  };

  // Admin: Update Shop Status
  const updateShopStatus = (shopId: string, status: ShopStatus) => {
    setShops((prev) =>
      prev.map((s) => (s.id === shopId ? { ...s, status, is_verified: status === 'approved' } : s))
    );
    if (isSupabaseConfigured() && supabase) {
      supabase.from('shops').update({ status }).eq('id', shopId).then();
    }
  };

  // Admin: Toggle Featured Offer
  const toggleFeaturedOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, is_featured: !o.is_featured } : o))
    );
    if (isSupabaseConfigured() && supabase) {
      const off = offers.find((o) => o.id === offerId);
      if (off) {
        supabase.from('offers').update({ is_featured: !off.is_featured }).eq('id', offerId).then();
      }
    }
  };

  // Admin: Categories
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...cat,
      id: 'cat-' + Date.now().toString(36)
    };
    setCategories((prev) => [...prev, newCat]);
    if (isSupabaseConfigured() && supabase) {
      supabase.from('categories').insert(newCat).then();
    }
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    if (isSupabaseConfigured() && supabase) {
      supabase.from('categories').update(updates).eq('id', id).then();
    }
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (isSupabaseConfigured() && supabase) {
      supabase.from('categories').delete().eq('id', id).then();
    }
  };

  // Admin: Localities
  const addLocality = (loc: Omit<Locality, 'id'>) => {
    const newLoc: Locality = {
      ...loc,
      id: 'loc-' + Date.now().toString(36)
    };
    setLocalities((prev) => [...prev, newLoc]);
    if (isSupabaseConfigured() && supabase) {
      supabase.from('localities').insert(newLoc).then();
    }
  };

  const deleteLocality = (id: string) => {
    setLocalities((prev) => prev.filter((l) => l.id !== id));
    if (isSupabaseConfigured() && supabase) {
      supabase.from('localities').delete().eq('id', id).then();
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        selectedShopId,
        setSelectedShopId,
        categories,
        localities,
        shops,
        products,
        variants,
        offers,
        sales,
        events,
        filterCategory,
        setFilterCategory,
        filterLocality,
        setFilterLocality,
        filterFeed,
        setFilterFeed,
        searchQuery,
        setSearchQuery,
        filterMinDiscount,
        setFilterMinDiscount,
        favourites,
        toggleFavourite,
        isFavourite,
        compareProducts,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen,
        currentVendorShopId,
        setCurrentVendorShopId,
        addOffer,
        updateOffer,
        deleteOffer,
        toggleOfferActive,
        addProduct,
        markSale,
        registerShop,
        getVendorAnalytics,
        updateShopStatus,
        toggleFeaturedOffer,
        addCategory,
        updateCategory,
        deleteCategory,
        addLocality,
        deleteLocality
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
