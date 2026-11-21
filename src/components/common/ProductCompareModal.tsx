import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, Phone, MessageCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { formatINR, getGoogleMapsUrl, getShopWhatsAppDirectUrl } from '../../lib/utils';
import { trackEvent } from '../../lib/eventTracker';

export const ProductCompareModal: React.FC = () => {
  const { compareProducts, removeFromCompare, clearCompare, isCompareOpen, setIsCompareOpen, shops, offers } = useApp();
  const { t } = useLanguage();

  if (!isCompareOpen || compareProducts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-brand-deep flex items-center space-x-2">
              <span>Compare Products ({compareProducts.length}/3)</span>
            </h3>
            <p className="text-xs text-slate-500">Compare prices, varieties and shop offers in Madurai</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearCompare}
              className="text-xs text-rose-500 font-semibold px-2 py-1 rounded hover:bg-rose-50"
            >
              Clear
            </button>
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Side-by-side Table / Cards */}
        <div className="p-4 overflow-x-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 min-w-[340px]">
            {compareProducts.map((product) => {
              const shop = shops.find((s) => s.id === product.shop_id);
              const relatedOffer = offers.find((o) => o.product_id === product.id && o.is_active);
              const minPrice = product.variants && product.variants.length > 0
                ? Math.min(...product.variants.map((v) => v.price))
                : relatedOffer ? relatedOffer.offer_price : 0;

              return (
                <div
                  key={product.id}
                  className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Remove button */}
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-brand-primary">
                        {shop?.name}
                      </span>
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="p-1 text-slate-400 hover:text-rose-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Image */}
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-white mb-2">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {relatedOffer && (
                        <span className="absolute top-1 left-1 bg-brand-accent text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                          {relatedOffer.discount_pct}% OFF
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-2 mb-1">
                      {product.name}
                    </h4>

                    {/* Price */}
                    <div className="mb-3">
                      <div className="text-base font-extrabold text-brand-deep">
                        {formatINR(minPrice)}
                      </div>
                      {relatedOffer?.old_price && (
                        <div className="text-[11px] text-slate-400 line-through">
                          {formatINR(relatedOffer.old_price)}
                        </div>
                      )}
                    </div>

                    {/* Varieties */}
                    <div className="mb-3 border-t border-slate-200/80 pt-2">
                      <div className="text-[11px] font-semibold text-slate-600 mb-1">Varieties & Prices:</div>
                      <div className="space-y-1">
                        {product.variants?.map((v) => (
                          <div key={v.id} className="text-[11px] flex justify-between bg-white px-2 py-1 rounded border border-slate-100">
                            <span className="truncate pr-1 text-slate-700">{v.label}</span>
                            <span className="font-bold text-brand-primary">{formatINR(v.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active Offer Details */}
                    {relatedOffer && (
                      <div className="mb-3 p-2 rounded-xl bg-amber-50 border border-amber-200/70 text-[11px]">
                        <div className="font-bold text-amber-900 line-clamp-1">{relatedOffer.title}</div>
                        <div className="text-amber-700 text-[10px] mt-0.5 font-mono">
                          Coupon: {relatedOffer.coupon_code}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact Shop CTA */}
                  {shop && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-200">
                      <a
                        href={`tel:${shop.phone}`}
                        onClick={() => trackEvent({ eventType: 'call_tap', shopId: shop.id, productId: product.id })}
                        className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center space-x-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                      <a
                        href={getShopWhatsAppDirectUrl(shop.whatsapp, product.name)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackEvent({ eventType: 'whatsapp_tap', shopId: shop.id, productId: product.id })}
                        className="w-full py-1.5 rounded-lg bg-brand-primary hover:bg-brand-deep text-white text-xs font-bold flex items-center justify-center space-x-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
