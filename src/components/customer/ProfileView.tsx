import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  User,
  Store,
  Shield,
  Download,
  Phone,
  Mail,
  CheckCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { VendorSignupModal } from '../vendor/VendorSignupModal';
import { PrivacyNote } from '../common/PrivacyNote';

export const ProfileView: React.FC = () => {
  const { role, setRole, setActiveTab, favourites } = useApp();
  const { language, setLanguage, t } = useLanguage();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      localStorage.setItem('sagala_customer_phone', phoneNumber);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2000);
    }
  };

  return (
    <div className="px-4 py-3 pb-24 space-y-4">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card flex items-center space-x-3.5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-deep text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-brand-primary/20">
          <User className="w-7 h-7" />
        </div>
        <div>
          <h2 className="font-extrabold text-base text-brand-deep leading-tight">
            Madurai Shopper
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Browsing freely without login</p>
          <div className="flex items-center space-x-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <CheckCircle className="w-3 h-3" />
            <span>{favourites.length} Favourite shops saved</span>
          </div>
        </div>
      </div>

      {/* Optional Customer Phone / Login for Favourites Sync */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card">
        <h3 className="font-extrabold text-xs text-slate-800 mb-1 flex items-center space-x-1.5">
          <Phone className="w-3.5 h-3.5 text-brand-primary" />
          <span>Optional: Save Phone for SMS Deal Alerts</span>
        </h3>
        <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
          No password needed. Enter phone to sync your favourites across devices.
        </p>

        <form onSubmit={handleSavePhone} className="flex space-x-2">
          <input
            type="tel"
            placeholder="+91 Mobile number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-brand-primary hover:bg-brand-deep text-white font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            {savedMessage ? 'Saved!' : 'Save'}
          </button>
        </form>
      </div>

      {/* Business & Vendor Portal Link */}
      <div className="bg-gradient-to-r from-amber-500 to-brand-accent rounded-2xl p-4 text-white shadow-lg shadow-amber-500/15">
        <div className="flex items-center space-x-2 font-black text-sm mb-1">
          <Store className="w-5 h-5 text-white" />
          <span>Own a Shop in Madurai?</span>
        </div>
        <p className="text-xs text-amber-50 leading-relaxed mb-3">
          Join SAGALA SERVICE for free. Post daily flash discounts, gain direct customer phone calls, and boost footfalls at zero commission.
        </p>
        <button
          onClick={() => setIsSignupOpen(true)}
          className="px-4 py-2 rounded-xl bg-white text-brand-deep font-extrabold text-xs shadow-md hover:bg-amber-50 active:scale-95 transition-all flex items-center space-x-1"
        >
          <span>Register Your Shop Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Role Switcher Section for Evaluation */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card space-y-2.5">
        <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider text-[10px]">
          Demo Persona Switcher
        </h3>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              setRole('customer');
              setActiveTab('home');
            }}
            className={`py-2 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all ${
              role === 'customer'
                ? 'bg-brand-primary text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <User className="w-4 h-4 mb-1" />
            <span>Customer</span>
          </button>

          <button
            onClick={() => {
              setRole('vendor');
              setActiveTab('vendor_dashboard');
            }}
            className={`py-2 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all ${
              role === 'vendor'
                ? 'bg-brand-accent text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Store className="w-4 h-4 mb-1" />
            <span>Merchant</span>
          </button>

          <button
            onClick={() => {
              setRole('admin');
              setActiveTab('admin_dashboard');
            }}
            className={`py-2 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all ${
              role === 'admin'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Shield className="w-4 h-4 mb-1" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      <PrivacyNote />

      {/* Vendor Signup Modal */}
      <VendorSignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </div>
  );
};
