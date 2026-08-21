import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Bell, ShoppingBag, MapPin, ChevronDown } from 'lucide-react';

export const CustomerMobileHeader: React.FC = () => {
  const { cart, notifications, setCustomerScreen } = useAgrox();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const unreadNotifs = notifications.filter((n) => !n.is_read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 pt-3 pb-2.5 shadow-2xs">
      {/* Top Row: Logo & Action Icons */}
      <div className="flex items-center justify-between">
        {/* Left: AGROX Official Logo */}
        <div
          onClick={() => setCustomerScreen('home')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-[#16803C] p-1.5 flex items-center justify-center shadow-xs">
            <img src="/agrox_logo.svg" alt="AGROX" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-black text-[#17231A] tracking-tight leading-none">AGROX</h1>
            <span className="text-[9px] font-bold text-[#16803C] tracking-wide block">FARMER TO CITY</span>
          </div>
        </div>

        {/* Right: Notifications & Cart */}
        <div className="flex items-center gap-2">
          {/* Notification Button */}
          <button
            onClick={() => setCustomerScreen('notifications')}
            className="relative p-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-[#16803C] transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {unreadNotifs}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setCustomerScreen('cart')}
            className="relative p-2 rounded-xl bg-[#16803C] text-white hover:bg-[#136f34] transition-colors shadow-xs"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F4B942] text-[#17231A] font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Row: Delivery Address / Location */}
      <div
        onClick={() => setCustomerScreen('settings')}
        className="flex items-center gap-1.5 mt-2 text-xs text-gray-600 font-semibold cursor-pointer hover:text-[#16803C] transition-colors"
      >
        <MapPin className="w-3.5 h-3.5 text-[#16803C] shrink-0" />
        <span className="text-gray-400 font-normal">Deliver to</span>
        <span className="text-[#17231A] font-bold">Nashik, Maharashtra</span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </div>
    </header>
  );
};
