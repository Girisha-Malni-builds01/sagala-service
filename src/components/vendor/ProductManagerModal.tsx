import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, PackagePlus, Upload } from 'lucide-react';
import { compressImage } from '../../lib/imageCompressor';

interface ProductManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TempVariant {
  label: string;
  price: string;
  in_stock: boolean;
}

export const ProductManagerModal: React.FC<ProductManagerModalProps> = ({ isOpen, onClose }) => {
  const { currentVendorShopId, addProduct, categories, shops } = useApp();

  const currentShop = shops.find((s) => s.id === currentVendorShopId);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(currentShop?.category_id || categories[0]?.id || '');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
  );
  const [variants, setVariants] = useState<TempVariant[]>([
    { label: 'Standard', price: '999', in_stock: true }
  ]);
  const [isCompressing, setIsCompressing] = useState(false);

  if (!isOpen) return null;

  const handleAddVariantRow = () => {
    setVariants((prev) => [...prev, { label: '', price: '', in_stock: true }]);
  };

  const handleRemoveVariantRow = (index: number) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: keyof TempVariant, value: any) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressing(true);
      const compressed = await compressImage(file, 200 * 1024);
      setImageUrl(compressed);
    } catch (err) {
      console.error('Image compression failed', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedVariants = variants
      .filter((v) => v.label.trim() && v.price)
      .map((v) => ({
        label: v.label.trim(),
        price: parseFloat(v.price) || 0,
        in_stock: v.in_stock
      }));

    if (formattedVariants.length === 0) {
      formattedVariants.push({ label: 'Regular', price: 0, in_stock: true });
    }

    addProduct(
      {
        shop_id: currentVendorShopId,
        category_id: categoryId,
        name: name.trim(),
        description: description.trim(),
        image_url: imageUrl
      },
      formattedVariants
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-extrabold text-brand-deep flex items-center space-x-1.5">
              <PackagePlus className="w-4 h-4 text-brand-primary" />
              <span>Add Shop Product</span>
            </h3>
            <p className="text-xs text-slate-500">List items with varieties & stock availability</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Samsung 55 inch Crystal 4K Smart TV"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
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
              <label className="block font-bold text-slate-700 mb-1">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief model details / warranty..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          {/* Product Image */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Product Image</label>
            <div className="flex items-center space-x-3">
              <img
                src={imageUrl}
                alt="Product"
                className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200"
              />
              <label className="flex-1 border-2 border-dashed border-slate-300 rounded-xl p-2.5 flex items-center justify-center space-x-2 cursor-pointer hover:border-brand-primary">
                <Upload className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-600">
                  {isCompressing ? 'Compressing...' : 'Upload Picture (<200KB)'}
                </span>
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

          {/* Varieties & Pricing Editor */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Product Varieties (Size / Colour / Model)
              </span>
              <button
                type="button"
                onClick={handleAddVariantRow}
                className="text-[11px] font-bold text-brand-primary flex items-center space-x-0.5 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variety</span>
              </button>
            </div>

            <div className="space-y-2">
              {variants.map((variant, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    required
                    value={variant.label}
                    onChange={(e) => handleVariantChange(index, 'label', e.target.value)}
                    placeholder="e.g. 55 inch or Red / XL"
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  />
                  <div className="flex items-center space-x-1 w-24">
                    <span className="text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min="0"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                      placeholder="Price"
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-brand-deep focus:outline-none"
                    />
                  </div>
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={variant.in_stock}
                      onChange={(e) => handleVariantChange(index, 'in_stock', e.target.checked)}
                      className="rounded text-brand-primary"
                    />
                    <span className="text-[10px] text-slate-600 font-medium">In Stock</span>
                  </label>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariantRow(index)}
                      className="p-1 text-slate-300 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-brand-primary hover:bg-brand-deep active:scale-95 text-white font-extrabold text-sm rounded-xl shadow-md transition-all"
            >
              Save Product & Varieties
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
