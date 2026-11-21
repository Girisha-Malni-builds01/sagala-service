import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare } from 'lucide-react';

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [showIosGuide, setShowIosGuide] = useState<boolean>(false);

  useEffect(() => {
    // Check if dismissed previously
    const dismissed = localStorage.getItem('sagala_pwa_dismissed');
    if (dismissed) return;

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (isIosDevice && !isStandalone) {
      setIsIos(true);
      setShowPrompt(true);
    }

    // Android / Desktop Chrome PWA prompt listener
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('sagala_pwa_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <>
      <div className="max-w-md mx-auto px-4 pt-2">
        <div className="bg-gradient-to-r from-brand-deep to-brand-primary rounded-2xl p-3 text-white shadow-lg shadow-brand-primary/20 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center font-bold text-amber-300">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold leading-tight">Install SAGALA App</h4>
              <p className="text-[10px] text-blue-100">Fast 1-tap offers on your home screen</p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 bg-brand-accent hover:bg-amber-600 active:scale-95 text-white font-extrabold text-[11px] rounded-lg shadow-sm transition-all"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 text-blue-200 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Install Helper Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full text-slate-800 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-sm text-brand-deep">Install on iPhone / iPad</h4>
              <button onClick={() => setShowIosGuide(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ol className="text-xs space-y-2 text-slate-600">
              <li className="flex items-start space-x-2">
                <span className="font-bold text-brand-primary">1.</span>
                <span>Tap the <Share className="inline w-3.5 h-3.5 text-blue-600 mx-0.5" /> <strong>Share</strong> button at bottom of Safari.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-brand-primary">2.</span>
                <span>Scroll down and select <PlusSquare className="inline w-3.5 h-3.5 text-slate-700 mx-0.5" /> <strong>Add to Home Screen</strong>.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-brand-primary">3.</span>
                <span>Tap <strong>Add</strong> in the top right corner. Done!</span>
              </li>
            </ol>
            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full mt-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
