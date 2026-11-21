import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Eye,
  Store,
  PhoneCall,
  MessageCircle,
  Navigation,
  Heart,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Play,
  Pause,
  Clock,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  UserPlus
} from 'lucide-react';
import { WeeklySummaryCard } from './WeeklySummaryCard';
import { MarkSaleModal } from './MarkSaleModal';
import { OfferManagerModal } from './OfferManagerModal';
import { ProductManagerModal } from './ProductManagerModal';
import { VendorSignupModal } from './VendorSignupModal';
import { formatINR, formatTimeLeft } from '../../lib/utils';
import { Offer } from '../../types';

export const VendorDashboard: React.FC = () => {
  const {
    currentVendorShopId,
    setCurrentVendorShopId,
    shops,
    offers,
    products,
    variants,
    getVendorAnalytics,
    deleteOffer,
    toggleOfferActive
  } = useApp();
  const { t } = useLanguage();

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isMarkSaleOpen, setIsMarkSaleOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const currentShop = shops.find((s) => s.id === currentVendorShopId) || shops[0];
  const analytics = getVendorAnalytics(currentShop?.id || '');
  const shopOffers = offers.filter((o) => o.shop_id === currentShop?.id);
  const shopProducts = products.filter((p) => p.shop_id === currentShop?.id);

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setIsOfferModalOpen(true);
  };

  const handleCreateNewOffer = () => {
    setEditingOffer(null);
    setIsOfferModalOpen(true);
  };

  return (
    <div className="px-4 py-3 pb-24 space-y-4">
      {/* Top Shop Selector & Status Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={currentShop?.logo_url}
            alt={currentShop?.name}
            className="w-12 h-12 rounded-xl object-cover border border-slate-100"
          />
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="font-extrabold text-sm text-brand-deep leading-tight">
                {currentShop?.name}
              </h2>
              {currentShop?.status === 'approved' ? (
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center space-x-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>Approved</span>
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center space-x-0.5">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  <span>Pending Admin</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{currentShop?.address}</p>
          </div>
        </div>

        {/* Demo Shop Switcher */}
        <div className="flex items-center space-x-1">
          <select
            value={currentShop?.id}
            onChange={(e) => setCurrentVendorShopId(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-700 focus:outline-none"
            title="Switch Vendor Shop Profile for Testing"
          >
            {shops.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.status})
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsSignupOpen(true)}
            className="p-1.5 bg-brand-light text-brand-primary rounded-lg hover:bg-blue-100"
            title="Register New Shop"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pending status warning notice if shop is pending */}
      {currentShop?.status === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Pending Admin Verification</p>
            <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
              {t('vendor.pending_notice')}
            </p>
          </div>
        </div>
      )}

      {/* Weekly Auto Summary Card */}
      <WeeklySummaryCard stats={analytics} />

      {/* Key Metric Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Offer Views */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Offer Views</span>
            <Eye className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-xl font-black text-brand-deep">{analytics.offer_views}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Impressions in feed</div>
        </div>

        {/* Shop Visits */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Shop Visits</span>
            <Store className="w-3.5 h-3.5 text-brand-accent" />
          </div>
          <div className="text-xl font-black text-brand-deep">{analytics.shop_views}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Full profile visits</div>
        </div>

        {/* Total Enquiries (Call + WhatsApp + Directions) */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Customer Leads</span>
            <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-600">{analytics.total_enquiries}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {analytics.call_taps} calls • {analytics.whatsapp_taps} wa • {analytics.directions_taps} map
          </div>
        </div>

        {/* Confirmed Sales via Coupon Code */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Confirmed Sales</span>
            <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-xl font-black text-purple-700">{analytics.confirmed_sales}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
            {formatINR(analytics.total_revenue_influenced)} influenced
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleCreateNewOffer}
          className="py-2.5 px-2 bg-brand-primary hover:bg-brand-deep active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Offer (30s)</span>
        </button>

        <button
          onClick={() => setIsProductModalOpen(true)}
          className="py-2.5 px-2 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </button>

        <button
          onClick={() => setIsMarkSaleOpen(true)}
          className="py-2.5 px-2 bg-brand-accent hover:bg-amber-600 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mark Sale</span>
        </button>
      </div>

      {/* Active & Paused Offers Section */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-sm text-brand-deep">
            Manage Offers ({shopOffers.length})
          </h3>
          <span className="text-xs text-slate-400">Under 30s Quick Control</span>
        </div>

        {shopOffers.length === 0 ? (
          <div className="p-6 text-center text-slate-400">
            <p className="text-xs mb-2">You haven't posted any offers yet.</p>
            <button
              onClick={handleCreateNewOffer}
              className="text-xs font-bold text-brand-primary hover:underline"
            >
              Post your first offer now
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {shopOffers.map((offer) => {
              const timeLeft = formatTimeLeft(offer.ends_at);
              return (
                <div
                  key={offer.id}
                  className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex flex-col space-y-2"
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={offer.image_url}
                      alt={offer.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-white"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            offer.is_active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {offer.is_active ? 'Active' : 'Paused'}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center space-x-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{timeLeft.label}</span>
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 truncate mt-0.5">
                        {offer.title}
                      </h4>
                      <div className="flex items-baseline space-x-1.5 mt-0.5">
                        <span className="font-extrabold text-xs text-brand-deep">
                          {formatINR(offer.offer_price)}
                        </span>
                        {offer.old_price && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {formatINR(offer.old_price)}
                          </span>
                        )}
                        <span className="font-mono text-[10px] font-bold text-brand-accent bg-amber-50 px-1 rounded border border-amber-200">
                          {offer.coupon_code}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Controls */}
                  <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-200/60">
                    <button
                      onClick={() => toggleOfferActive(offer.id)}
                      className={`text-xs font-semibold px-2 py-1 rounded flex items-center space-x-1 ${
                        offer.is_active
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      {offer.is_active ? (
                        <>
                          <Pause className="w-3 h-3" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          <span>Activate</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleEditOffer(offer)}
                      className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded flex items-center space-x-1 hover:bg-slate-100"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => deleteOffer(offer.id)}
                      className="text-xs font-semibold text-rose-600 bg-white border border-rose-200 px-2 py-1 rounded flex items-center space-x-1 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Shop Products Section */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-sm text-brand-deep">
            Catalog Products ({shopProducts.length})
          </h3>
          <button
            onClick={() => setIsProductModalOpen(true)}
            className="text-xs font-bold text-brand-primary flex items-center space-x-0.5 hover:underline"
          >
            <Plus className="w-3 h-3" />
            <span>Add Item</span>
          </button>
        </div>

        {shopProducts.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No products listed yet.</p>
        ) : (
          <div className="space-y-2">
            {shopProducts.map((p) => {
              const pVariants = variants.filter((v) => v.product_id === p.id);
              return (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover bg-white"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">{p.name}</h4>
                      <p className="text-[10px] text-slate-500">
                        {pVariants.length} {pVariants.length === 1 ? 'variety' : 'varieties'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-deep">
                    {pVariants.length > 0
                      ? formatINR(Math.min(...pVariants.map((v) => v.price)))
                      : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <OfferManagerModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        offerToEdit={editingOffer}
      />
      <ProductManagerModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />
      <MarkSaleModal
        isOpen={isMarkSaleOpen}
        onClose={() => setIsMarkSaleOpen(false)}
      />
      <VendorSignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />
    </div>
  );
};
