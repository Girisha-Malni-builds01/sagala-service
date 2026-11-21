import React from 'react';
import { Shop } from '../../types';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Clock, CheckCircle2, Heart, ArrowRight } from 'lucide-react';
import { trackEvent } from '../../lib/eventTracker';

interface ShopCardProps {
  shop: Shop;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  const { setSelectedShopId, setActiveTab, localities, offers, isFavourite, toggleFavourite } = useApp();
  const { t } = useLanguage();

  const locality = localities.find((l) => l.id === shop.locality_id);
  const activeOffers = offers.filter((o) => o.shop_id === shop.id && o.is_active);
  const isFav = isFavourite(shop.id);

  const handleOpenShop = () => {
    trackEvent({
      eventType: 'shop_view',
      shopId: shop.id
    });
    setSelectedShopId(shop.id);
    setActiveTab('shop_detail');
  };

  return (
    <div
      onClick={handleOpenShop}
      className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-soft transition-all duration-200 overflow-hidden cursor-pointer mb-3 group"
    >
      {/* Banner */}
      <div className="relative aspect-[21/9] overflow-hidden bg-slate-100">
        <img
          src={shop.banner_url}
          alt={shop.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Favourite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavourite(shop.id);
          }}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm text-slate-600 transition-colors shadow-sm"
        >
          <Heart
            className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`}
          />
        </button>

        {/* Locality badge on banner */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-1 text-white text-xs font-bold drop-shadow">
          <MapPin className="w-3.5 h-3.5 text-brand-accent" />
          <span>{locality?.name || 'Madurai'}</span>
        </div>
      </div>

      {/* Info Row */}
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={shop.logo_url}
            alt={shop.name}
            className="w-11 h-11 rounded-xl object-cover border border-slate-100 shadow-xs"
          />
          <div>
            <h4 className="font-bold text-xs text-brand-deep flex items-center space-x-1">
              <span>{shop.name}</span>
              {shop.is_verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
            </h4>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{shop.timings.split('(')[0]}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full mb-1">
            {activeOffers.length} {activeOffers.length === 1 ? 'Offer' : 'Offers'}
          </span>
          <span className="text-[11px] font-bold text-brand-primary flex items-center space-x-0.5">
            <span>{t('action.view_shop')}</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
