import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { ChevronLeft, User, Bell, Landmark, FileText, Globe, ShieldAlert, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const FarmerSettings: React.FC = () => {
  const { setFarmerScreen, setFarmerLoggedIn, addToast } = useAgrox();

  const [lang, setLang] = useState<'Marathi' | 'English' | 'Hindi'>('Marathi');

  return (
    <div className="p-4 space-y-5 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setFarmerScreen('profile')}
          className="p-2 rounded-full bg-white border border-gray-200 text-[#17231A]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-black text-[#17231A]">Farmer Settings</h2>
          <p className="text-xs text-gray-500">Configure language, payouts & farm documents</p>
        </div>
      </div>

      {/* Language Preference */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-[#16803C]" /> Regional Language (भाषा)
        </h4>

        <div className="flex gap-2">
          {(['Marathi', 'English', 'Hindi'] as const).map((l) => (
            <button
              key={l}
              onClick={() => {
                setLang(l);
                addToast(`Language set to ${l}`, 'info');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                lang === l
                  ? 'bg-[#16803C] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Account & Bank */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Account & Settlements</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-[#16803C]" /> Farmer Name
            </span>
            <span className="font-bold text-[#17231A]">Ramesh Patil</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#16803C]" /> Bank Payout A/c
            </span>
            <span className="font-bold text-[#16803C]">SBI •••• 4921</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#16803C]" /> Land Ownership Verification
            </span>
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">Verified</span>
          </div>
        </div>
      </div>

      {/* Support & Privacy */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Support & Help</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#16803C]" /> Farmer Helpline
            </span>
            <span className="text-[#16803C] font-bold">1800-AGROX-FARM</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#16803C]" /> Marketplace Policy
            </span>
            <span className="text-gray-400">View</span>
          </div>
        </div>
      </div>

      <Button
        fullWidth
        size="lg"
        variant="danger"
        leftIcon={<LogOut className="w-5 h-5" />}
        onClick={() => {
          setFarmerLoggedIn(false);
          setFarmerScreen('login');
        }}
      >
        Logout Farmer Account
      </Button>
    </div>
  );
};
