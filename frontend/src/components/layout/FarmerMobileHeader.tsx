import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Bell, Sprout, Plus } from 'lucide-react';

export const FarmerMobileHeader: React.FC = () => {
  const { setFarmerScreen, notifications } = useAgrox();

  const unreadNotifs = notifications.filter((n) => !n.is_read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 pt-3 pb-2.5 shadow-2xs">
      <div className="flex items-center justify-between">
        {/* Left: AGROX Farmer Brand */}
        <div
          onClick={() => setFarmerScreen('dashboard')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-[#F4B942] p-1.5 flex items-center justify-center text-[#17231A] shadow-xs">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-black text-[#17231A] tracking-tight leading-none">AGROX</h1>
              <span className="bg-[#16803C] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full">
                Farmer
              </span>
            </div>
            <span className="text-[9px] font-bold text-gray-500 tracking-wide block">PRODUCER HUB</span>
          </div>
        </div>

        {/* Right: Add Product Quick Action & Notifications */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFarmerScreen('add_product')}
            className="flex items-center gap-1 bg-[#16803C] hover:bg-[#136f34] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Produce</span>
          </button>

          <button
            onClick={() => setFarmerScreen('profile')}
            className="relative p-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-[#16803C] transition-colors"
            title="Farmer Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {unreadNotifs}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
