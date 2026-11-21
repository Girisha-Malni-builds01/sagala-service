import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, Edit2, Check, X, Tag, MapPin } from 'lucide-react';
import { Category, Locality } from '../../types';

export const CategoryLocalityManager: React.FC = () => {
  const { categories, addCategory, deleteCategory, localities, addLocality, deleteLocality } = useApp();

  const [activeTab, setActiveTab] = useState<'categories' | 'localities'>('categories');

  // Category form state
  const [catNameEn, setCatNameEn] = useState('');
  const [catNameTa, setCatNameTa] = useState('');
  const [catIcon, setCatIcon] = useState('Tag');

  // Locality form state
  const [locName, setLocName] = useState('');
  const [locPincode, setLocPincode] = useState('625001');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameEn.trim() || !catNameTa.trim()) return;

    addCategory({
      name_en: catNameEn.trim(),
      name_ta: catNameTa.trim(),
      icon: catIcon.trim() || 'Tag',
      sort_order: categories.length + 1
    });

    setCatNameEn('');
    setCatNameTa('');
    setCatIcon('Tag');
  };

  const handleAddLocality = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locName.trim()) return;

    addLocality({
      name: locName.trim(),
      pincode: locPincode.trim() || '625001'
    });

    setLocName('');
    setLocPincode('625001');
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-extrabold text-sm text-brand-deep">
          Admin Taxonomy Manager (No Code Changes)
        </h3>
        <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'categories' ? 'bg-white text-brand-primary shadow-xs' : 'text-slate-500'
            }`}
          >
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('localities')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'localities' ? 'bg-white text-brand-primary shadow-xs' : 'text-slate-500'
            }`}
          >
            Madurai Localities ({localities.length})
          </button>
        </div>
      </div>

      {activeTab === 'categories' ? (
        <div className="space-y-3">
          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <input
              type="text"
              required
              placeholder="English Name (e.g. Footwear)"
              value={catNameEn}
              onChange={(e) => setCatNameEn(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            />
            <input
              type="text"
              required
              placeholder="Tamil Name (e.g. காலணிகள்)"
              value={catNameTa}
              onChange={(e) => setCatNameTa(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            />
            <input
              type="text"
              placeholder="Lucide Icon (e.g. ShoppingBag)"
              value={catIcon}
              onChange={(e) => setCatIcon(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            />
            <button
              type="submit"
              className="py-1.5 bg-brand-primary hover:bg-brand-deep text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </form>

          {/* Categories List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map((cat: Category) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-800">{cat.name_en}</div>
                  <div className="text-[10px] text-slate-500">{cat.name_ta}</div>
                </div>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="p-1 text-slate-300 hover:text-rose-500"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Add Locality Form */}
          <form onSubmit={handleAddLocality} className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <input
              type="text"
              required
              placeholder="Madurai Locality (e.g. Othakadai)"
              value={locName}
              onChange={(e) => setLocName(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            />
            <input
              type="text"
              placeholder="Pincode (e.g. 625107)"
              value={locPincode}
              onChange={(e) => setLocPincode(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            />
            <button
              type="submit"
              className="py-1.5 bg-brand-primary hover:bg-brand-deep text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Locality</span>
            </button>
          </form>

          {/* Localities List */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {localities.map((loc: Locality) => (
              <div
                key={loc.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-800">{loc.name}</div>
                  <div className="text-[10px] text-slate-500">{loc.pincode}</div>
                </div>
                <button
                  onClick={() => deleteLocality(loc.id)}
                  className="p-1 text-slate-300 hover:text-rose-500"
                  title="Delete locality"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
