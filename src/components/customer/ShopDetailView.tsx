import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  CheckCircle2,
  Tag,
  Scale
} from 'lucide-react';
import {
  formatINR,
  getGoogleMapsUrl,
  getShopWhatsAppDirectUrl
} from '../../lib/utils';
import { OfferCard } from './OfferCard';
import { trackEvent } from '../../lib/eventTracker';

export const ShopDetailView: React.FC = () => {
  const {
    selectedShopId,
    setSelectedShopId,
    setActiveTab,
    shops,
    localities,
    categories,
    products,
    variants,
    offers,
    isFavourite,
    toggleFavourite,
    addToCompare
  } = useApp();
  const { t, language } = useLanguage();

  const [activeTab, setShopTab] = useState<'offers' | 'products'>('offers');

  const shop = shops.find((s) => s.id === selectedShopId);
  if (!shop) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Shop not found.</p>
        <button
          onClick={() => {
            setSelectedShopId(null);
            setActiveTab('home');
          }}
          className="mt-3 px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  const locality = localities.find((l) => l.id === shop.locality_id);
  const category = categories.find((c) => c.id === shop.category_id);
  const shopOffers = offers.filter((o) => o.shop_id === shop.id && o.is_active);
  const shopProducts = products.filter((p) => p.shop_id === shop.id);
  const isFav = isFavourite(shop.id);

  const handleCall = () => {
    trackEvent({ eventType: 'call_tap', shopId: shop.id });
    window.location.href = `tel:${shop.phone}`;
  };

  const handleWhatsApp = () => {
    trackEvent({ eventType: 'whatsapp_tap', shopId: shop.id });
    const url = getShopWhatsAppDirectUrl(shop.whatsapp, `Enquiry about ${shop.name}`);
    window.open(url, '_blank');
  };

  const handleDirections = () => {
    trackEvent({ eventType: 'directions_tap', shopId: shop.id });
    const url = getGoogleMapsUrl(shop.address, shop.name);
    window.open(url, '_blank');
  };

  return (
    <div className="pb-24 animate-in fade-in duration-200">
      {/* Top Banner & Header */}
      <div className="relative aspect-[16/9] w-full bg-slate-200">
        <img
          src={shop.banner_url}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30"></div>

        {/* Back and Fav buttons */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
          <button
            onClick={() => {
              setSelectedShopId(null);
              setActiveTab('home');
            }}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => toggleFavourite(shop.id)}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}`}
            />
          </button>
        </div>

        {/* Shop Logo & Title floating over banner bottom */}
        <div className="absolute -bottom-8 left-4 right-4 flex items-end space-x-3 z-10">
          <img
            src={shop.logo_url}
            alt={shop.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-lg bg-white"
          />
          <div className="pb-1 text-white drop-shadow-md">
            <h1 className="font-extrabold text-base leading-tight flex items-center space-x-1.5 text-white">
              <span>{shop.name}</span>
              {shop.is_verified && <CheckCircle2 className="w-4 h-4 text-sky-400 inline" />}
            </h1>
            <p className="text-xs text-blue-100 font-medium">
              {language === 'ta' ? category?.name_ta : category?.name_en} • {locality?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Spacing for floating logo */}
      <div className="h-10"></div>

      {/* Address & Timings Card */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card">
          <div className="flex items-start space-x-2 text-xs text-slate-700 mb-2">
            <MapPin className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{shop.address}</p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-3">
            <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p>{shop.timings}</p>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleCall}
              className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-xs flex items-center justify-center space-x-1"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call</span>
            </button>
            <button
              onClick={handleWhatsApp}
              className="py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-800 font-bold text-xs flex items-center justify-center space-x-1 border border-emerald-200/60"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleDirections}
              className="py-2 rounded-xl bg-brand-light hover:bg-blue-100 active:scale-95 text-brand-primary font-bold text-xs flex items-center justify-center space-x-1 border border-blue-200/60"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Directions</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: Active Offers vs Products & Varieties */}
      <div className="px-4 mb-3">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setShopTab('offers')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'offers'
                ? 'bg-white text-brand-primary shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('shop.active_offers')} ({shopOffers.length})
          </button>
          <button
            onClick={() => setShopTab('products')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-white text-brand-primary shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('shop.products')} ({shopProducts.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4">
        {activeTab === 'offers' ? (
          <div>
            {shopOffers.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100">
                <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No active offers right now for this shop.</p>
              </div>
            ) : (
              shopOffers.map((offer) => <OfferCard key={offer.id} offer={offer} />)
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {shopProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100">
                <p className="text-xs">No products listed yet.</p>
              </div>
            ) : (
              shopProducts.map((prod) => {
                const prodVariants = variants.filter((v) => v.product_id === prod.id);
                const minPrice =
                  prodVariants.length > 0 ? Math.min(...prodVariants.map((v) => v.price)) : 0;

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-card flex flex-col space-y-2.5"
                  >
                    <div className="flex space-x-3">
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        className="w-20 h-20 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-xs text-slate-800 leading-snug line-clamp-2">
                          {prod.name}
                        </h4>
                        {prod.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {prod.description}
                          </p>
                        )}
                        <div className="mt-1.5 flex items-baseline space-x-1">
                          <span className="text-[10px] text-slate-400">{t('shop.starting_from')}</span>
                          <span className="font-black text-sm text-brand-deep">
                            {formatINR(minPrice)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Varieties drawer / table */}
                    {prodVariants.length > 0 && (
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Varieties & Pricing
                        </div>
                        {prodVariants.map((variant) => (
                          <div
                            key={variant.id}
                            className="flex justify-between items-center text-xs py-0.5"
                          >
                            <span className="text-slate-700 font-medium">{variant.label}</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-brand-deep">
                                {formatINR(variant.price)}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                  variant.in_stock
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {variant.in_stock ? t('shop.in_stock') : t('shop.out_of_stock')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add to compare button */}
                    <button
                      onClick={() => addToCompare({ ...prod, variants: prodVariants })}
                      className="w-full py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1"
                    >
                      <Scale className="w-3.5 h-3.5 text-brand-primary" />
                      <span>{t('action.compare')} this product</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
