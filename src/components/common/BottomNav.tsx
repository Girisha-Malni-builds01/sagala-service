import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Home, Grid, Search, Heart, User, Store, Shield } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  const { role, activeTab, setActiveTab, favourites, setSelectedShopId } = useApp();

  const handleNav = (tab: string) => {
    setSelectedShopId(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg pb-safe">
      <div className="max-w-md mx-auto px-2 flex justify-around items-center h-16">
        {/* Home */}
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
            activeTab === 'home' ? 'text-brand-primary scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-semibold mt-1">{t('nav.home')}</span>
        </button>

        {/* Categories */}
        <button
          onClick={() => handleNav('categories')}
          className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
            activeTab === 'categories' ? 'text-brand-primary scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Grid className={`w-5 h-5 ${activeTab === 'categories' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-semibold mt-1">{t('nav.categories')}</span>
        </button>

        {/* Search */}
        <button
          onClick={() => handleNav('search')}
          className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
            activeTab === 'search' ? 'text-brand-primary scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Search className={`w-5 h-5 ${activeTab === 'search' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-semibold mt-1">{t('nav.search')}</span>
        </button>

        {/* Favourites */}
        <button
          onClick={() => handleNav('favourites')}
          className={`relative flex flex-col items-center justify-center w-16 py-1 transition-all ${
            activeTab === 'favourites' ? 'text-brand-primary scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Heart className={`w-5 h-5 ${activeTab === 'favourites' ? 'stroke-[2.5] fill-brand-primary/20' : 'stroke-2'}`} />
          {favourites.length > 0 && (
            <span className="absolute top-1 right-3.5 w-2 h-2 rounded-full bg-brand-accent"></span>
          )}
          <span className="text-[10px] font-semibold mt-1">{t('nav.favourites')}</span>
        </button>

        {/* Role Portal (Vendor / Admin / Profile) */}
        <button
          onClick={() => {
            if (role === 'admin') handleNav('admin_dashboard');
            else if (role === 'vendor') handleNav('vendor_dashboard');
            else handleNav('profile');
          }}
          className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
            activeTab === 'profile' || activeTab === 'vendor_dashboard' || activeTab === 'admin_dashboard'
              ? 'text-brand-primary scale-105'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {role === 'admin' ? (
            <Shield className="w-5 h-5 stroke-2 text-purple-600" />
          ) : role === 'vendor' ? (
            <Store className="w-5 h-5 stroke-2 text-brand-accent" />
          ) : (
            <User className="w-5 h-5 stroke-2" />
          )}
          <span className="text-[10px] font-semibold mt-1">
            {role === 'admin' ? 'Admin' : role === 'vendor' ? 'Shop' : t('nav.profile')}
          </span>
        </button>
      </div>
    </nav>
  );
};
