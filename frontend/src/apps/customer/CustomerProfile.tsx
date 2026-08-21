import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  Settings as SettingsIcon,
  ShieldAlert,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Sprout,
  ShieldAlert as AdminShield,
} from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { setCustomerScreen, setAppMode, setFarmerScreen, setAdminScreen, logout, currentUser } = useAgrox();

  const menuItems = [
    { label: 'My Orders', icon: ShoppingBag, onClick: () => setCustomerScreen('orders') },
    { label: 'Saved Addresses', icon: MapPin, onClick: () => setCustomerScreen('settings') },
    { label: 'Payment Methods', icon: CreditCard, onClick: () => setCustomerScreen('settings') },
    { label: 'Notifications', icon: Bell, onClick: () => setCustomerScreen('notifications') },
    { label: 'Help & Support', icon: HelpCircle, onClick: () => setCustomerScreen('settings') },
    { label: 'Settings', icon: SettingsIcon, onClick: () => setCustomerScreen('settings') },
    { label: 'Privacy Policy', icon: ShieldAlert, onClick: () => setCustomerScreen('settings') },
  ];

  const handleSwitchToFarmer = () => {
    setAppMode('farmer');
    setFarmerScreen('dashboard');
    window.history.pushState({}, '', '/farmer');
  };

  const handleSwitchToAdmin = () => {
    setAppMode('admin');
    setAdminScreen('dashboard');
    window.history.pushState({}, '', '/admin');
  };

  return (
    <div className="p-4 space-y-5 pb-24 max-w-lg mx-auto w-full">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-[#16803C] to-[#3FAE5A] text-white p-5 rounded-3xl shadow-md flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/50 flex items-center justify-center font-black text-xl text-white shadow-inner">
          {currentUser?.full_name ? currentUser.full_name.substring(0, 2).toUpperCase() : 'AP'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-black tracking-tight truncate">
              {currentUser?.full_name || 'Ayushi Par'}
            </h2>
            <ShieldCheck className="w-4 h-4 text-[#F4B942] shrink-0" />
          </div>
          <p className="text-xs text-white/90 font-medium">
            {currentUser?.email || currentUser?.phone || '+91 98234 56789'}
          </p>
          <span className="inline-block mt-1 bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-md">
            Verified Customer • Nashik
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs divide-y divide-gray-100 overflow-hidden">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={item.onClick}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#F7F9F5] text-[#16803C]">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-[#17231A]">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          );
        })}
      </div>

      {/* Enterprise Portal Access Switchers */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Other Portals</h4>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleSwitchToFarmer}
            className="flex items-center gap-2 p-3 bg-[#F4B942]/15 hover:bg-[#F4B942]/25 border border-[#F4B942]/30 rounded-2xl text-left transition-colors"
          >
            <div className="p-2 bg-[#F4B942] text-[#17231A] rounded-xl">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-[#17231A] block">Farmer Hub</span>
              <span className="text-[10px] text-gray-500 font-medium">Sell produce</span>
            </div>
          </button>

          <button
            onClick={handleSwitchToAdmin}
            className="flex items-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-2xl text-left transition-colors"
          >
            <div className="p-2 bg-[#17231A] text-white rounded-xl">
              <AdminShield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-[#17231A] block">Admin Portal</span>
              <span className="text-[10px] text-gray-500 font-medium">Operations</span>
            </div>
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full bg-red-50 text-red-700 font-bold text-sm p-4 rounded-2xl border border-red-100 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout Account</span>
      </button>
    </div>
  );
};
