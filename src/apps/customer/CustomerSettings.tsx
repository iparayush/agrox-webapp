import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { ChevronLeft, User, Lock, Globe, Bell, FileText, HelpCircle, Phone, LogOut, Check } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const CustomerSettings: React.FC = () => {
  const { setCustomerScreen, setCustomerLoggedIn, addToast } = useAgrox();
  const [lang, setLang] = useState<'English' | 'Marathi' | 'Hindi'>('English');
  const [pushNotifs, setPushNotifs] = useState(true);

  return (
    <div className="p-4 space-y-5 pb-20">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCustomerScreen('profile')}
          className="p-2 rounded-full bg-white border border-gray-200 text-[#17231A]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-black text-[#17231A]">Settings</h2>
          <p className="text-xs text-gray-500">App preferences, account & privacy control</p>
        </div>
      </div>

      {/* Account Section */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Account</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-[#16803C]" /> Edit Personal Details
            </span>
            <span className="text-gray-400 font-bold">Ayushi Par</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#16803C]" /> Change Password
            </span>
            <span className="text-[#16803C] font-bold">Update</span>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Preferences</h4>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 block flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#16803C]" /> App Language
          </label>
          <div className="flex gap-2">
            {(['English', 'Marathi', 'Hindi'] as const).map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLang(l);
                  addToast(`Language updated to ${l}`, 'info');
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
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

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
          <span className="font-semibold text-gray-700 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#16803C]" /> Push Notifications
          </span>
          <input
            type="checkbox"
            checked={pushNotifs}
            onChange={(e) => setPushNotifs(e.target.checked)}
            className="w-4 h-4 accent-[#16803C] rounded-md"
          />
        </div>
      </div>

      {/* Privacy Section */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Privacy & Legal</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#16803C]" /> Privacy Policy
            </span>
            <span className="text-gray-400">v2.4</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#16803C]" /> Terms & Conditions
            </span>
            <span className="text-gray-400">View</span>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Support</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#16803C]" /> Help Center & FAQs
            </span>
            <span className="text-[#16803C] font-bold">Open</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#16803C]" /> Contact AGROX Support
            </span>
            <span className="text-[#16803C] font-bold">1800-FARM-CITY</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <Button
        fullWidth
        size="lg"
        variant="danger"
        leftIcon={<LogOut className="w-5 h-5" />}
        onClick={() => {
          setCustomerLoggedIn(false);
          setCustomerScreen('login');
        }}
      >
        Logout
      </Button>
    </div>
  );
};
