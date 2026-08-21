import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '../common/Button';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install AGROX on iOS: Tap Share ➔ Add to Home Screen.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-[#17231A] text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-gray-800">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-[#16803C] p-0.5 flex items-center justify-center shrink-0">
          <img src="/agrox_logo.svg" alt="AGROX" className="w-full h-full object-contain" />
        </div>
        <div>
          <span className="font-bold text-[#F4B942]">Install AGROX App</span>
          <span className="hidden sm:inline text-gray-300 ml-1.5">— Fast direct farm purchasing experience</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="yellow"
          leftIcon={<Download className="w-3.5 h-3.5" />}
          onClick={handleInstallClick}
          className="text-xs py-1 px-2.5 rounded-lg font-bold"
        >
          Install
        </Button>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
