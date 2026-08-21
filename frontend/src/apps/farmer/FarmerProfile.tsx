import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import {
  Sprout,
  ShieldCheck,
  MapPin,
  FileText,
  Landmark,
  User,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  Star,
  ShoppingBag,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export const FarmerProfile: React.FC = () => {
  const { farmers, setFarmerScreen, setAppMode, setCustomerScreen, logout, currentUser } = useAgrox();

  const farmer = farmers[0]; // Ramesh Patil

  const menu = [
    { label: 'Farm Details & Location', icon: Sprout, target: 'settings' },
    { label: 'Official Documents & Verification', icon: FileText, target: 'verification' },
    { label: 'Bank Account & Payout Details', icon: Landmark, target: 'earnings' },
    { label: 'Edit Profile Information', icon: User, target: 'settings' },
    { label: 'Portal Settings & Language', icon: SettingsIcon, target: 'settings' },
  ];

  const handleSwitchToCustomer = () => {
    setAppMode('customer');
    setCustomerScreen('home');
    window.history.pushState({}, '', '/');
  };

  return (
    <div className="p-4 space-y-5 pb-24 max-w-lg mx-auto w-full">
      {/* Header Profile Card */}
      <div className="bg-gradient-to-r from-[#16803C] to-[#3FAE5A] text-white p-5 rounded-3xl shadow-md flex items-center gap-4">
        <div className="relative">
          <img
            src={farmer.photo_url}
            alt={farmer.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
          />
          {farmer.is_verified && (
            <div className="absolute -bottom-1 -right-1 bg-[#F4B942] text-[#17231A] p-0.5 rounded-full ring-2 ring-white">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-black truncate">{currentUser?.full_name || farmer.name}</h2>
            <Badge variant="verified" size="sm">Verified</Badge>
          </div>
          <p className="text-xs text-white/90 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-[#F4B942]" /> {farmer.district}
          </p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-emerald-100 font-semibold">
            <span>{farmer.farm_size_acres} Acres</span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-[#F4B942]">
              <Star className="w-3.5 h-3.5 fill-current" /> {farmer.rating} Rating
            </span>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs divide-y divide-gray-100 overflow-hidden">
        {menu.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => setFarmerScreen(item.target)}
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

      {/* Switch to Customer Portal */}
      <div>
        <button
          onClick={handleSwitchToCustomer}
          className="w-full flex items-center justify-between p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl text-left hover:bg-emerald-100/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#16803C] text-white rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#17231A] block">Switch to Customer Marketplace</span>
              <span className="text-[11px] text-gray-500 font-medium">Buy fresh produce from other farmers</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#16803C]" />
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full bg-red-50 text-red-700 font-bold text-sm p-4 rounded-2xl border border-red-100 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout Farmer Account</span>
      </button>
    </div>
  );
};
