import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Tv,
  Gift,
  Shirt,
  Sparkles,
  Baby,
  Scissors,
  UtensilsCrossed,
  Wheat,
  ShoppingBag,
  Refrigerator,
  Armchair,
  Hammer,
  HardHat,
  Wrench,
  FlaskConical,
  Grid,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Category } from '../../types';

export const CategoryGrid: React.FC = () => {
  const { categories, offers, shops, filterCategory, setFilterCategory, setActiveTab } = useApp();
  const { language } = useLanguage();

  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'tv':
        return <Tv className="w-5 h-5 text-blue-600" />;
      case 'gift':
        return <Gift className="w-5 h-5 text-pink-500" />;
      case 'shirt':
        return <Shirt className="w-5 h-5 text-rose-500" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'baby':
        return <Baby className="w-5 h-5 text-amber-500" />;
      case 'scissors':
        return <Scissors className="w-5 h-5 text-violet-600" />;
      case 'utensilscrossed':
        return <UtensilsCrossed className="w-5 h-5 text-orange-600" />;
      case 'wheat':
        return <Wheat className="w-5 h-5 text-emerald-600" />;
      case 'shoppingbag':
        return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
      case 'refrigerator':
        return <Refrigerator className="w-5 h-5 text-indigo-600" />;
      case 'armchair':
        return <Armchair className="w-5 h-5 text-amber-700" />;
      case 'hammer':
        return <Hammer className="w-5 h-5 text-blue-700" />;
      case 'hardhat':
        return <HardHat className="w-5 h-5 text-amber-600" />;
      case 'wrench':
        return <Wrench className="w-5 h-5 text-cyan-600" />;
      case 'flaskconical':
        return <FlaskConical className="w-5 h-5 text-teal-600" />;
      default:
        return <Grid className="w-5 h-5 text-slate-600" />;
    }
  };

  const handleSelectCategory = (catId: string) => {
    if (filterCategory === catId) {
      setFilterCategory(null);
    } else {
      setFilterCategory(catId);
      setActiveTab('home');
    }
  };

  // Filter categories by group
  const filteredCategories = categories.filter((cat) => {
    if (selectedGroup === 'all') return true;
    if (selectedGroup === 'fashion') {
      return ['cat-cloth', 'cat-boutique', 'cat-kids', 'cat-textile'].includes(cat.id);
    }
    if (selectedGroup === 'food') {
      return ['cat-cater', 'cat-agro', 'cat-groc'].includes(cat.id);
    }
    if (selectedGroup === 'home') {
      return ['cat-appl', 'cat-furn', 'cat-gift'].includes(cat.id);
    }
    if (selectedGroup === 'industry') {
      return ['cat-rentals', 'cat-const', 'cat-hard', 'cat-chem', 'cat-elec'].includes(cat.id);
    }
    return true;
  });

  // Display top 6 if not expanded and viewing all
  const displayedCategories =
    !isExpanded && selectedGroup === 'all'
      ? filteredCategories.slice(0, 6)
      : filteredCategories;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card mb-4">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-1.5">
          <h3 className="font-extrabold text-sm text-brand-deep tracking-tight">
            {language === 'ta' ? 'பிரிவுகள்' : 'Explore Categories'}
          </h3>
          <span className="text-[10px] bg-blue-100 text-brand-primary font-bold px-1.5 py-0.2 rounded-full">
            {categories.length}
          </span>
        </div>
        {filterCategory ? (
          <button
            onClick={() => setFilterCategory(null)}
            className="text-xs font-semibold text-rose-600 hover:underline"
          >
            Clear Filter
          </button>
        ) : (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-brand-primary flex items-center space-x-0.5 hover:underline"
          >
            <span>{isExpanded ? 'Show Less' : `View All (${categories.length})`}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Group Pills Horizontal Scroll */}
      <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-2 mb-2 border-b border-slate-100">
        {[
          { id: 'all', label: language === 'ta' ? 'அனைத்தும்' : 'All' },
          { id: 'fashion', label: language === 'ta' ? 'ஆடை & பூட்டிக்' : 'Fashion & Boutiques' },
          { id: 'food', label: language === 'ta' ? 'உணவு & கேட்டரிங்' : 'Food & Catering' },
          { id: 'home', label: language === 'ta' ? 'வீட்டு உபயோகம்' : 'Home & Living' },
          { id: 'industry', label: language === 'ta' ? 'கட்டுமானம் & வாடகை' : 'Industry & Rentals' }
        ].map((grp) => {
          const isSelected = selectedGroup === grp.id;
          return (
            <button
              key={grp.id}
              onClick={() => setSelectedGroup(grp.id)}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg flex-shrink-0 transition-all ${
                isSelected
                  ? 'bg-brand-deep text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {grp.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-3 gap-2.5">
        {displayedCategories.map((cat: Category) => {
          const isSelected = filterCategory === cat.id;
          const catOffers = offers.filter((o) => {
            const sh = shops.find((s) => s.id === o.shop_id);
            return sh?.category_id === cat.id && o.is_active;
          });

          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all active:scale-95 relative ${
                isSelected
                  ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/70 text-slate-700'
              }`}
            >
              {/* Clothing Subcategory Badge */}
              {cat.parent_id === 'cat-cloth' && (
                <span
                  className={`absolute top-1 right-1 text-[8px] font-extrabold px-1 rounded ${
                    isSelected ? 'bg-white/30 text-white' : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  Clothing
                </span>
              )}

              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition-colors ${
                  isSelected ? 'bg-white/20' : 'bg-white shadow-xs'
                }`}
              >
                {getIcon(cat.icon)}
              </div>
              <span className="font-bold text-[11px] leading-tight line-clamp-1">
                {language === 'ta' ? cat.name_ta : cat.name_en}
              </span>
              <span
                className={`text-[9px] font-semibold mt-0.5 ${
                  isSelected ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                {catOffers.length} {catOffers.length === 1 ? 'offer' : 'offers'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
