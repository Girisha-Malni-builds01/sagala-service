import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { MapPin, Sparkles, Scale, Shield, Store, User } from 'lucide-react';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { role, setRole, setActiveTab, compareProducts, setIsCompareOpen } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand & City */}
        <div
          className="flex items-center space-x-2.5 cursor-pointer"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep flex items-center justify-center shadow-md shadow-brand-primary/20 text-white font-black text-xl tracking-tighter">
            <span className="relative">
              S
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-accent rounded-full border-2 border-white"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-tight text-brand-deep">SAGALA</span>
              <span className="font-bold text-base tracking-tight text-brand-primary">SERVICE</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-500 text-[11px] font-medium">
              <MapPin className="w-3 h-3 text-brand-accent" />
              <span>{t('city.madurai')}</span>
              <span className="text-emerald-600 font-semibold flex items-center pl-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
                Live
              </span>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-1.5">
          {/* Compare Badge */}
          {compareProducts.length > 0 && (
            <button
              onClick={() => setIsCompareOpen(true)}
              className="relative p-2 rounded-xl bg-brand-light text-brand-primary hover:bg-blue-100 transition-colors"
              title="Compare Products"
            >
              <Scale className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {compareProducts.length}
              </span>
            </button>
          )}

          {/* Language Toggle (EN / தமிழ்) */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-brand-deep transition-all active:scale-95 flex items-center space-x-1"
          >
            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>

          {/* Quick Role Switcher Pill */}
          <div className="relative group">
            <button
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                role === 'admin'
                  ? 'bg-purple-600 text-white'
                  : role === 'vendor'
                  ? 'bg-brand-accent text-white'
                  : 'bg-brand-primary text-white'
              }`}
            >
              {role === 'admin' && <Shield className="w-3.5 h-3.5" />}
              {role === 'vendor' && <Store className="w-3.5 h-3.5" />}
              {role === 'customer' && <User className="w-3.5 h-3.5" />}
              <span className="capitalize">{role}</span>
            </button>

            {/* Role dropdown on hover/click */}
            <div className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1 hidden group-hover:block group-focus-within:block z-50">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Mode
              </div>
              <button
                onClick={() => {
                  setRole('customer');
                  setActiveTab('home');
                }}
                className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center space-x-2 hover:bg-slate-50 ${
                  role === 'customer' ? 'text-brand-primary font-bold bg-blue-50/50' : 'text-slate-700'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>
              <button
                onClick={() => {
                  setRole('vendor');
                  setActiveTab('vendor_dashboard');
                }}
                className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center space-x-2 hover:bg-slate-50 ${
                  role === 'vendor' ? 'text-brand-accent font-bold bg-amber-50/50' : 'text-slate-700'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Shop Vendor</span>
              </button>
              <button
                onClick={() => {
                  setRole('admin');
                  setActiveTab('admin_dashboard');
                }}
                className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center space-x-2 hover:bg-slate-50 ${
                  role === 'admin' ? 'text-purple-600 font-bold bg-purple-50/50' : 'text-slate-700'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>SAGALA Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
