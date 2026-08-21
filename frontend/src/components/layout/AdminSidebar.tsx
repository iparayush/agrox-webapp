import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import {
  LayoutDashboard,
  Users,
  Sprout,
  Package,
  ShoppingBag,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { adminScreen, setAdminScreen, setAdminLoggedIn } = useAgrox();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'farmers', label: 'Farmers', icon: Sprout },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#17231A] text-white flex flex-col justify-between p-4 border-r border-gray-800 shrink-0 min-h-screen">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-gray-800">
          <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-md">
            <img src="/agrox_logo.svg" alt="AGROX Admin" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-wider text-white">AGROX</h2>
            <span className="text-[10px] font-bold text-[#F4B942] uppercase tracking-widest block">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = adminScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminScreen(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#16803C] text-white shadow-md font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#F4B942]' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-3 bg-white/5 rounded-2xl">
          <div className="w-8 h-8 rounded-full bg-[#16803C] text-white flex items-center justify-center font-bold text-xs">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="text-xs font-bold text-white truncate">System Admin</h5>
            <span className="text-[10px] text-gray-400 block truncate">admin@agrox.com</span>
          </div>
        </div>
        <button
          onClick={() => {
            setAdminLoggedIn(false);
            setAdminScreen('login');
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Portal</span>
        </button>
      </div>
    </aside>
  );
};
