import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Store, MapPin, Phone, Clock, Upload, CheckCircle2 } from 'lucide-react';
import { compressImage } from '../../lib/imageCompressor';

interface VendorSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VendorSignupModal: React.FC<VendorSignupModalProps> = ({ isOpen, onClose }) => {
  const { registerShop, categories, localities } = useApp();

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [localityId, setLocalityId] = useState(localities[0]?.id || '');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('+91');
  const [whatsapp, setWhatsapp] = useState('');
  const [timings, setTimings] = useState('9:30 AM - 9:30 PM');
  const [logoUrl, setLogoUrl] = useState(
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&auto=format&fit=crop&q=80'
  );
  const [bannerUrl, setBannerUrl] = useState(
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80'
  );
  const [isCompressing, setIsCompressing] = useState(false);

  if (!isOpen) return null;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressing(true);
      const compressed = await compressImage(file, 200 * 1024);
      setLogoUrl(compressed);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;

    registerShop({
      name: name.trim(),
      category_id: categoryId,
      locality_id: localityId,
      address: address.trim(),
      phone: phone.trim(),
      whatsapp: (whatsapp || phone).replace(/\D/g, ''),
      logo_url: logoUrl,
      banner_url: bannerUrl,
      timings: timings.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-extrabold text-brand-deep flex items-center space-x-1.5">
              <Store className="w-4 h-4 text-brand-accent" />
              <span>Shop Owner Onboarding</span>
            </h3>
            <p className="text-xs text-slate-500">
              List your Madurai shop on SAGALA SERVICE for free
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-[11px] text-blue-900 leading-relaxed">
            📢 <strong>New shops go to 'Pending' status</strong> until SAGALA team verifies the counter address. You can immediately prepare offers and preview your shop dashboard.
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Shop Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Royal Mobiles & Electronics"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Madurai Area / Locality *</label>
              <select
                value={localityId}
                onChange={(e) => setLocalityId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                {localities.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Shop Full Address *</label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Door No, Street Name, Landmark, Madurai..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Call Phone *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+919842100000"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp Number</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Leave blank to use phone"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Shop Working Timings</label>
            <input
              type="text"
              value={timings}
              onChange={(e) => setTimings(e.target.value)}
              placeholder="e.g. 9:30 AM - 9:30 PM (All 7 Days)"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Shop Logo upload */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Shop Logo / Photo</label>
            <div className="flex items-center space-x-3">
              <img
                src={logoUrl}
                alt="Shop Logo"
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <label className="flex-1 border-2 border-dashed border-slate-300 rounded-xl p-2.5 flex items-center justify-center space-x-1.5 cursor-pointer hover:border-brand-primary">
                <Upload className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-600">
                  {isCompressing ? 'Compressing...' : 'Upload Logo (<200KB)'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={isCompressing}
                />
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-brand-primary hover:bg-brand-deep active:scale-95 text-white font-extrabold text-sm rounded-xl shadow-md transition-all"
            >
              Submit Shop Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
