import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { LayoutDashboard, Package, ShoppingBag, TrendingUp, User } from 'lucide-react';

export const FarmerBottomNav: React.FC = () => {
  const { farmerScreen, setFarmerScreen, orders } = useAgrox();

  const pendingOrdersCount = orders.filter((o) => o.order_status === 'Placed').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount },
    { id: 'earnings', label: 'Earnings', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg px-2 py-1.5">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = farmerScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setFarmerScreen(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-[#16803C] font-extrabold scale-105'
                  : 'text-gray-400 font-semibold hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-[#F4B942] text-[#17231A] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#16803C] mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
