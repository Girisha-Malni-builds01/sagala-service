// Seed Data for Madurai Hyperlocal Ecosystem
import { Category, Locality, Shop, Product, Variant, Offer, AnalyticsEvent, Sale } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  // 1. Retail & Gadgets
  {
    id: 'cat-elec',
    name_en: 'Electronics',
    name_ta: 'மின்சாதனங்கள்',
    icon: 'Tv',
    group: 'Retail & Gadgets',
    sort_order: 1
  },
  {
    id: 'cat-gift',
    name_en: 'Gift Shops',
    name_ta: 'பரிசுப் பொருட்கள் கடைகள்',
    icon: 'Gift',
    group: 'Retail & Gadgets',
    sort_order: 2
  },

  // 2. Fashion & Apparel (with subcategories Women Boutiques and Kids Wear)
  {
    id: 'cat-cloth',
    name_en: 'Clothing',
    name_ta: 'ஆடைகள்',
    icon: 'Shirt',
    group: 'Fashion & Apparel',
    sort_order: 3
  },
  {
    id: 'cat-boutique',
    name_en: 'Women Boutiques',
    name_ta: 'பெண்கள் பூட்டிக் & ஆடைகள்',
    icon: 'Sparkles',
    parent_id: 'cat-cloth',
    group: 'Fashion & Apparel',
    sort_order: 4
  },
  {
    id: 'cat-kids',
    name_en: 'Kids Wear',
    name_ta: 'குழந்தைகள் ஆடைகள்',
    icon: 'Baby',
    parent_id: 'cat-cloth',
    group: 'Fashion & Apparel',
    sort_order: 5
  },
  {
    id: 'cat-textile',
    name_en: 'Textiles & Apparel',
    name_ta: 'ஜவுளி & ஆடை உற்பத்தி',
    icon: 'Scissors',
    group: 'Fashion & Apparel',
    sort_order: 6
  },

  // 3. Food, Hospitality & Agro
  {
    id: 'cat-cater',
    name_en: 'Catering Services',
    name_ta: 'கேட்டரிங் சேவைகள்',
    icon: 'UtensilsCrossed',
    group: 'Food & Hospitality',
    sort_order: 7
  },
  {
    id: 'cat-agro',
    name_en: 'Food & Agro-Processing',
    name_ta: 'உணவு & விவசாய பதப்படுத்துதல்',
    icon: 'Wheat',
    group: 'Food & Hospitality',
    sort_order: 8
  },
  {
    id: 'cat-groc',
    name_en: 'Groceries',
    name_ta: 'மளிகை',
    icon: 'ShoppingBag',
    group: 'Food & Hospitality',
    sort_order: 9
  },

  // 4. Home & Living
  {
    id: 'cat-appl',
    name_en: 'Home Appliances',
    name_ta: 'வீட்டு உபயோக பொருட்கள்',
    icon: 'Refrigerator',
    group: 'Home & Living',
    sort_order: 10
  },
  {
    id: 'cat-furn',
    name_en: 'Furniture',
    name_ta: 'மரச்சாமான்கள்',
    icon: 'Armchair',
    group: 'Home & Living',
    sort_order: 11
  },

  // 5. Construction, Rentals & Industrial
  {
    id: 'cat-rentals',
    name_en: 'Tools Rentals',
    name_ta: 'கருவிகள் வாடகை',
    icon: 'Hammer',
    group: 'Construction & Industry',
    sort_order: 12
  },
  {
    id: 'cat-const',
    name_en: 'Construction Materials',
    name_ta: 'கட்டுமான பொருட்கள்',
    icon: 'HardHat',
    group: 'Construction & Industry',
    sort_order: 13
  },
  {
    id: 'cat-hard',
    name_en: 'Hardware',
    name_ta: 'வன்பொருட்கள்',
    icon: 'Wrench',
    group: 'Construction & Industry',
    sort_order: 14
  },
  {
    id: 'cat-chem',
    name_en: 'Chemicals',
    name_ta: 'இரசாயன பொருட்கள்',
    icon: 'FlaskConical',
    group: 'Construction & Industry',
    sort_order: 15
  }
];

export const INITIAL_LOCALITIES: Locality[] = [
  { id: 'loc-anna', name: 'Anna Nagar', pincode: '625020' },
  { id: 'loc-kk', name: 'KK Nagar', pincode: '625020' },
  { id: 'loc-simm', name: 'Simmakkal', pincode: '625001' },
  { id: 'loc-gori', name: 'Goripalayam', pincode: '625002' },
  { id: 'loc-temple', name: 'Meenakshi Amman Temple Area', pincode: '625001' },
  { id: 'loc-mattu', name: 'Mattuthavani', pincode: '625007' },
  { id: 'loc-ss', name: 'SS Colony', pincode: '625016' },
  { id: 'loc-south', name: 'South Gate', pincode: '625001' }
];

export const INITIAL_SHOPS: Shop[] = [
  // 1. Clothing
  {
    id: 'shop-1',
    owner_id: 'vendor-1',
    name: 'Meenakshi Silks & Sarees',
    category_id: 'cat-cloth',
    locality_id: 'loc-simm',
    address: '45, West Tower Street, Simmakkal, Madurai',
    phone: '+919842101234',
    whatsapp: '919842101234',
    logo_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    timings: '9:30 AM - 9:30 PM (All 7 Days)',
    status: 'approved',
    is_verified: true,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  // 2. Electronics
  {
    id: 'shop-2',
    owner_id: 'vendor-2',
    name: 'Madurai Tech Zone & Mobiles',
    category_id: 'cat-elec',
    locality_id: 'loc-anna',
    address: '12, 80 Feet Road, Near Apollo Hospital, Anna Nagar, Madurai',
    phone: '+919842234567',
    whatsapp: '919842234567',
    logo_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80',
    timings: '10:00 AM - 10:00 PM',
    status: 'approved',
    is_verified: true,
    created_at: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  // 3. Home Appliances
  {
    id: 'shop-3',
    owner_id: 'vendor-3',
    name: 'Pandian Home Appliances',
    category_id: 'cat-appl',
    locality_id: 'loc-kk',
    address: '78, Rajaji Street, KK Nagar Arch, Madurai',
    phone: '+919842345678',
    whatsapp: '919842345678',
    logo_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80',
    timings: '9:00 AM - 9:00 PM',
    status: 'approved',
    is_verified: true,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  // 4. Groceries
  {
    id: 'shop-4',
    owner_id: 'vendor-4',
    name: 'Nadar Maligai Superstore',
    category_id: 'cat-groc',
    locality_id: 'loc-gori',
    address: '15, Alagar Kovil Main Road, Goripalayam, Madurai',
    phone: '+919842456789',
    whatsapp: '919842456789',
    logo_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop&q=80',
    timings: '8:00 AM - 10:00 PM',
    status: 'approved',
    is_verified: true,
    created_at: new Date(Date.now() - 18 * 86400000).toISOString()
  },
  // 5. Furniture
  {
    id: 'shop-5',
    owner_id: 'vendor-5',
    name: 'Vaigai Teak & Home Furniture',
    category_id: 'cat-furn',
    locality_id: 'loc-mattu',
    address: '102, Ring Road Junction, Mattuthavani, Madurai',
    phone: '+919842567890',
    whatsapp: '919842567890',
    logo_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80',
    timings: '10:00 AM - 8:30 PM',
    status: 'approved',
    is_verified: true,
    created_at: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  // 6. Hardware
  {
    id: 'shop-6',
    owner_id: 'vendor-6',
    name: 'Madura Power Tools & Hardware',
    category_id: 'cat-hard',
    locality_id: 'loc-south',
    address: '23, South Masi Street, South Gate, Madurai',
    phone: '+919842678901',
    whatsapp: '919842678901',
    logo_url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
    timings: '9:00 AM - 8:00 PM',
    status: 'approved',
    is_verified: true,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  // 7. Women Boutiques (Within Clothing)
  {
    id: 'shop-7',
    owner_id: 'vendor-7',
    name: 'Ananya Designer Boutique & Bridal Studio',
    category_id: 'cat-boutique',
    locality_id: 'loc-anna',
    address: '24, Kuruvikaran Salai, Anna Nagar, Madurai',
    phone: '+919842711223',
    whatsapp: '919842711223',
    logo_url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    timings: '10:00 AM - 9:00 PM',
    status: 'approved',
    is_verified: true,
    created_at: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  // 8. Kids Wear (Within Clothing)
  {
    id: 'shop-8',
    owner_id: 'vendor-8',
    name: 'Little Chutties Kids Fashion & Toys',
    category_id: 'cat-kids',
    locality_id: 'loc-kk',
    address: '56, Lake View Road, KK Nagar, Madurai',
    phone: '+919842822334',
    whatsapp: '919842822334',
    logo_url: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80',
    timings: '9:30 AM - 9:30 PM',
    status: 'approved',
    is_verified: true,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  // 9. Catering Services
  {
    id: 'shop-9',
    owner_id: 'vendor-9',
    name: 'Madurai Meenakshi Grand Catering Services',
    category_id: 'cat-cater',
    locality_id: 'loc-gori',
    address: '88, Tamukkam Road, Goripalayam, Madurai',
    phone: '+919842933445',
    whatsapp: '919842933445',
    logo_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
    timings: '7:00 AM - 10:00 PM (Direct Counter & Bookings)',
    status: 'approved',
    is_verified: true,
    created_at: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  // 10. Gift Shops
  {
    id: 'shop-10',
    owner_id: 'vendor-10',
    name: 'Madurai Royal Gifts, Toys & Custom Frames',
    category_id: 'cat-gift',
    locality_id: 'loc-temple',
    address: '18, East Chithirai Street, Temple Tower Gate, Madurai',
    phone: '+919842144556',
    whatsapp: '919842144556',
    logo_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80',
    timings: '9:00 AM - 10:00 PM',
    status: 'approved',
    is_verified: true,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  // 11. Tools Rentals
  {
    id: 'shop-11',
    owner_id: 'vendor-11',
    name: 'Vaigai Power Tools & Scaffolding Rentals',
    category_id: 'cat-rentals',
    locality_id: 'loc-mattu',
    address: '145, Melur Main Road, Mattuthavani, Madurai',
    phone: '+919842255667',
    whatsapp: '919842255667',
    logo_url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80',
    timings: '8:00 AM - 8:30 PM',
    status: 'approved',
    is_verified: true,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  // 12. Construction Materials
  {
    id: 'shop-12',
    owner_id: 'vendor-12',
    name: 'Pandian Steels, Cement & Construction Materials',
    category_id: 'cat-const',
    locality_id: 'loc-south',
    address: '67, South Veli Street, South Gate, Madurai',
    phone: '+919842366778',
    whatsapp: '919842366778',
    logo_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    timings: '8:30 AM - 8:00 PM',
    status: 'approved',
    is_verified: true,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  // 13. Chemicals
  {
    id: 'shop-13',
    owner_id: 'vendor-13',
    name: 'Madura Industrial Chemicals & Solvents',
    category_id: 'cat-chem',
    locality_id: 'loc-simm',
    address: '31, North Veli Street, Simmakkal, Madurai',
    phone: '+919842477889',
    whatsapp: '919842477889',
    logo_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&auto=format&fit=crop&q=80',
    timings: '9:30 AM - 7:30 PM',
    status: 'approved',
    is_verified: true,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  // 14. Textiles & Apparel
  {
    id: 'shop-14',
    owner_id: 'vendor-14',
    name: 'Madura Tex Loom Fabrics & Uniforms',
    category_id: 'cat-textile',
    locality_id: 'loc-simm',
    address: '102, Vakil New Street, Simmakkal, Madurai',
    phone: '+919842588990',
    whatsapp: '919842588990',
    logo_url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
    timings: '9:00 AM - 8:30 PM',
    status: 'approved',
    is_verified: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  // 15. Food & Agro-Processing
  {
    id: 'shop-15',
    owner_id: 'vendor-15',
    name: 'Alagar Agro Mills & Cold-Pressed Spices',
    category_id: 'cat-agro',
    locality_id: 'loc-gori',
    address: '42, Vaigai Vadakarai, Goripalayam, Madurai',
    phone: '+919842699001',
    whatsapp: '919842699001',
    logo_url: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    timings: '8:00 AM - 9:00 PM',
    status: 'approved',
    is_verified: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    shop_id: 'shop-1',
    category_id: 'cat-cloth',
    name: 'Pure Kanchipuram Silk Saree',
    description: 'Traditional bridal silk saree with rich pure zari pallu and contrasting blouse piece',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-2',
    shop_id: 'shop-2',
    category_id: 'cat-elec',
    name: 'OnePlus Nord CE 4 5G',
    description: 'Snapdragon 7 Gen 3, 100W SuperVOOC fast charging, 120Hz AMOLED display',
    image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-3',
    shop_id: 'shop-3',
    category_id: 'cat-appl',
    name: 'Samsung 4K Crystal UHD Smart TV',
    description: 'Ultra HD 4K, HDR10+, Dynamic Crystal Color, Motion Xcelerator with voice remote',
    image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-4',
    shop_id: 'shop-4',
    category_id: 'cat-groc',
    name: 'Premium Traditional Ponni Rice Bag',
    description: 'Aged sortex clean first quality Ponni boiled rice, sweet aroma and non-sticky',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-5',
    shop_id: 'shop-5',
    category_id: 'cat-furn',
    name: 'Solid Teak Wood 6-Seater Dining Set',
    description: 'Crafted from pure Indian teakwood with tempered glass top and cushioned chairs',
    image_url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-6',
    shop_id: 'shop-6',
    category_id: 'cat-hard',
    name: 'Bosch Heavy Duty Impact Drill Kit',
    description: '550W rotary hammer with 100-piece accessory toolbox for home and professional use',
    image_url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-7',
    shop_id: 'shop-7',
    category_id: 'cat-boutique',
    name: 'Handcrafted Bridal Aari Work Blouse',
    description: 'Custom neckline embroidery with antique beads, stones, and zardozi work in Anna Nagar',
    image_url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-8',
    shop_id: 'shop-8',
    category_id: 'cat-kids',
    name: 'Traditional Pure Silk Pattu Pavadai Set',
    description: 'Pure soft silk with gold zari border, breathable cotton lining for baby and kids',
    image_url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-9',
    shop_id: 'shop-9',
    category_id: 'cat-cater',
    name: 'Royal Madurai Traditional Banana Leaf Feast',
    description: 'Authentic 24-item traditional wedding lunch with Kari Kuzhambu, Seeraga Samba Biryani & Payasam',
    image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-10',
    shop_id: 'shop-10',
    category_id: 'cat-gift',
    name: 'Customized Glowing LED 3D Acrylic Photo Frame',
    description: 'High-definition laser engraved acrylic portrait with warm ambient LED wooden base',
    image_url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-11',
    shop_id: 'shop-11',
    category_id: 'cat-rentals',
    name: '16kg Heavy Duty Demolition Jackhammer',
    description: 'Commercial concrete breaker with bull point and flat chisel bits for rent per day',
    image_url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-12',
    shop_id: 'shop-12',
    category_id: 'cat-const',
    name: 'Primary Fe 550D TMT Steel Rebars',
    description: 'Corrosion resistant high-ductility earthquake safe reinforcement steel with test certificate',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-13',
    shop_id: 'shop-13',
    category_id: 'cat-chem',
    name: 'Industrial Multi-Surface Degreaser & Solvent',
    description: 'High-power emulsifier for textile looms, auto garages, and floor maintenance',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-14',
    shop_id: 'shop-14',
    category_id: 'cat-textile',
    name: 'Premium 60s Count Combed Cotton Fabric',
    description: 'Soft breathable 100% natural cotton for hospital uniforms, school uniforms, and formal shirts',
    image_url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-15',
    shop_id: 'shop-15',
    category_id: 'cat-agro',
    name: 'Wood Cold-Pressed Gingelly & Groundnut Oil Tin',
    description: 'Traditional Mara Chekku unrefined pure sesame cooking oil extracted from local harvest',
    image_url: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_VARIANTS: Variant[] = [
  { id: 'var-1', product_id: 'prod-1', label: 'Royal Maroon & Gold Zari', price: 9499, in_stock: true },
  { id: 'var-2', product_id: 'prod-1', label: 'Temple Peacock Green', price: 11999, in_stock: true },
  { id: 'var-3', product_id: 'prod-2', label: '8GB RAM + 128GB (Celadon)', price: 23999, in_stock: true },
  { id: 'var-4', product_id: 'prod-2', label: '8GB RAM + 256GB (Chrome)', price: 26999, in_stock: true },
  { id: 'var-5', product_id: 'prod-3', label: '43 inch 4K Ultra HD', price: 29990, in_stock: true },
  { id: 'var-6', product_id: 'prod-3', label: '55 inch 4K Ultra HD', price: 42990, in_stock: true },
  { id: 'var-7', product_id: 'prod-4', label: '10 kg Pack', price: 680, in_stock: true },
  { id: 'var-8', product_id: 'prod-4', label: '25 kg Family Bag', price: 1499, in_stock: true },
  { id: 'var-9', product_id: 'prod-5', label: '4-Seater Compact Teak', price: 24500, in_stock: true },
  { id: 'var-10', product_id: 'prod-5', label: '6-Seater Royal Teak + Cushion', price: 31850, in_stock: true },
  { id: 'var-11', product_id: 'prod-6', label: 'Standard 550W Drill Kit', price: 3640, in_stock: true },
  { id: 'var-12', product_id: 'prod-7', label: 'Raw Silk Heavy Zardozi', price: 6500, in_stock: true },
  { id: 'var-13', product_id: 'prod-7', label: 'Velvet Bridal Maggam Work', price: 8200, in_stock: true },
  { id: 'var-14', product_id: 'prod-8', label: 'Size 1-3 Years (Yellow / Green)', price: 1299, in_stock: true },
  { id: 'var-15', product_id: 'prod-8', label: 'Size 4-8 Years (Pink / Gold)', price: 1599, in_stock: true },
  { id: 'var-16', product_id: 'prod-9', label: 'Deluxe Veg Feast (Per Plate)', price: 260, in_stock: true },
  { id: 'var-17', product_id: 'prod-9', label: 'Grand Royal Non-Veg Banquet (Per Plate)', price: 320, in_stock: true },
  { id: 'var-18', product_id: 'prod-10', label: '8 x 6 inch Desk Acrylic', price: 699, in_stock: true },
  { id: 'var-19', product_id: 'prod-10', label: '12 x 8 inch Wall Hanging', price: 1199, in_stock: true },
  { id: 'var-20', product_id: 'prod-11', label: '1 Day Rental with 2 Bits', price: 750, in_stock: true },
  { id: 'var-21', product_id: 'prod-11', label: '3 Days Project Rental', price: 1950, in_stock: true },
  { id: 'var-22', product_id: 'prod-12', label: '10mm TMT Rebars (Per Ton)', price: 56500, in_stock: true },
  { id: 'var-23', product_id: 'prod-12', label: '12mm TMT Rebars (Per Ton)', price: 56200, in_stock: true },
  { id: 'var-24', product_id: 'prod-13', label: '25 Litre Can', price: 1850, in_stock: true },
  { id: 'var-25', product_id: 'prod-13', label: '50 Litre Industrial Drum', price: 3400, in_stock: true },
  { id: 'var-26', product_id: 'prod-14', label: 'Thaan 30 Meters (Per Meter)', price: 140, in_stock: true },
  { id: 'var-27', product_id: 'prod-14', label: 'Full 100m Roll (Per Meter)', price: 125, in_stock: true },
  { id: 'var-28', product_id: 'prod-15', label: '1 Litre Cold Pressed Gingelly Bottle', price: 360, in_stock: true },
  { id: 'var-29', product_id: 'prod-15', label: '5 Litre Traditional Farm Can', price: 1650, in_stock: true }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'off-1',
    shop_id: 'shop-1',
    product_id: 'prod-1',
    title: 'Grand Wedding Silk Saree Festival - 40% Off!',
    description: 'Direct weaver special in Madurai Simmakkal! Flat 40% off on bridal silk sarees. Free matching silk stole on every purchase.',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    old_price: 15999,
    offer_price: 9499,
    discount_pct: 40,
    coupon_code: 'SGL-4821',
    starts_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    ends_at: new Date(Date.now() + 3600000 * 72).toISOString(),
    is_active: true,
    is_featured: true
  },
  {
    id: 'off-2',
    shop_id: 'shop-2',
    product_id: 'prod-2',
    title: 'OnePlus 5G Mega Launch Offer + Free Earbuds',
    description: 'Get flat ₹4,000 instant discount on OnePlus Nord CE 4 with free wireless earphones and scratch guard in Anna Nagar.',
    image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    old_price: 27999,
    offer_price: 23999,
    discount_pct: 14,
    coupon_code: 'SGL-9102',
    starts_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    ends_at: new Date(Date.now() + 3600000 * 20).toISOString(),
    is_active: true,
    is_featured: true
  },
  {
    id: 'off-3',
    shop_id: 'shop-3',
    product_id: 'prod-3',
    title: 'Samsung 55" 4K Smart TV - Flash Weekend Sale',
    description: 'Stunning 4K resolution. Free wall mounting bracket and 3-year extended panel warranty when you quote SAGALA code at counter.',
    image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
    old_price: 59990,
    offer_price: 42990,
    discount_pct: 28,
    coupon_code: 'SGL-3341',
    starts_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    ends_at: new Date(Date.now() + 3600000 * 14).toISOString(),
    is_active: true,
    is_featured: true
  },
  {
    id: 'off-7',
    shop_id: 'shop-7',
    product_id: 'prod-7',
    title: 'Bridal Aari Work Blouses & Lehengas - Flat 25% Off',
    description: 'Custom bridal designer blouse stitching with high-end antique stone and thread embroidery in Anna Nagar. 3-day fast delivery.',
    image_url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&auto=format&fit=crop&q=80',
    old_price: 8660,
    offer_price: 6500,
    discount_pct: 25,
    coupon_code: 'SGL-1402',
    starts_at: new Date(Date.now() - 3600000 * 10).toISOString(),
    ends_at: new Date(Date.now() + 3600000 * 48).toISOString(),
    is_active: true,
    is_featured: false
  },
  {
    id: 'off-8',
    shop_id: 'shop-8',
    product_id: 'prod-8',
    title: 'Kids Festive Pattu Pavadai & Dhoti Sets - 35% Off',
    description: 'Dress your little prince and princess for temple festivals. Breathable soft pure silk collection in KK Nagar with free matching hair bows.',
    image_url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80',
    old_price: 1999,
    offer_price: 1299,
    discount_pct: 35,
    coupon_code: 'SGL-7711',
    starts_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    ends_at: new Date(Date.now() + 3600000 * 36).toISOString(),
    is_active: true,
    is_featured: false
  },
  {
    id: 'off-9',
    shop_id: 'shop-9',
    product_id: 'prod-9',
    title: 'Grand Wedding & Reception Feast - Save ₹50 per Plate',
    description: 'Direct Madurai authentic banquet catering! 24-dish traditional lunch or grand dinner buffet. Free welcome drink stalls for bookings above 300 pax.',
    image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80',
    old_price: 370,
    offer_price: 320,
    discount_pct: 14,
    coupon_code: 'SGL-6621',
    starts_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    ends_at: new Date(Date.now() + 3600000 * 120).toISOString(),
    is_active: true,
    is_featured: false
  },
  {
    id: 'off-10',
    shop_id: 'shop-10',
    product_id: 'prod-10',
    title: 'Custom Acrylic LED Photo Frames & Keepsakes - 30% Off',
    description: 'Transform wedding or family photos into glowing laser-cut LED night frames. Ready in 2 hours near Meenakshi Amman Temple.',
    image_url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80',
    old_price: 999,
    offer_price: 699,
    discount_pct: 30,
    coupon_code: 'SGL-5589',
    starts_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    ends_at: new Date(Date.now() + 3600000 * 60).toISOString(),
    is_active: true,
    is_featured: false
  },
  {
    id: 'off-11',
    shop_id: 'shop-11',
    product_id: 'prod-11',
    title: 'Demolition Hammer & Scaffolding Daily Rental - 20% Off',
    description: 'Contractors special in Mattuthavani. Heavy concrete breakers, core drills, generators, and steel scaffolding pipes at low daily rates.',
    image_url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80',
    old_price: 950,
    offer_price: 750,
    discount_pct: 20,
    coupon_code: 'SGL-2245',
    starts_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    ends_at: new Date(Date.now() + 3600000 * 72).toISOString(),
    is_active: true,
    is_featured: false
  },
  {
    id: 'off-12',
    shop_id: 'shop-12',
    product_id: 'prod-12',
    title: 'Fe 550D TMT Steel Rebars - Flat ₹2,000 Off per Ton',
    description: 'Primary steel mill dispatch to building sites across Madurai. Free trailer unloading for 5 tons and above. South Gate yard.',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    old_price: 58500,
    offer_price: 56500,
    discount_pct: 4,
    coupon_code: 'SGL-3388',
    starts_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    ends_at: new Date(Date.now() + 3600000 * 96).toISOString(),
    is_active: true,
    is_featured: false
  },
  {
    id: 'off-13',
    shop_id: 'shop-13',
    product_id: 'prod-13',
    title: 'Textile Processing Dyes & Industrial Solvents - 15% Off',
    description: 'High purity vat dyes, scouring agents, and commercial cleaning degreasers in Simmakkal. Direct chemical distributor discount.',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    old_price: 4000,
    offer_price: 3400,
    discount_pct: 15,
    coupon_code: 'SGL-9931',
    starts_at: new Date(Date.now() - 3600000 * 14).toISOString(),
    ends_at: new Date(Date.now() + 3600000 * 120).toISOString(),
    is_active: true,
    is_featured: false
  },
  {
    id: 'off-14',
    shop_id: 'shop-14',
    product_id: 'prod-14',
    title: '100% Cotton Uniform & Shirting Fabrics - Mill Clearance 30% Off',
    description: 'Direct loom price for schools, hospitals, and garment makers. Heavy grade combed cotton in vibrant fast colors in Simmakkal.',
    image_url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&auto=format&fit=crop&q=80',
    old_price: 200,
    offer_price: 140,
    discount_pct: 30,
    coupon_code: 'SGL-4470',
    starts_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    ends_at: new Date(Date.now() + 3600000 * 80).toISOString(),
    is_active: true,
    is_featured: false
  },
  {
    id: 'off-15',
    shop_id: 'shop-15',
    product_id: 'prod-15',
    title: 'Cold-Pressed Mara Chekku Gingelly Oil 5L Tin - Save ₹250',
    description: 'Pure traditional stone-pressed sesame oil prepared from dry Alagar farm sesame seeds. Chemical free and aroma rich in Goripalayam.',
    image_url: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&auto=format&fit=crop&q=80',
    old_price: 1900,
    offer_price: 1650,
    discount_pct: 13,
    coupon_code: 'SGL-8833',
    starts_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    ends_at: new Date(Date.now() + 3600000 * 48).toISOString(),
    is_active: true,
    is_featured: false
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 'sale-1',
    offer_id: 'off-1',
    shop_id: 'shop-1',
    coupon_code: 'SGL-4821',
    amount: 9499,
    confirmed_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'sale-2',
    offer_id: 'off-2',
    shop_id: 'shop-2',
    coupon_code: 'SGL-9102',
    amount: 23999,
    confirmed_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'sale-3',
    offer_id: 'off-3',
    shop_id: 'shop-3',
    coupon_code: 'SGL-3341',
    amount: 42990,
    confirmed_at: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: 'sale-4',
    offer_id: 'off-7',
    shop_id: 'shop-7',
    coupon_code: 'SGL-1402',
    amount: 6500,
    confirmed_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'sale-5',
    offer_id: 'off-9',
    shop_id: 'shop-9',
    coupon_code: 'SGL-6621',
    amount: 64000,
    confirmed_at: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

export const INITIAL_EVENTS: AnalyticsEvent[] = [
  { id: 'ev-1', event_type: 'offer_view', offer_id: 'off-1', shop_id: 'shop-1', session_id: 'sess-1', created_at: new Date(Date.now() - 3600000 * 4).toISOString() },
  { id: 'ev-2', event_type: 'offer_view', offer_id: 'off-1', shop_id: 'shop-1', session_id: 'sess-2', created_at: new Date(Date.now() - 3600000 * 3).toISOString() },
  { id: 'ev-3', event_type: 'whatsapp_tap', offer_id: 'off-1', shop_id: 'shop-1', session_id: 'sess-2', created_at: new Date(Date.now() - 3600000 * 3).toISOString() },
  { id: 'ev-4', event_type: 'offer_view', offer_id: 'off-2', shop_id: 'shop-2', session_id: 'sess-3', created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'ev-5', event_type: 'call_tap', offer_id: 'off-2', shop_id: 'shop-2', session_id: 'sess-3', created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'ev-6', event_type: 'directions_tap', offer_id: 'off-3', shop_id: 'shop-3', session_id: 'sess-4', created_at: new Date(Date.now() - 3600000 * 1).toISOString() },
  { id: 'ev-7', event_type: 'shop_view', shop_id: 'shop-7', session_id: 'sess-5', created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'ev-8', event_type: 'call_tap', offer_id: 'off-7', shop_id: 'shop-7', session_id: 'sess-5', created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'ev-9', event_type: 'whatsapp_tap', offer_id: 'off-9', shop_id: 'shop-9', session_id: 'sess-6', created_at: new Date(Date.now() - 3600000 * 5).toISOString() }
];
