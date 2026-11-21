import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StoriesStrip } from './StoriesStrip';
import { CategoryGrid } from './CategoryGrid';
import { OfferCard } from './OfferCard';
import { Sparkles, Clock, TrendingUp, Filter, Tag } from 'lucide-react';
import { PrivacyNote } from '../common/PrivacyNote';

export const CustomerHomeFeed: React.FC = () => {
  const { offers, shops, filterCategory, setFilterCategory, filterFeed, setFilterFeed } = useApp();
  const { t } = useLanguage();

  // Filter and sort offers:
  // 1. Must be active
  // 2. Filter by category if selected
  // 3. Filter by tab ('all', 'trending', 'ending_soon')
  // 4. Featured offers pinned first, then newest first
  const activeOffers = offers.filter((offer) => {
    if (!offer.is_active) return false;

    // Check shop status
    const shop = shops.find((s) => s.id === offer.shop_id);
    if (!shop || shop.status !== 'approved') return false;

    // Category filter
    if (filterCategory && shop.category_id !== filterCategory) return false;

    // Ending soon tab: less than 24h remaining
    if (filterFeed === 'ending_soon') {
      const diffHours = (new Date(offer.ends_at).getTime() - Date.now()) / (1000 * 60 * 60);
      if (diffHours > 24) return false;
    }

    // Trending tab: higher discounts or featured
    if (filterFeed === 'trending') {
      return (offer.discount_pct || 0) >= 20 || offer.is_featured;
    }

    return true;
  });

  // Sort: Featured pinned to top, then newest
  const sortedOffers = [...activeOffers].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime();
  });

  return (
    <div className="pb-24">
      {/* Stories Strip: Fresh Offers Today */}
      <StoriesStrip />

      {/* Main Container */}
      <div className="px-4 py-3">
        {/* Category Grid Section */}
        <CategoryGrid />

        {/* Feed Header & Chips */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-extrabold text-sm text-brand-deep tracking-tight flex items-center space-x-1.5">
              <span>{t('live.feed')}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </h2>
            <span className="text-[11px] text-slate-400 font-semibold">
              {sortedOffers.length} {sortedOffers.length === 1 ? 'deal' : 'deals'} in Madurai
            </span>
          </div>

          {/* Chips: All, Trending, Ending Soon */}
          <div className="flex space-x-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilterFeed('all')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-1 flex-shrink-0 ${
                filterFeed === 'all'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <span>{t('feed.tab.all')}</span>
            </button>

            <button
              onClick={() => setFilterFeed('trending')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-1 flex-shrink-0 ${
                filterFeed === 'trending'
                  ? 'bg-brand-accent text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t('feed.tab.trending')}</span>
            </button>

            <button
              onClick={() => setFilterFeed('ending_soon')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-1 flex-shrink-0 ${
                filterFeed === 'ending_soon'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{t('feed.tab.ending_soon')}</span>
            </button>
          </div>
        </div>

        {/* Vertical Offers List */}
        <div>
          {sortedOffers.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100 shadow-sm">
              <Tag className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="text-xs font-semibold text-slate-600 mb-1">{t('feed.empty')}</p>
              <p className="text-[11px] text-slate-400 mb-3">
                Try selecting "All Offers" or removing category filters.
              </p>
              <button
                onClick={() => {
                  setFilterFeed('all');
                  setFilterCategory(null);
                }}
                className="px-3 py-1.5 bg-brand-light text-brand-primary font-bold text-xs rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            sortedOffers.map((offer) => <OfferCard key={offer.id} offer={offer} />)
          )}
        </div>

        {/* Privacy transparent tracking note */}
        <PrivacyNote />
      </div>
    </div>
  );
};
