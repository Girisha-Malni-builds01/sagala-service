import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { formatINR } from '../../lib/utils';
import confetti from 'canvas-confetti';

interface MarkSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarkSaleModal: React.FC<MarkSaleModalProps> = ({ isOpen, onClose }) => {
  const { markSale, currentVendorShopId, offers } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [amount, setAmount] = useState('');
  const [resultMessage, setResultMessage] = useState<{ success: boolean; text: string } | null>(null);

  if (!isOpen) return null;

  const currentShopOffers = offers.filter((o) => o.shop_id === currentVendorShopId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const res = markSale(couponCode, parseFloat(amount) || 0);
    setResultMessage({ success: res.success, text: res.message });

    if (res.success) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        onClose();
        setCouponCode('');
        setAmount('');
        setResultMessage(null);
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 overflow-hidden animate-in slide-in-from-bottom duration-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base font-extrabold text-brand-deep flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-brand-accent" />
              <span>Mark Confirmed Sale</span>
            </h3>
            <p className="text-xs text-slate-500">
              Enter customer's SAGALA coupon code at checkout
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Banner */}
        {resultMessage && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs font-semibold flex items-center space-x-2 ${
              resultMessage.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {resultMessage.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{resultMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Customer Coupon Code (e.g. SGL-4821) *
            </label>
            <input
              type="text"
              required
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="SGL-XXXX"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-base tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Sale Bill Amount (Optional, ₹)
            </label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 9499 (Defaults to offer price)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Quick Click Coupons from this shop */}
          {currentShopOffers.length > 0 && (
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Active shop coupon codes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentShopOffers.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      setCouponCode(o.coupon_code);
                      setAmount(o.offer_price.toString());
                    }}
                    className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-brand-primary hover:border-brand-primary"
                  >
                    {o.coupon_code} ({formatINR(o.offer_price)})
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-brand-primary hover:bg-brand-deep active:scale-95 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-1"
            >
              <span>Confirm & Record Sale</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
