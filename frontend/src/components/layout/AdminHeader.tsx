import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Search, Bell, ShieldCheck, RefreshCw } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const { adminScreen, notifications } = useAgrox();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const titles: Record<string, string> = {
    dashboard: 'Executive Dashboard',
    users: 'User Directory Management',
    farmers: 'Farmer Onboarding & Approvals',
    products: 'Product Catalog Moderation',
    orders: 'Order Logistics & Monitoring',
    payments: 'Financial Settlements & Transactions',
    reports: 'Marketplace Intelligence & Analytics',
    settings: 'System Configuration & Security',
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      <div>
        <h1 className="text-xl font-black text-[#17231A] tracking-tight">
          {titles[adminScreen] || 'Admin Dashboard'}
        </h1>
        <span className="text-xs text-gray-500 font-medium">
          AGROX Live Marketplace Controller
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, farmers, users..."
            className="w-full bg-[#F7F9F5] text-xs font-medium pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#16803C]"
          />
        </div>

        {/* Live sync status badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-[#3FAE5A] animate-ping" />
          <span>Real-time Sync Active</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
