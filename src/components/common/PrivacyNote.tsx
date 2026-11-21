import React, { useState } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const PrivacyNote: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-center">
        <button
          onClick={() => setIsOpen(true)}
          className="text-[11px] text-slate-500 hover:text-brand-primary flex items-center space-x-1 underline decoration-dotted"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
          <span>Privacy & Honest Tracking Note</span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 text-brand-primary mb-2">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="font-bold text-sm text-brand-deep">{t('privacy.title')}</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {t('privacy.text')}
            </p>
            <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-500 space-y-1 border border-slate-100">
              <div className="flex items-center space-x-1 font-semibold text-slate-700">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                <span>What we count:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
                <li>Anonymous session IDs stored locally</li>
                <li>Tap counts on Call, WhatsApp & Directions</li>
                <li>Rate-limited to prevent duplicate spam (30s)</li>
                <li>Zero ad cookies, zero Google Analytics</li>
              </ul>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full py-2 bg-brand-primary hover:bg-brand-deep text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
