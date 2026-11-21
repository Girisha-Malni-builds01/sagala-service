import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Header
    'brand.name': 'SAGALA SERVICE',
    'brand.tagline': 'Madurai Hyperlocal Offers',
    'city.madurai': 'Madurai, TN',
    'live.feed': 'LIVE OFFERS',

    // Nav
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.search': 'Search',
    'nav.favourites': 'Favourites',
    'nav.profile': 'Profile',
    'nav.compare': 'Compare',

    // Customer Feed
    'feed.stories.title': 'Fresh Today',
    'feed.tab.all': 'All Offers',
    'feed.tab.trending': '🔥 Trending',
    'feed.tab.ending_soon': '⏳ Ending Soon',
    'feed.badge.featured': 'FEATURED',
    'feed.badge.ending_soon': 'ENDING SOON',
    'feed.badge.off': 'OFF',
    'feed.show_coupon': 'Use Code at Counter',
    'feed.copy_code': 'Tap to Copy Code',
    'feed.code_copied': 'Coupon Code Copied!',
    'feed.empty': 'No active offers found for this filter.',

    // Actions
    'action.call': 'Call Shop',
    'action.whatsapp': 'WhatsApp',
    'action.directions': 'Directions',
    'action.share': 'Share',
    'action.compare': 'Compare',
    'action.compared': 'Added to Compare',
    'action.view_shop': 'Visit Shop',
    'action.save_fav': 'Favourite',
    'action.saved_fav': 'Saved',

    // Shop Page
    'shop.timings': 'Timings',
    'shop.address': 'Address',
    'shop.verified': 'Verified Partner',
    'shop.products': 'Products & Varieties',
    'shop.active_offers': 'Active Offers',
    'shop.in_stock': 'In Stock',
    'shop.out_of_stock': 'Out of Stock',
    'shop.starting_from': 'Starting from',

    // Vendor
    'vendor.dashboard': 'Vendor Dashboard',
    'vendor.offer_views': 'Offer Views',
    'vendor.shop_visits': 'Shop Visits',
    'vendor.enquiries': 'Total Enquiries',
    'vendor.confirmed_sales': 'Confirmed Sales',
    'vendor.influenced_rev': 'Sales Influenced',
    'vendor.create_offer': '+ Create Offer (30s)',
    'vendor.add_product': '+ Add Product',
    'vendor.mark_sale': 'Mark Confirmed Sale',
    'vendor.weekly_summary': 'Weekly Performance Summary',
    'vendor.pending_notice': 'Your shop profile is under admin verification. Offers will go live upon approval.',

    // Admin
    'admin.dashboard': 'SAGALA Admin Console',
    'admin.visitors': 'Total Visitors',
    'admin.active_shops': 'Active Shops',
    'admin.pending_shops': 'Pending Approvals',
    'admin.live_offers': 'Live Offers',
    'admin.export_csv': 'Export CSV Report',
    'admin.manage_cats': 'Manage Categories',
    'admin.manage_locs': 'Manage Localities',
    'admin.approve': 'Approve',
    'admin.reject': 'Reject',
    'admin.suspend': 'Suspend',
    'admin.pin_featured': 'Pin to Top',

    // Privacy
    'privacy.title': '100% Private & Transparent',
    'privacy.text': 'SAGALA SERVICE uses anonymous session IDs with zero third-party tracking or trackers. We only measure honest shop visits and coupon redemptions to help Madurai businesses grow.'
  },
  ta: {
    // Brand & Header
    'brand.name': 'சகலா சர்வீஸ்',
    'brand.tagline': 'மதுரை நேரடி சலுகைகள்',
    'city.madurai': 'மதுரை, தமிழ்நாடு',
    'live.feed': 'நேரலை சலுகைகள்',

    // Nav
    'nav.home': 'முகப்பு',
    'nav.categories': 'பிரிவுகள்',
    'nav.search': 'தேடல்',
    'nav.favourites': 'விருப்பங்கள்',
    'nav.profile': 'சுயவிவரம்',
    'nav.compare': 'ஒப்பீடு',

    // Customer Feed
    'feed.stories.title': 'இன்றைய புதிய சலுகைகள்',
    'feed.tab.all': 'அனைத்து சலுகைகள்',
    'feed.tab.trending': '🔥 டிரெண்டிங்',
    'feed.tab.ending_soon': '⏳ விரைவில் முடியும்',
    'feed.badge.featured': 'சிறப்பு சலுகை',
    'feed.badge.ending_soon': 'விரைவில் முடியும்',
    'feed.badge.off': 'தள்ளுபடி',
    'feed.show_coupon': 'பில்லில் இந்த கூப்பனை காட்டவும்',
    'feed.copy_code': 'கூப்பன் குறியீட்டை நகலெடு',
    'feed.code_copied': 'கூப்பன் நகலெடுக்கப்பட்டது!',
    'feed.empty': 'இந்த பிரிவில் சலுகைகள் எதுவும் இல்லை.',

    // Actions
    'action.call': 'அழைக்க',
    'action.whatsapp': 'வாட்ஸ்அப்',
    'action.directions': 'வழித்தடம்',
    'action.share': 'பகிர்க',
    'action.compare': 'ஒப்பிடுக',
    'action.compared': 'ஒப்பீட்டில் சேர்க்கப்பட்டது',
    'action.view_shop': 'கடைக்கு செல்ல',
    'action.save_fav': 'விருப்பம்',
    'action.saved_fav': 'சேமிக்கப்பட்டது',

    // Shop Page
    'shop.timings': 'நேரம்',
    'shop.address': 'முகவரி',
    'shop.verified': 'சரிபார்க்கப்பட்ட கடை',
    'shop.products': 'பொருட்கள் & வகைகள்',
    'shop.active_offers': 'நடப்பு சலுகைகள்',
    'shop.in_stock': 'இருப்பில் உள்ளது',
    'shop.out_of_stock': 'இருப்பில் இல்லை',
    'shop.starting_from': 'ஆரம்ப விலை',

    // Vendor
    'vendor.dashboard': 'விற்பனையாளர் பலகை',
    'vendor.offer_views': 'சலுகை பார்வைகள்',
    'vendor.shop_visits': 'கடை வருகைகள்',
    'vendor.enquiries': 'மொத்த விசாரணைகள்',
    'vendor.confirmed_sales': 'உறுதிசெய்த விற்பனை',
    'vendor.influenced_rev': 'விற்பனை வருவாய்',
    'vendor.create_offer': '+ புதிய சலுகை (30 நொடி)',
    'vendor.add_product': '+ புதிய பொருள்',
    'vendor.mark_sale': 'விற்பனையை உறுதிசெய்',
    'vendor.weekly_summary': 'வாராந்திர செயல்பாடு சுருக்கம்',
    'vendor.pending_notice': 'உங்கள் கடை நிர்வாகி சரிபார்ப்பில் உள்ளது. ஒப்புதலுக்கு பின் நேரலையில் வரும்.',

    // Admin
    'admin.dashboard': 'நிர்வாக பலகை',
    'admin.visitors': 'பார்வையாளர்கள்',
    'admin.active_shops': 'செயலில் உள்ள கடைகள்',
    'admin.pending_shops': 'ஒப்புதல் நிலுவை',
    'admin.live_offers': 'நேரலை சலுகைகள்',
    'admin.export_csv': 'CSV அறிக்கை பதிவிறக்கு',
    'admin.manage_cats': 'பிரிவுகள் மேலாண்மை',
    'admin.manage_locs': 'பகுதிகள் மேலாண்மை',
    'admin.approve': 'ஒப்புதல்',
    'admin.reject': 'நிராகரி',
    'admin.suspend': 'முடக்கு',
    'admin.pin_featured': 'முதன்மை சலுகையாக்கு',

    // Privacy
    'privacy.title': '100% பாதுகாப்பானது & வெளிப்படையானது',
    'privacy.text': 'சகலா சர்வீஸ் எந்த தனிப்பட்ட தகவல்களையும் சேகரிப்பதில்லை. மதுரை கடை உரிமையாளர்களின் வளர்ச்சிக்காக மட்டுமே நேரடி தொடர்புகள் மற்றும் கூப்பன்கள் கணக்கிடப்படுகின்றன.'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('sagala_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sagala_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
