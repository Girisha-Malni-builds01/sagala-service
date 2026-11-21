-- ══════════════════════════════════════════════════════════════
-- SAGALA SERVICE - Madurai Hyperlocal Offers Platform
-- PostgreSQL Database Schema, Views, RLS Policies & Seed Data
-- ══════════════════════════════════════════════════════════════

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('customer', 'vendor', 'admin')) DEFAULT 'customer',
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL UNIQUE,
  name_ta TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LOCALITIES (Madurai Hubs)
CREATE TABLE IF NOT EXISTS localities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  pincode TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SHOPS
CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
  locality_id UUID REFERENCES localities(id) ON DELETE RESTRICT,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  logo_url TEXT,
  banner_url TEXT,
  timings TEXT DEFAULT '9:30 AM - 9:30 PM',
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')) DEFAULT 'pending',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. VARIANTS
CREATE TABLE IF NOT EXISTS variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL, -- e.g. "55 inch", "Blue / XL", "25 kg"
  price NUMERIC(10, 2) NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. OFFERS
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  old_price NUMERIC(10, 2),
  offer_price NUMERIC(10, 2) NOT NULL,
  discount_pct INT,
  coupon_code TEXT NOT NULL, -- e.g. "SGL-4821"
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FAVOURITES
CREATE TABLE IF NOT EXISTS favourites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, shop_id)
);

-- 9. FIRST-PARTY EVENT TRACKER
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL CHECK (
    event_type IN (
      'offer_view', 'offer_click', 'shop_view',
      'call_tap', 'whatsapp_tap', 'directions_tap',
      'favourite_add', 'share', 'search'
    )
  ),
  offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
  shop_id UUID REFERENCES shops(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SALES TRACKING ("SALES BOOST" ENGINE)
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  coupon_code TEXT NOT NULL,
  amount NUMERIC(10, 2) DEFAULT 0,
  confirmed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ══════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_offers_ends_active ON offers(ends_at, is_active);
CREATE INDEX IF NOT EXISTS idx_offers_shop ON offers(shop_id);
CREATE INDEX IF NOT EXISTS idx_offers_featured ON offers(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_events_shop_created ON events(shop_id, created_at);
CREATE INDEX IF NOT EXISTS idx_events_offer_created ON events(offer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_shops_status_locality ON shops(status, locality_id);
CREATE INDEX IF NOT EXISTS idx_sales_shop ON sales(shop_id, confirmed_at);

-- ══════════════════════════════════════════════════════════════
-- ANALYTICS SQL VIEWS
-- ══════════════════════════════════════════════════════════════

-- 1. View: Per-Vendor Analytics
CREATE OR REPLACE VIEW view_vendor_analytics AS
SELECT
  s.id AS shop_id,
  s.name AS shop_name,
  s.owner_id,
  s.status AS shop_status,
  COUNT(DISTINCT CASE WHEN e.event_type = 'shop_view' THEN e.id END) AS shop_views,
  COUNT(DISTINCT CASE WHEN e.event_type = 'offer_view' THEN e.id END) AS offer_views,
  COUNT(DISTINCT CASE WHEN e.event_type IN ('call_tap', 'whatsapp_tap', 'directions_tap') THEN e.id END) AS total_enquiries,
  COUNT(DISTINCT CASE WHEN e.event_type = 'call_tap' THEN e.id END) AS call_taps,
  COUNT(DISTINCT CASE WHEN e.event_type = 'whatsapp_tap' THEN e.id END) AS whatsapp_taps,
  COUNT(DISTINCT CASE WHEN e.event_type = 'directions_tap' THEN e.id END) AS directions_taps,
  COUNT(DISTINCT CASE WHEN e.event_type = 'favourite_add' THEN e.id END) AS favourites_count,
  COALESCE(sl.sales_count, 0) AS confirmed_sales,
  COALESCE(sl.total_revenue, 0) AS total_revenue_influenced,
  ROUND(
    CASE 
      WHEN COUNT(DISTINCT CASE WHEN e.event_type = 'offer_view' THEN e.id END) > 0 
      THEN (COALESCE(sl.sales_count, 0)::NUMERIC / COUNT(DISTINCT CASE WHEN e.event_type = 'offer_view' THEN e.id END)::NUMERIC) * 100
      ELSE 0
    END, 2
  ) AS conversion_pct
FROM shops s
LEFT JOIN events e ON s.id = e.shop_id
LEFT JOIN (
  SELECT shop_id, COUNT(*) AS sales_count, SUM(amount) AS total_revenue
  FROM sales
  GROUP BY shop_id
) sl ON s.id = sl.shop_id
GROUP BY s.id, s.name, s.owner_id, s.status, sl.sales_count, sl.total_revenue;

-- 2. View: Per-Offer Performance
CREATE OR REPLACE VIEW view_offer_analytics AS
SELECT
  o.id AS offer_id,
  o.title AS offer_title,
  o.coupon_code,
  o.shop_id,
  s.name AS shop_name,
  o.is_active,
  o.ends_at,
  COUNT(DISTINCT CASE WHEN e.event_type = 'offer_view' THEN e.id END) AS views_count,
  COUNT(DISTINCT CASE WHEN e.event_type = 'offer_click' THEN e.id END) AS clicks_count,
  COUNT(DISTINCT CASE WHEN e.event_type IN ('call_tap', 'whatsapp_tap', 'directions_tap') THEN e.id END) AS enquiries_count,
  COUNT(DISTINCT sl.id) AS confirmed_sales_count,
  COALESCE(SUM(sl.amount), 0) AS sales_revenue
FROM offers o
JOIN shops s ON o.shop_id = s.id
LEFT JOIN events e ON o.id = e.offer_id
LEFT JOIN sales sl ON o.id = sl.offer_id
GROUP BY o.id, o.title, o.coupon_code, o.shop_id, s.name, o.is_active, o.ends_at;

-- ══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ══════════════════════════════════════════════════════════════
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE localities ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Profiles: users read & update their own profile; admins read all
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Categories & Localities: public read, admin modify
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin modify categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public read localities" ON localities FOR SELECT USING (true);
CREATE POLICY "Admin modify localities" ON localities FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Shops: public reads approved shops; vendors read/edit own; admin edits all
CREATE POLICY "Public read approved shops" ON shops FOR SELECT USING (
  status = 'approved' OR 
  owner_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Vendors create shops" ON shops FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Vendors update own shops" ON shops FOR UPDATE USING (
  owner_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin delete shops" ON shops FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products & Variants: public read for approved shops; vendor manage own
CREATE POLICY "Public read products" ON products FOR SELECT USING (
  EXISTS (SELECT 1 FROM shops WHERE shops.id = products.shop_id AND (shops.status = 'approved' OR shops.owner_id = auth.uid())) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Vendors manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM shops WHERE shops.id = products.shop_id AND shops.owner_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public read variants" ON variants FOR SELECT USING (true);
CREATE POLICY "Vendors manage variants" ON variants FOR ALL USING (
  EXISTS (
    SELECT 1 FROM products 
    JOIN shops ON shops.id = products.shop_id 
    WHERE products.id = variants.product_id AND shops.owner_id = auth.uid()
  ) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Offers: public read active offers for approved shops; vendor manage own; admin manage all
CREATE POLICY "Public read active offers" ON offers FOR SELECT USING (
  (is_active = true AND ends_at > NOW() AND EXISTS (SELECT 1 FROM shops WHERE shops.id = offers.shop_id AND shops.status = 'approved')) OR
  EXISTS (SELECT 1 FROM shops WHERE shops.id = offers.shop_id AND shops.owner_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Vendors manage own offers" ON offers FOR ALL USING (
  EXISTS (SELECT 1 FROM shops WHERE shops.id = offers.shop_id AND shops.owner_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Events: anyone can insert events; vendors can read their shop events; admin reads all
CREATE POLICY "Public insert events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Vendors read own events" ON events FOR SELECT USING (
  EXISTS (SELECT 1 FROM shops WHERE shops.id = events.shop_id AND shops.owner_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Sales: vendors insert & read their shop sales; admin reads all
CREATE POLICY "Vendors manage shop sales" ON sales FOR ALL USING (
  EXISTS (SELECT 1 FROM shops WHERE shops.id = sales.shop_id AND shops.owner_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Favourites: users manage own
CREATE POLICY "Users manage favourites" ON favourites FOR ALL USING (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════════════
-- SEED DATA (MADURAI HYPERLOCAL ECOSYSTEM)
-- ══════════════════════════════════════════════════════════════

-- Insert Categories
INSERT INTO categories (id, name_en, name_ta, icon, sort_order) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Electronics', 'மின்சாதனங்கள்', 'Tv', 1),
  ('c2222222-2222-2222-2222-222222222222', 'Clothing', 'ஆடைகள்', 'Shirt', 2),
  ('c3333333-3333-3333-3333-333333333333', 'Groceries', 'மளிகை', 'ShoppingBag', 3),
  ('c4444444-4444-4444-4444-444444444444', 'Home Appliances', 'வீட்டு உபயோக பொருட்கள்', 'Refrigerator', 4),
  ('c5555555-5555-5555-5555-555555555555', 'Furniture', 'மரச்சாமான்கள்', 'Armchair', 5),
  ('c6666666-6666-6666-6666-666666666666', 'Hardware', 'வன்பொருட்கள்', 'Wrench', 6),
  ('c7777777-7777-7777-7777-777777777777', 'Women Boutiques', 'பெண்கள் பூட்டிக் & ஆடைகள்', 'Sparkles', 7),
  ('c8888888-8888-8888-8888-888888888888', 'Kids Wear', 'குழந்தைகள் ஆடைகள்', 'Baby', 8),
  ('c9999999-9999-9999-9999-999999999999', 'Catering Services', 'கேட்டரிங் சேவைகள்', 'UtensilsCrossed', 9),
  ('caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Gift Shops', 'பரிசுப் பொருட்கள் கடைகள்', 'Gift', 10),
  ('cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Tools Rentals', 'கருவிகள் வாடகை', 'Hammer', 11),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Construction Materials', 'கட்டுமான பொருட்கள்', 'HardHat', 12),
  ('cddddddd-dddd-dddd-dddd-dddddddddddd', 'Chemicals', 'இரசாயன பொருட்கள்', 'FlaskConical', 13),
  ('ceeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Textiles & Apparel', 'ஜவுளி & ஆடை உற்பத்தி', 'Scissors', 14),
  ('cfffffff-ffff-ffff-ffff-ffffffffffff', 'Food & Agro-Processing', 'உணவு & விவசாய பதப்படுத்துதல்', 'Wheat', 15)
ON CONFLICT (name_en) DO NOTHING;

-- Insert Localities in Madurai
INSERT INTO localities (id, name, pincode) VALUES
  ('l1111111-1111-1111-1111-111111111111', 'Anna Nagar', '625020'),
  ('l2222222-2222-2222-2222-222222222222', 'KK Nagar', '625020'),
  ('l3333333-3333-3333-3333-333333333333', 'Simmakkal', '625001'),
  ('l4444444-4444-4444-4444-444444444444', 'Goripalayam', '625002'),
  ('l5555555-5555-5555-5555-555555555555', 'Meenakshi Temple Area', '625001'),
  ('l6666666-6666-6666-6666-666666666666', 'Mattuthavani', '625007'),
  ('l7777777-7777-7777-7777-777777777777', 'SS Colony', '625016'),
  ('l8888888-8888-8888-8888-888888888888', 'South Gate', '625001')
ON CONFLICT (name) DO NOTHING;

-- Insert Realistic Madurai Shops
INSERT INTO shops (id, name, category_id, locality_id, address, phone, whatsapp, logo_url, banner_url, timings, status, is_verified) VALUES
  (
    's1111111-1111-1111-1111-111111111111',
    'Meenakshi Silks & Sarees',
    'c2222222-2222-2222-2222-222222222222',
    'l3333333-3333-3333-3333-333333333333',
    '45, West Tower Street, Simmakkal, Madurai',
    '+919842101234',
    '+919842101234',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    '9:30 AM - 9:30 PM',
    'approved',
    true
  ),
  (
    's2222222-2222-2222-2222-222222222222',
    'Madurai Tech Zone & Mobiles',
    'c1111111-1111-1111-1111-111111111111',
    'l1111111-1111-1111-1111-111111111111',
    '12, 80 Feet Road, Near Apollo Hospital, Anna Nagar, Madurai',
    '+919842234567',
    '+919842234567',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80',
    '10:00 AM - 10:00 PM',
    'approved',
    true
  ),
  (
    's3333333-3333-3333-3333-333333333333',
    'Pandian Home Appliances',
    'c4444444-4444-4444-4444-444444444444',
    'l2222222-2222-2222-2222-222222222222',
    '78, Rajaji Street, KK Nagar Arch, Madurai',
    '+919842345678',
    '+919842345678',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80',
    '9:00 AM - 9:00 PM',
    'approved',
    true
  ),
  (
    's4444444-4444-4444-4444-444444444444',
    'Nadar Maligai Superstore',
    'c3333333-3333-3333-3333-333333333333',
    'l4444444-4444-4444-4444-444444444444',
    '15, Alagar Kovil Main Road, Goripalayam, Madurai',
    '+919842456789',
    '+919842456789',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop&q=80',
    '8:00 AM - 10:00 PM',
    'approved',
    true
  ),
  (
    's5555555-5555-5555-5555-555555555555',
    'Vaigai Teak & Home Furniture',
    'c5555555-5555-5555-5555-555555555555',
    'l6666666-6666-6666-6666-666666666666',
    '102, Ring Road Junction, Mattuthavani, Madurai',
    '+919842567890',
    '+919842567890',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80',
    '10:00 AM - 8:30 PM',
    'approved',
    true
  ),
  (
    's6666666-6666-6666-6666-666666666666',
    'Madura Power Tools & Hardware',
    'c6666666-6666-6666-6666-666666666666',
    'l8888888-8888-8888-8888-888888888888',
    '23, South Masi Street, South Gate, Madurai',
    '+919842678901',
    '+919842678901',
    'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
    '9:00 AM - 8:00 PM',
    'approved',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Products
INSERT INTO products (id, shop_id, category_id, name, description, image_url) VALUES
  ('p1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 'Pure Kanchipuram Silk Saree', 'Traditional bridal silk saree with rich pure zari pallu and contrasting blouse piece', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'),
  ('p2222222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'OnePlus Nord CE 4 5G', 'Snapdragon 7 Gen 3, 100W SuperVOOC fast charging, 120Hz AMOLED display', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80'),
  ('p3333333-3333-3333-3333-333333333333', 's3333333-3333-3333-3333-333333333333', 'c4444444-4444-4444-4444-444444444444', 'Samsung 4K Crystal UHD Smart TV', 'Ultra HD 4K, HDR10+, Dynamic Crystal Color, Motion Xcelerator with voice remote', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80'),
  ('p4444444-4444-4444-4444-444444444444', 's4444444-4444-4444-4444-444444444444', 'c3333333-3333-3333-3333-333333333333', 'Premium Traditional Ponni Rice Bag', 'Aged sortex clean first quality Ponni boiled rice, sweet aroma and non-sticky', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'),
  ('p5555555-5555-5555-5555-555555555555', 's5555555-5555-5555-5555-555555555555', 'c5555555-5555-5555-5555-555555555555', 'Solid Teak Wood 6-Seater Dining Set', 'Crafted from pure Indian teakwood with tempered glass top and cushioned chairs', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&auto=format&fit=crop&q=80'),
  ('p6666666-6666-6666-6666-666666666666', 's6666666-6666-6666-6666-666666666666', 'c6666666-6666-6666-6666-666666666666', 'Bosch Heavy Duty Impact Drill Kit', '550W rotary hammer with 100-piece accessory toolbox for home and professional use', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- Insert Variants
INSERT INTO variants (product_id, label, price, in_stock) VALUES
  ('p1111111-1111-1111-1111-111111111111', 'Royal Maroon & Gold Zari', 9499.00, true),
  ('p1111111-1111-1111-1111-111111111111', 'Temple Peacock Green', 11999.00, true),
  ('p2222222-2222-2222-2222-222222222222', '8GB RAM + 128GB Storage (Celadon Marble)', 24999.00, true),
  ('p2222222-2222-2222-2222-222222222222', '8GB RAM + 256GB Storage (Dark Chrome)', 26999.00, true),
  ('p3333333-3333-3333-3333-333333333333', '43 inch 4K Ultra HD', 29990.00, true),
  ('p3333333-3333-3333-3333-333333333333', '55 inch 4K Ultra HD', 44990.00, true),
  ('p4444444-4444-4444-4444-444444444444', '10 kg Pack', 680.00, true),
  ('p4444444-4444-4444-4444-444444444444', '25 kg Family Bag', 1650.00, true),
  ('p5555555-5555-5555-5555-555555555555', '4-Seater Compact Teak', 24500.00, true),
  ('p5555555-5555-5555-5555-555555555555', '6-Seater Royal Teak + Cushion', 38000.00, true),
  ('p6666666-6666-6666-6666-666666666666', 'Standard 550W Drill Kit', 4200.00, true),
  ('p6666666-6666-6666-6666-666666666666', 'Professional 750W Hammer Drill + 120 pcs', 6800.00, true)
ON CONFLICT DO NOTHING;

-- Insert Offers (Active, Featured, and Ending Soon)
INSERT INTO offers (id, shop_id, product_id, title, description, image_url, old_price, offer_price, discount_pct, coupon_code, starts_at, ends_at, is_active, is_featured) VALUES
  (
    'o1111111-1111-1111-1111-111111111111',
    's1111111-1111-1111-1111-111111111111',
    'p1111111-1111-1111-1111-111111111111',
    'Grand Wedding Silk Saree Festival - 40% Off!',
    'Direct weaver special! Flat 40% off on all bridal silk sarees. Free matching silk stole on every purchase above ₹10,000.',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    15999.00,
    9499.00,
    40,
    'SGL-4821',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '3 days',
    true,
    true
  ),
  (
    'o2222222-2222-2222-2222-222222222222',
    's2222222-2222-2222-2222-222222222222',
    'p2222222-2222-2222-2222-222222222222',
    'OnePlus 5G Mega Launch Offer + Free Earbuds',
    'Get flat ₹3,000 instant discount on OnePlus Nord CE 4 with free OnePlus wireless earphones and scratch guard in Madurai.',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    27999.00,
    23999.00,
    14,
    'SGL-9102',
    NOW() - INTERVAL '2 hours',
    NOW() + INTERVAL '24 hours',
    true,
    true
  ),
  (
    'o3333333-3333-3333-3333-333333333333',
    's3333333-3333-3333-3333-333333333333',
    'p3333333-3333-3333-3333-333333333333',
    'Samsung 55" 4K Smart TV - Flash Weekend Sale',
    'Stunning 4K resolution. Free wall mounting bracket and 3-year extended panel warranty when you quote SAGALA code at counter.',
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
    59990.00,
    42990.00,
    28,
    'SGL-3341',
    NOW() - INTERVAL '6 hours',
    NOW() + INTERVAL '18 hours', -- Ending soon!
    true,
    true
  ),
  (
    'o4444444-4444-4444-4444-444444444444',
    's4444444-4444-4444-4444-444444444444',
    'p4444444-4444-4444-4444-444444444444',
    'Month-End Grocery Bonanza: Ponni Rice 25kg + 1L Oil Free',
    'Buy 1 bag of Super Grade Ponni Rice (25kg) and get 1 Litre Gold Winner Sunflower Oil 100% free! Goripalayam store only.',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    1850.00,
    1499.00,
    19,
    'SGL-7729',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '5 days',
    true,
    false
  ),
  (
    'o5555555-5555-5555-5555-555555555555',
    's5555555-5555-5555-5555-555555555555',
    'p5555555-5555-5555-5555-555555555555',
    'Solid Teak Dining Table Set - Flat 35% Off Clearance',
    'Direct factory outlet clearance in Mattuthavani. 100% water resistant, termite treated. Free delivery anywhere in Madurai city.',
    'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&auto=format&fit=crop&q=80',
    49000.00,
    31850.00,
    35,
    'SGL-8815',
    NOW() - INTERVAL '2 days',
    NOW() + INTERVAL '4 days',
    true,
    false
  ),
  (
    'o6666666-6666-6666-6666-666666666666',
    's6666666-6666-6666-6666-666666666666',
    'p6666666-6666-6666-6666-666666666666',
    'Bosch 550W Impact Drill + 100pc Tool Kit at 30% Off',
    'Professional drill machine complete set for contractors and home fixes. Genuine 1-year Bosch India warranty.',
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
    5200.00,
    3640.00,
    30,
    'SGL-5520',
    NOW() - INTERVAL '3 hours',
    NOW() + INTERVAL '48 hours',
    true,
    false
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Seed Events (to simulate real traffic and sales boost)
INSERT INTO events (event_type, offer_id, shop_id, session_id, created_at) VALUES
  ('offer_view', 'o1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'sess_demo_1', NOW() - INTERVAL '4 hours'),
  ('offer_view', 'o1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'sess_demo_2', NOW() - INTERVAL '3 hours'),
  ('whatsapp_tap', 'o1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'sess_demo_2', NOW() - INTERVAL '3 hours'),
  ('offer_view', 'o2222222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222', 'sess_demo_3', NOW() - INTERVAL '2 hours'),
  ('call_tap', 'o2222222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222', 'sess_demo_3', NOW() - INTERVAL '2 hours'),
  ('directions_tap', 'o3333333-3333-3333-3333-333333333333', 's3333333-3333-3333-3333-333333333333', 'sess_demo_4', NOW() - INTERVAL '1 hour');

-- Insert Seed Confirmed Sales (demonstrating Sales Boost with coupon codes)
INSERT INTO sales (offer_id, shop_id, coupon_code, amount, confirmed_at) VALUES
  ('o1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'SGL-4821', 9499.00, NOW() - INTERVAL '2 hours'),
  ('o2222222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222', 'SGL-9102', 23999.00, NOW() - INTERVAL '1 hour');
