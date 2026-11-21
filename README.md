# 🛍️ SAGALA SERVICE — Madurai Hyperlocal Offers Platform

> **Live Hyperlocal Offers, Shop Profiles & Price Comparison for Madurai, Tamil Nadu**  
> 100% Free Tier Architecture · Mobile-First Installable PWA · Real-Time Merchant Feed · Zero Paid APIs

---

## 📱 Executive Summary

**SAGALA SERVICE** connects local shoppers with brick-and-mortar merchants across Madurai (Anna Nagar, KK Nagar, Simmakkal, Goripalayam, Meenakshi Amman Temple Area, Mattuthavani, SS Colony, South Gate). 

- **For Customers**: Browse live, influencer-style deals without logging in, view shop addresses and timings, compare product prices & varieties side-by-side, copy counter coupon codes, and contact shops directly via Phone Call, WhatsApp, or Google Maps directions.
- **For Shop Vendors**: Post and manage offers in under 30 seconds from a phone, list products with multiple varieties (size, colour, model), track shop visits and customer enquiries, and enter coupon codes in "Mark Sale" to measure confirmed revenue and sales boost.
- **For SAGALA Admin**: Verify and approve merchant applications, toggle pinned featured offers, manage categories and localities dynamically without code changes, view live visitor engagement charts, and export CSV performance reports.

---

## 🏗️ Project Architecture & Folder Structure

```
sagala-service/
├── .env.example                     # Environment template (Supabase credentials)
├── index.html                       # Mobile-first PWA HTML entry point & font loader
├── package.json                     # Vite, React, Tailwind, Supabase, Recharts, Lucide, Canvas-Confetti
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Brand color system (#1D4ED8, #0B2A6F, #EAF2FF, #FF8A00)
├── tsconfig.json                    # TypeScript compiler configuration
├── vite.config.ts                   # Vite bundler + PWA manifest & Workbox precache config
│
├── public/                          # Static assets & PWA manifest icons
│   ├── favicon.ico                  # 32x32 Favicon
│   ├── apple-touch-icon.png         # 180x180 iOS Home Screen icon
│   ├── pwa-192x192.png              # 192x192 Android Web App icon
│   ├── pwa-512x512.png              # 512x512 Splash & store icon
│   └── logo.svg                     # SAGALA Shield & Offer Tag Brand Mark
│
├── schema.sql                       # Complete PostgreSQL schema, views, RLS & seed data
├── supabase/
│   └── schema.sql                   # Supabase migration file
│
├── src/
│   ├── main.tsx                     # React application bootstrap
│   ├── App.tsx                      # Root component with layout and view orchestration
│   ├── index.css                    # Tailwind CSS directives & mobile safe-area utilities
│   ├── vite-env.d.ts                # Vite environment types
│   │
│   ├── types/
│   │   └── index.ts                 # Shop, Offer, Product, Variant, Event, Sale, Profile types
│   │
│   ├── data/
│   │   └── seedData.ts              # 12+ Madurai seed shops, 6 categories, 8 localities, offers, sales
│   │
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client with graceful demo/fallback mode
│   │   ├── eventTracker.ts          # First-party tracking (rate-limited, session-based)
│   │   ├── imageCompressor.ts       # Client-side canvas compression (<200 KB)
│   │   └── utils.ts                 # Currency (INR), countdown timers, WhatsApp & Maps URL builders
│   │
│   ├── context/
│   │   ├── LanguageContext.tsx      # Bilingual dictionary (English & தமிழ்)
│   │   └── AppContext.tsx           # Global state, real-time sync, filter management
│   │
│   └── components/
│       ├── common/
│       │   ├── Header.tsx           # Brand header, Madurai city pin, EN/தமிழ் toggle, Role switcher
│       │   ├── BottomNav.tsx        # Bottom navigation (Home, Categories, Search, Favourites, Profile)
│       │   ├── SearchModal.tsx      # Multi-facet search (category, Madurai area, ending soon, discount)
│       │   ├── ProductCompareModal.tsx # Side-by-side comparison for up to 3 products
│       │   ├── PrivacyNote.tsx      # Transparent first-party analytics disclosure
│       │   └── PwaInstallPrompt.tsx # Smart 1-tap install banner for Android & iOS
│       │
│       ├── customer/
│       │   ├── StoriesStrip.tsx     # "Fresh Today" shop story avatars
│       │   ├── CategoryGrid.tsx     # Category cards with icons and offer counts
│       │   ├── OfferCard.tsx        # Vertical offer card with timer, coupon copy, call/WA/directions
│       │   ├── ShopCard.tsx         # Shop directory cards with verified badge
│       │   ├── ShopDetailView.tsx   # Shop page with banner, address, products & varieties
│       │   ├── CustomerHomeFeed.tsx # Live offers feed with filter chips (All, Trending, Ending Soon)
│       │   ├── FavouritesView.tsx   # Saved merchant bookmarker
│       │   └── ProfileView.tsx      # Customer preferences, phone login, vendor registration
│       │
│       ├── vendor/
│       │   ├── VendorDashboard.tsx  # Metrics, offer controls (pause/edit/delete), product catalog
│       │   ├── WeeklySummaryCard.tsx# "Your offers brought X views and Y enquiries this week"
│       │   ├── OfferManagerModal.tsx# Sub-30 second offer creator with image compressor
│       │   ├── ProductManagerModal.tsx # Product catalog creator with multi-variety editor
│       │   ├── MarkSaleModal.tsx    # "Mark Sale" coupon validator & revenue logger
│       │   └── VendorSignupModal.tsx# Shop owner onboarding form (Status = Pending)
│       │
│       └── admin/
│           ├── AdminDashboard.tsx   # Platform analytics, active visitors, Recharts trends
│           ├── CategoryLocalityManager.tsx # Dynamic category and locality editor
│           └── CsvExportModal.tsx   # 1-Click CSV export for merchant sales boost report
│
└── docs/
    ├── SETUP_GUIDE.md               # Step-by-step non-expert Supabase & deployment guide
    ├── PWA_INSTALLATION_GUIDE.md    # Instructions for installing PWA on Android & iOS
    ├── VENDOR_ONBOARDING_GUIDE.md   # 1-Page merchant operational handbook
    ├── ADMIN_OPERATIONS_GUIDE.md    # Admin approval and analytics guide
    └── PHASE_2_ROADMAP.md           # Future expansion architecture
```

---

## ⚡ Quickstart (Running Locally in Under 1 Minute)

The app comes with an **automatic zero-setup Prototype Mode** pre-loaded with realistic Madurai shops and offers. You can run and evaluate all 3 user roles immediately without needing any external database or API key:

```bash
# 1. Clone repository
git clone https://github.com/your-username/sagala-service.git
cd sagala-service

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

- Use the **Role Switcher** in the top navigation bar to test as **Customer**, **Shop Vendor**, or **SAGALA Admin**.
- Toggle between **English** and **தமிழ்** using the language pill button.
- Click **Compare** on products to test the 3-way side-by-side comparison.
- In Vendor mode, click **Mark Sale** and test code `SGL-4821` to verify the sales boost confirmation engine.
- In Admin mode, approve pending shops, edit categories, and download the full merchant CSV report.

---

## 🌐 Deploying to Production (100% Free Hosting)

### Deploying to Cloudflare Pages:
1. Push your repository to GitHub.
2. In Cloudflare Dashboard, navigate to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Set **Build command**: `npm run build`
4. Set **Build output directory**: `dist`
5. Click **Save and Deploy**. Done!

### Deploying to Vercel:
1. Import your GitHub repository in the Vercel dashboard.
2. Framework preset will automatically detect **Vite**.
3. Click **Deploy**. Done!
