import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Smartphone, LayoutGrid, ShoppingBag, ShieldCheck, Sprout, LogOut, User } from 'lucide-react';

export const AppSwitcherHeader: React.FC = () => {
  const {
    appMode,
    setAppMode,
    isMobileFrame,
    setIsMobileFrame,
    cart,
    setCustomerScreen,
    setFarmerScreen,
    setAdminScreen,
    currentUser,
    logout,
  } = useAgrox();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#16803C] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
        {/* Logo & Brand -> Click to go to Gateway */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setAppMode('gateway')}
          title="Return to Portal Gateway Selector"
        >
          <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <img src="/agrox_logo.svg" alt="AGROX Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black tracking-wider leading-none text-white">AGROX</h1>
              <span className="hidden sm:inline bg-[#F4B942] text-[#17231A] text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase">
                {appMode}
              </span>
            </div>
            <span className="text-[9px] font-semibold text-[#F4B942] tracking-tight block">FARMER TO CITY DIRECT</span>
          </div>
        </div>

        {/* 3 Portal Switcher Tabs */}
        <div className="flex items-center bg-black/25 p-1 rounded-xl backdrop-blur-xs border border-white/10 overflow-x-auto">
          <button
            onClick={() => {
              setAppMode('customer');
              setCustomerScreen('home');
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              appMode === 'customer'
                ? 'bg-white text-[#16803C] shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Customer</span>
          </button>

          <button
            onClick={() => {
              setAppMode('farmer');
              setFarmerScreen('dashboard');
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              appMode === 'farmer'
                ? 'bg-[#F4B942] text-[#17231A] shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Farmer</span>
          </button>

          <button
            onClick={() => {
              setAppMode('admin');
              setAdminScreen('dashboard');
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              appMode === 'admin'
                ? 'bg-[#17231A] text-white shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          <button
            onClick={() => setAppMode('gateway')}
            title="Choose Portal from Gateway Hub"
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all shrink-0"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Portals</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* User info if logged in */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-xl text-xs border border-white/10">
              <User className="w-3.5 h-3.5 text-[#F4B942]" />
              <span className="font-semibold text-white truncate max-w-[120px]">
                {currentUser.full_name || 'User'}
              </span>
            </div>
          )}

          {/* Mobile frame toggle */}
          {appMode !== 'admin' && (
            <button
              onClick={() => setIsMobileFrame((prev) => !prev)}
              title="Toggle Mobile Device Frame View"
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                isMobileFrame
                  ? 'bg-white text-[#16803C] border-white shadow-xs'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden lg:inline">{isMobileFrame ? 'Exit Frame' : 'Mobile Frame'}</span>
            </button>
          )}

          {/* Cart Icon */}
          {appMode === 'customer' && (
            <button
              onClick={() => setCustomerScreen('cart')}
              className="relative p-2 rounded-xl bg-[#3FAE5A] text-white hover:bg-[#35964d] transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#F4B942] text-[#17231A] font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            title="Log Out of Current Session"
            className="p-2 rounded-xl bg-red-500/20 text-red-100 hover:bg-red-500/30 hover:text-white border border-red-400/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
