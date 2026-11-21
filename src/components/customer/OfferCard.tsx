import React, { useState } from 'react';
import { Offer } from '../../types';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Phone,
  MessageCircle,
  MapPin,
  Share2,
  Clock,
  Copy,
  Check,
  Scale,
  Sparkles,
  Tag
} from 'lucide-react';
import {
  formatINR,
  formatTimeLeft,
  getGoogleMapsUrl,
  getShopWhatsAppDirectUrl,
  getWhatsAppShareUrl
} from '../../lib/utils';
import { trackEvent } from '../../lib/eventTracker';
import confetti from 'canvas-confetti';

interface OfferCardProps {
  offer: Offer;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  const { shops, localities, products, setSelectedShopId, setActiveTab, addToCompare } = useApp();
  const { t } = useLanguage();
  const [copied, setCopied] = useState<boolean>(false);

  const shop = shops.find((s) => s.id === offer.shop_id);
  const locality = shop ? localities.find((l) => l.id === shop.locality_id) : null;
  const product = offer.product_id ? products.find((p) => p.id === offer.product_id) : null;
  const timeLeft = formatTimeLeft(offer.ends_at);

  const handleCopyCoupon = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(offer.coupon_code);
    setCopied(true);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 }
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShopClick = () => {
    if (shop) {
      trackEvent({
        eventType: 'shop_view',
        shopId: shop.id,
        offerId: offer.id
      });
      setSelectedShopId(shop.id);
      setActiveTab('shop_detail');
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (shop) {
      trackEvent({
        eventType: 'call_tap',
        shopId: shop.id,
        offerId: offer.id
      });
      window.location.href = `tel:${shop.phone}`;
    }
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (shop) {
      trackEvent({
        eventType: 'whatsapp_tap',
        shopId: shop.id,
        offerId: offer.id
      });
      const url = getShopWhatsAppDirectUrl(shop.whatsapp, offer.title);
      window.open(url, '_blank');
    }
  };

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (shop) {
      trackEvent({
        eventType: 'directions_tap',
        shopId: shop.id,
        offerId: offer.id
      });
      const url = getGoogleMapsUrl(shop.address, shop.name);
      window.open(url, '_blank');
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (shop) {
      trackEvent({
        eventType: 'share',
        shopId: shop.id,
        offerId: offer.id
      });
      const url = getWhatsAppShareUrl(offer.title, shop.name, offer.coupon_code);
      window.open(url, '_blank');
    }
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-soft transition-all duration-200 overflow-hidden mb-4">
      {/* Shop Header */}
      {shop && (
        <div
          onClick={handleShopClick}
          className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-100"
        >
          <div className="flex items-center space-x-2.5">
            <img
              src={shop.logo_url}
              alt={shop.name}
              className="w-9 h-9 rounded-xl object-cover border border-slate-100"
            />
            <div>
              <h3 className="font-bold text-xs text-brand-deep tracking-tight flex items-center space-x-1">
                <span>{shop.name}</span>
              </h3>
              <div className="flex items-center text-[11px] text-slate-500 space-x-1">
                <MapPin className="w-3 h-3 text-brand-accent flex-shrink-0" />
                <span className="truncate">{locality?.name || 'Madurai'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-400 hover:text-brand-primary rounded-lg hover:bg-slate-100"
              title="Share Offer"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Offer Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 group">
        <img
          src={offer.image_url}
          alt={offer.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          {offer.discount_pct && (
            <span className="bg-brand-accent text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-md flex items-center space-x-1">
              <Tag className="w-3 h-3" />
              <span>{offer.discount_pct}% OFF</span>
            </span>
          )}
          {offer.is_featured && (
            <span className="bg-brand-primary text-white font-extrabold text-[10px] px-2 py-1 rounded-lg shadow-md flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>{t('feed.badge.featured')}</span>
            </span>
          )}
        </div>

        {/* Validity Countdown Badge */}
        <div className="absolute bottom-2.5 left-2.5">
          <span
            className={`text-[11px] font-bold px-2 py-1 rounded-lg backdrop-blur-md flex items-center space-x-1 shadow-sm ${
              timeLeft.isEndingSoon
                ? 'bg-rose-500/90 text-white animate-pulse'
                : 'bg-black/70 text-white'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{timeLeft.label}</span>
          </span>
        </div>

        {/* Compare quick button if linked to product */}
        {product && (
          <div className="absolute bottom-2.5 right-2.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCompare(product);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-brand-deep font-bold text-[11px] shadow-sm backdrop-blur-sm flex items-center space-x-1 active:scale-95 transition-all"
            >
              <Scale className="w-3 h-3 text-brand-primary" />
              <span>Compare</span>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h4 className="font-extrabold text-sm text-slate-900 leading-snug mb-1.5 line-clamp-2">
          {offer.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
          {offer.description}
        </p>

        {/* Pricing */}
        <div className="flex items-baseline space-x-2 mb-3">
          <span className="text-xl font-black text-brand-deep">
            {formatINR(offer.offer_price)}
          </span>
          {offer.old_price && (
            <span className="text-xs text-slate-400 line-through font-medium">
              {formatINR(offer.old_price)}
            </span>
          )}
          {offer.old_price && (
            <span className="text-xs font-bold text-emerald-600">
              Save {formatINR(offer.old_price - offer.offer_price)}
            </span>
          )}
        </div>

        {/* Coupon Code Section (Sales Boost Engine) */}
        <div
          onClick={handleCopyCoupon}
          className="bg-brand-light/60 hover:bg-brand-light border border-blue-200/80 rounded-xl p-2.5 mb-3 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
        >
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold text-brand-primary tracking-wider">
              Coupon Code:
            </span>
            <span className="font-mono font-black text-sm text-brand-deep tracking-wider px-1.5 py-0.5 rounded bg-white border border-blue-200">
              {offer.coupon_code}
            </span>
          </div>
          <button className="text-xs font-bold text-brand-primary flex items-center space-x-1">
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">{t('feed.code_copied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t('feed.copy_code')}</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons: Call, WhatsApp, Directions */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleCall}
            className="py-2 px-1 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs flex items-center justify-center space-x-1 transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('action.call')}</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="py-2 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-700 font-bold text-xs flex items-center justify-center space-x-1 transition-all border border-emerald-200/60"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('action.whatsapp')}</span>
          </button>

          <button
            onClick={handleDirections}
            className="py-2 px-1 rounded-xl bg-brand-light hover:bg-blue-100 active:scale-95 text-brand-primary font-bold text-xs flex items-center justify-center space-x-1 transition-all border border-blue-200/60"
          >
            <MapPin className="w-3.5 h-3.5 text-brand-primary" />
            <span>{t('action.directions')}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
