import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Search, X, MapPin, Tag, Clock, ArrowRight } from 'lucide-react';
import { OfferCard } from '../customer/OfferCard';

export const SearchModal: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterLocality,
    setFilterLocality,
    filterMinDiscount,
    setFilterMinDiscount,
    filterFeed,
    setFilterFeed,
    categories,
    localities,
    offers,
    shops,
    products
  } = useApp();
  const { language } = useLanguage();

  // Filter offers matching query and chips
  const filteredOffers = offers.filter((offer) => {
    if (!offer.is_active) return false;

    const shop = shops.find((s) => s.id === offer.shop_id);
    const product = offer.product_id ? products.find((p) => p.id === offer.product_id) : null;

    // Search text match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = offer.title.toLowerCase().includes(q);
      const matchDesc = offer.description?.toLowerCase().includes(q);
      const matchShop = shop?.name.toLowerCase().includes(q);
      const matchProduct = product?.name.toLowerCase().includes(q);
      const matchCoupon = offer.coupon_code.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchShop && !matchProduct && !matchCoupon) {
        return false;
      }
    }

    // Category filter
    if (filterCategory && shop?.category_id !== filterCategory) {
      return false;
    }

    // Locality filter
    if (filterLocality && shop?.locality_id !== filterLocality) {
      return false;
    }

    // Min discount filter
    if (filterMinDiscount && (offer.discount_pct || 0) < filterMinDiscount) {
      return false;
    }

    // Ending soon filter
    if (filterFeed === 'ending_soon') {
      const diffHours = (new Date(offer.ends_at).getTime() - Date.now()) / (1000 * 60 * 60);
      if (diffHours > 24) return false;
    }

    return true;
  });

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterCategory(null);
    setFilterLocality(null);
    setFilterMinDiscount(null);
    setFilterFeed('all');
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(filterCategory) ||
    Boolean(filterLocality) ||
    Boolean(filterMinDiscount) ||
    filterFeed === 'ending_soon';

  return (
    <div className="px-4 py-3 pb-24">
      {/* Search Input Bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'ta' ? 'பொருள், கடை, சலுகையை தேடுங்கள்...' : 'Search offers, products, shops, coupon...'}
          className="w-full pl-10 pr-10 py-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Chips Scroll Area */}
      <div className="space-y-2.5 mb-4 bg-white rounded-2xl p-3 border border-slate-100 shadow-card">
        {/* Localities in Madurai */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-brand-primary" />
              <span>Madurai Area</span>
            </span>
            {filterLocality && (
              <button
                onClick={() => setFilterLocality(null)}
                className="text-[10px] text-rose-500 font-semibold"
              >
                Reset
              </button>
            )}
          </div>
          <div className="flex space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            {localities.map((loc) => {
              const isSelected = filterLocality === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setFilterLocality(isSelected ? null : loc.id)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 transition-all ${
                    isSelected
                      ? 'bg-brand-primary text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {loc.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
            <span className="flex items-center space-x-1">
              <Tag className="w-3 h-3 text-brand-accent" />
              <span>Category</span>
            </span>
            {filterCategory && (
              <button
                onClick={() => setFilterCategory(null)}
                className="text-[10px] text-rose-500 font-semibold"
              >
                Reset
              </button>
            )}
          </div>
          <div className="flex space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => {
              const isSelected = filterCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(isSelected ? null : cat.id)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 transition-all ${
                    isSelected
                      ? 'bg-brand-accent text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {language === 'ta' ? cat.name_ta : cat.name_en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Discounts & Ending Soon */}
        <div>
          <div className="text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider flex items-center space-x-1">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>Discount & Urgency</span>
          </div>
          <div className="flex space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[20, 30, 40].map((disc) => {
              const isSelected = filterMinDiscount === disc;
              return (
                <button
                  key={disc}
                  onClick={() => setFilterMinDiscount(isSelected ? null : disc)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {disc}%+ Off
                </button>
              );
            })}
            <button
              onClick={() => setFilterFeed(filterFeed === 'ending_soon' ? 'all' : 'ending_soon')}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 transition-all flex items-center space-x-1 ${
                filterFeed === 'ending_soon'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>⏳ Ending &lt;24h</span>
            </button>
          </div>
        </div>

        {/* Clear All Filters */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">
              Found <strong>{filteredOffers.length}</strong> {filteredOffers.length === 1 ? 'offer' : 'offers'}
            </span>
            <button
              onClick={clearAllFilters}
              className="text-rose-600 font-bold hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Feed */}
      <div>
        <div className="text-xs font-bold text-slate-600 mb-2.5 flex items-center justify-between">
          <span>Search Results ({filteredOffers.length})</span>
        </div>

        {filteredOffers.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100 shadow-sm">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-xs font-medium text-slate-600 mb-1">No offers match your search.</p>
            <p className="text-[11px] text-slate-400">Try adjusting your locality or discount filters.</p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="mt-3 px-3 py-1.5 bg-brand-light text-brand-primary font-bold text-xs rounded-xl"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          filteredOffers.map((offer) => <OfferCard key={offer.id} offer={offer} />)
        )}
      </div>
    </div>
  );
};
