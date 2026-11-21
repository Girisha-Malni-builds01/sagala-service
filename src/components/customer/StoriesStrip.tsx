import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { trackEvent } from '../../lib/eventTracker';

export const StoriesStrip: React.FC = () => {
  const { shops, offers, setSelectedShopId, setActiveTab } = useApp();
  const { t } = useLanguage();

  // Find shops that have fresh active offers created within the last 24 hours
  const activeApprovedShops = shops.filter((s) => s.status === 'approved');

  const handleOpenStory = (shopId: string) => {
    trackEvent({
      eventType: 'shop_view',
      shopId
    });
    setSelectedShopId(shopId);
    setActiveTab('shop_detail');
  };

  return (
    <div className="bg-white border-b border-slate-100 py-3 px-4">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-1.5 text-xs font-extrabold text-brand-deep">
          <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-bounce" />
          <span>{t('feed.stories.title')}</span>
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
            Today
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Madurai Shops</span>
      </div>

      {/* Horizontal Story Avatar Scroll */}
      <div className="flex space-x-3.5 overflow-x-auto no-scrollbar py-1">
        {activeApprovedShops.map((shop) => {
          const shopOffers = offers.filter((o) => o.shop_id === shop.id && o.is_active);
          const hasHotOffers = shopOffers.length > 0;

          return (
            <button
              key={shop.id}
              onClick={() => handleOpenStory(shop.id)}
              className="flex flex-col items-center flex-shrink-0 group focus:outline-none"
            >
              <div
                className={`w-14 h-14 rounded-full p-[2.5px] transition-transform active:scale-95 group-hover:scale-105 shadow-sm ${
                  hasHotOffers
                    ? 'bg-gradient-to-tr from-brand-accent via-amber-400 to-brand-primary'
                    : 'bg-slate-200'
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white relative">
                  <img
                    src={shop.logo_url}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                  {shop.is_verified && (
                    <span className="absolute bottom-0 right-0 bg-brand-primary rounded-full text-white p-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 mt-1 max-w-[62px] truncate text-center">
                {shop.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
