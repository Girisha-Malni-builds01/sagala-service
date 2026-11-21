import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { PwaInstallPrompt } from './components/common/PwaInstallPrompt';
import { ProductCompareModal } from './components/common/ProductCompareModal';
import { CustomerHomeFeed } from './components/customer/CustomerHomeFeed';
import { ShopDetailView } from './components/customer/ShopDetailView';
import { FavouritesView } from './components/customer/FavouritesView';
import { ProfileView } from './components/customer/ProfileView';
import { SearchModal } from './components/common/SearchModal';
import { VendorDashboard } from './components/vendor/VendorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CategoryGrid } from './components/customer/CategoryGrid';
import { ShopCard } from './components/customer/ShopCard';

const MainLayout: React.FC = () => {
  const { activeTab, selectedShopId, shops, filterCategory } = useApp();

  const renderContent = () => {
    // 1. If viewing a specific shop page
    if (selectedShopId) {
      return <ShopDetailView />;
    }

    // 2. Tab-based views
    switch (activeTab) {
      case 'home':
        return <CustomerHomeFeed />;

      case 'categories':
        const displayShops = filterCategory
          ? shops.filter((s) => s.category_id === filterCategory && s.status === 'approved')
          : shops.filter((s) => s.status === 'approved');

        return (
          <div className="px-4 py-3 pb-24 space-y-3">
            <CategoryGrid />
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-extrabold text-sm text-brand-deep">
                {filterCategory ? 'Shops in Selected Category' : 'Approved Shops in Madurai'}
              </h3>
              <span className="text-xs text-slate-400 font-semibold">
                {displayShops.length} shops
              </span>
            </div>
            {displayShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        );

      case 'search':
        return <SearchModal />;

      case 'favourites':
        return <FavouritesView />;

      case 'vendor_dashboard':
        return <VendorDashboard />;

      case 'admin_dashboard':
        return <AdminDashboard />;

      case 'profile':
        return <ProfileView />;

      default:
        return <CustomerHomeFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      {/* Mobile container - centered on desktop with realistic mobile dimensions */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col border-x border-slate-200/60">
        <Header />
        <PwaInstallPrompt />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
        <BottomNav />
        <ProductCompareModal />
      </div>
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </LanguageProvider>
  );
}

export default App;
