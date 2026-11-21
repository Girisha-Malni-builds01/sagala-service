import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Offer } from '../../types';
import { X, Upload, Zap } from 'lucide-react';
import { compressImage } from '../../lib/imageCompressor';

interface OfferManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerToEdit?: Offer | null;
}

export const OfferManagerModal: React.FC<OfferManagerModalProps> = ({
  isOpen,
  onClose,
  offerToEdit
}) => {
  const { currentVendorShopId, addOffer, updateOffer, products } = useApp();

  const [title, setTitle] = useState(offerToEdit?.title || '');
  const [description, setDescription] = useState(offerToEdit?.description || '');
  const [productId, setProductId] = useState(offerToEdit?.product_id || '');
  const [imageUrl, setImageUrl] = useState(
    offerToEdit?.image_url ||
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80'
  );
  const [oldPrice, setOldPrice] = useState(offerToEdit?.old_price?.toString() || '');
  const [offerPrice, setOfferPrice] = useState(offerToEdit?.offer_price?.toString() || '');
  const [discountPct, setDiscountPct] = useState(offerToEdit?.discount_pct?.toString() || '');
  const [durationDays, setDurationDays] = useState('3');
  const [isCompressing, setIsCompressing] = useState(false);

  if (!isOpen) return null;

  const shopProducts = products.filter((p) => p.shop_id === currentVendorShopId);

  // Auto-calculate discount % when prices change
  const handleOfferPriceChange = (val: string) => {
    setOfferPrice(val);
    const op = parseFloat(oldPrice);
    const np = parseFloat(val);
    if (op && np && op > np) {
      const pct = Math.round(((op - np) / op) * 100);
      setDiscountPct(pct.toString());
    }
  };

  const handleOldPriceChange = (val: string) => {
    setOldPrice(val);
    const op = parseFloat(val);
    const np = parseFloat(offerPrice);
    if (op && np && op > np) {
      const pct = Math.round(((op - np) / op) * 100);
      setDiscountPct(pct.toString());
    }
  };

  // Image Upload with client-side canvas compression (<200KB)
  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressing(true);
      const compressedDataUrl = await compressImage(file, 200 * 1024);
      setImageUrl(compressedDataUrl);
    } catch (err) {
      console.error('Image compression failed', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !offerPrice) return;

    const days = parseInt(durationDays, 10) || 3;
    const endsAt = new Date(Date.now() + days * 24 * 3600 * 1000).toISOString();

    if (offerToEdit) {
      updateOffer(offerToEdit.id, {
        title,
        description,
        product_id: productId || undefined,
        image_url: imageUrl,
        old_price: oldPrice ? parseFloat(oldPrice) : undefined,
        offer_price: parseFloat(offerPrice),
        discount_pct: discountPct ? parseInt(discountPct, 10) : undefined,
        ends_at: endsAt
      });
    } else {
      addOffer({
        shop_id: currentVendorShopId,
        product_id: productId || undefined,
        title,
        description,
        image_url: imageUrl,
        old_price: oldPrice ? parseFloat(oldPrice) : undefined,
        offer_price: parseFloat(offerPrice),
        discount_pct: discountPct ? parseInt(discountPct, 10) : undefined,
        starts_at: new Date().toISOString(),
        ends_at: endsAt,
        is_active: true,
        is_featured: false
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-extrabold text-brand-deep flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-brand-accent fill-brand-accent" />
              <span>{offerToEdit ? 'Edit Offer' : 'Create Offer in 30 Seconds'}</span>
            </h3>
            <p className="text-xs text-slate-500">Publish live deals directly to Madurai feed</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs">
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Offer Title * (Short & Catchy)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Festival Special: Flat 30% Off on Silk Sarees!"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Old Price (₹)</label>
              <input
                type="number"
                value={oldPrice}
                onChange={(e) => handleOldPriceChange(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block font-bold text-brand-deep mb-1">Offer Price (₹) *</label>
              <input
                type="number"
                required
                value={offerPrice}
                onChange={(e) => handleOfferPriceChange(e.target.value)}
                placeholder="e.g. 9999"
                className="w-full px-3 py-2 rounded-xl border border-brand-primary font-bold text-brand-deep focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">% Off</label>
              <input
                type="number"
                value={discountPct}
                onChange={(e) => setDiscountPct(e.target.value)}
                placeholder="e.g. 33"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          {/* Validity Duration */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Validity Duration</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '24 Hours', val: '1' },
                { label: '3 Days', val: '3' },
                { label: '7 Days', val: '7' },
                { label: '14 Days', val: '14' }
              ].map((dur) => (
                <button
                  key={dur.val}
                  type="button"
                  onClick={() => setDurationDays(dur.val)}
                  className={`py-2 rounded-xl font-bold transition-all text-[11px] ${
                    durationDays === dur.val
                      ? 'bg-brand-primary text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dur.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Linked Product */}
          {shopProducts.length > 0 && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Link to Shop Product (Optional)
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="">-- No Specific Product --</option>
                {shopProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Image & Client Compression */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Offer Banner Image (Auto-compressed &lt; 200 KB)
            </label>
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <label className="flex-1 border-2 border-dashed border-slate-300 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary transition-colors">
                <Upload className="w-4 h-4 text-slate-400 mb-1" />
                <span className="font-semibold text-slate-600">
                  {isCompressing ? 'Compressing Image...' : 'Upload Image from Phone'}
                </span>
                <span className="text-[10px] text-slate-400">JPEG/PNG auto-resized under 200 KB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="hidden"
                  disabled={isCompressing}
                />
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Offer Terms / Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Include details like free gift on purchase, store timings, or stock conditions..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isCompressing}
              className="w-full py-3 bg-brand-primary hover:bg-brand-deep active:scale-95 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-1"
            >
              <span>{offerToEdit ? 'Save Changes' : '🚀 Publish Offer Live'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
