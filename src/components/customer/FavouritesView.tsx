import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Heart, Store, ArrowRight } from 'lucide-react';
import { ShopCard } from './ShopCard';

export const FavouritesView: React.FC = () => {
  const { shops, favourites, setActiveTab } = useApp();
  const { t } = useLanguage();

  const favShops = shops.filter((s) => favourites.includes(s.id));

  return (
    <div className="px-4 py-3 pb-24">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
          <Heart className="w-4 h-4 fill-rose-500" />
        </div>
        <div>
          <h2 className="font-extrabold text-sm text-brand-deep leading-tight">
            Saved Favourite Shops
          </h2>
          <p className="text-[11px] text-slate-400">
            {favShops.length} {favShops.length === 1 ? 'shop' : 'shops'} saved for quick access
          </p>
        </div>
      </div>

      {favShops.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100 shadow-card">
          <Heart className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
          <h4 className="font-bold text-xs text-slate-700 mb-1">No Favourite Shops Yet</h4>
          <p className="text-[11px] text-slate-400 mb-4 max-w-xs mx-auto">
            Tap the heart icon on any shop in Madurai to save it here for fast one-tap calls and deals.
          </p>
          <button
            onClick={() => setActiveTab('home')}
            className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-brand-deep transition-all"
          >
            Explore Madurai Offers
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {favShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
};
