import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { ShoppingBag, Sprout, ShieldCheck, ArrowRight, CheckCircle2, Sparkles, Zap } from 'lucide-react';
import { api, setAuthToken, setStoredUser } from '../../lib/api';

export const PortalGateway: React.FC = () => {
  const {
    setAppMode,
    setCustomerScreen,
    setFarmerScreen,
    setAdminScreen,
    setCustomerLoggedIn,
    setFarmerLoggedIn,
    setAdminLoggedIn,
    setCurrentUser,
    addToast,
  } = useAgrox();

  const handleQuickLogin = async (role: 'CUSTOMER' | 'FARMER' | 'ADMIN') => {
    const creds = {
      CUSTOMER: { email: 'customer@agrox.com', pass: 'password123', name: 'Ayushi Par' },
      FARMER: { email: 'farmer@agrox.com', pass: 'password123', name: 'Ramesh Patil' },
      ADMIN: { email: 'admin@agrox.com', pass: 'password123', name: 'System Admin' },
    }[role];

    try {
      const res = await api.auth.login(creds.email, creds.pass);
      if (res.success && res.data) {
        setAuthToken(res.data.token);
        setStoredUser(res.data.user);
        setCurrentUser(res.data.user);
      }
    } catch {
      // Fallback
    }

    if (role === 'CUSTOMER') {
      setCustomerLoggedIn(true);
      setAppMode('customer');
      setCustomerScreen('home');
      addToast(`Logged into Customer Marketplace as ${creds.name}`, 'success');
    } else if (role === 'FARMER') {
      setFarmerLoggedIn(true);
      setAppMode('farmer');
      setFarmerScreen('dashboard');
      addToast(`Logged into Farmer Hub as ${creds.name}`, 'success');
    } else {
      setAdminLoggedIn(true);
      setAppMode('admin');
      setAdminScreen('dashboard');
      addToast(`Logged into Admin Command Center`, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#17231A] via-[#16803C]/90 to-[#0F1B12] text-white flex flex-col justify-between p-4 sm:p-8">
      {/* Top Brand Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white p-2 flex items-center justify-center shadow-lg">
            <img src="/agrox_logo.svg" alt="AGROX" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-wider text-white">AGROX</h1>
            <p className="text-xs font-semibold text-[#F4B942] tracking-wider uppercase">
              Farmer to City Direct Marketplace
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/20 text-xs font-medium backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Production Ready Stack (Node + React + Supabase)</span>
        </div>
      </header>

      {/* Main Hero & Portal Grid */}
      <main className="max-w-6xl mx-auto w-full my-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#F4B942]/20 text-[#F4B942] border border-[#F4B942]/30 px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select Your Portal to Continue</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            One Platform. Three Powerful Portals.
          </h2>
          <p className="text-sm text-gray-300">
            Connect directly between rural agricultural producers and urban consumers with automated logistics, real-time inventory, and secure settlements.
          </p>
        </div>

        {/* 3 Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Customer Marketplace */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-400/60 hover:bg-white/15 transition-all duration-300 shadow-xl group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#16803C] text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">For Consumers</span>
                <h3 className="text-xl font-black text-white mt-1">Customer App</h3>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  Browse fresh farm harvests, filter organic produce, read farmer profiles, and place doorstep delivery orders.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-gray-300 pt-2 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Fresh daily harvests direct from verified farms</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Real-time GPS order tracking & UPI payments</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 space-y-2.5">
              <button
                onClick={() => {
                  setAppMode('customer');
                  setCustomerScreen('login');
                }}
                className="w-full py-3 bg-[#16803C] hover:bg-[#146f34] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md text-sm"
              >
                <span>Customer Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleQuickLogin('CUSTOMER')}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-emerald-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/10"
              >
                <Zap className="w-3.5 h-3.5 text-[#F4B942]" />
                <span>1-Click Demo Login</span>
              </button>
            </div>
          </div>

          {/* 2. Farmer Partner Hub */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex flex-col justify-between hover:border-[#F4B942]/60 hover:bg-white/15 transition-all duration-300 shadow-xl group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F4B942] text-[#17231A] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Sprout className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">For Producers</span>
                <h3 className="text-xl font-black text-white mt-1">Farmer Hub</h3>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  List crop varieties, manage available inventory, accept customer orders, and track bank payouts with zero middlemen.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-gray-300 pt-2 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F4B942] shrink-0" />
                  <span>Fair price transparency & instant settlement</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F4B942] shrink-0" />
                  <span>7/12 Land record verification & batch control</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 space-y-2.5">
              <button
                onClick={() => {
                  setAppMode('farmer');
                  setFarmerScreen('login');
                }}
                className="w-full py-3 bg-[#F4B942] hover:bg-[#e2a832] text-[#17231A] font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md text-sm"
              >
                <span>Farmer Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleQuickLogin('FARMER')}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-[#F4B942] font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/10"
              >
                <Zap className="w-3.5 h-3.5 text-[#F4B942]" />
                <span>1-Click Demo Login</span>
              </button>
            </div>
          </div>

          {/* 3. Admin Command Center */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex flex-col justify-between hover:border-blue-400/60 hover:bg-white/15 transition-all duration-300 shadow-xl group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0F1B12] text-white border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">For Platform Operations</span>
                <h3 className="text-xl font-black text-white mt-1">Admin Panel</h3>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  Approve farmer verifications, moderate product catalogs, oversee transactions, and monitor GMV reports.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-gray-300 pt-2 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>KYC verification workflow with document review</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Financial ledgers, 5% fee & settlement control</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 space-y-2.5">
              <button
                onClick={() => {
                  setAppMode('admin');
                  setAdminScreen('login');
                }}
                className="w-full py-3 bg-white text-[#17231A] hover:bg-gray-100 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md text-sm"
              >
                <span>Admin Portal Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleQuickLogin('ADMIN')}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/10"
              >
                <Zap className="w-3.5 h-3.5 text-[#F4B942]" />
                <span>1-Click Demo Login</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center py-4 border-t border-white/10 text-xs text-gray-400">
        AGROX © 2026 • Farmer-to-City Agricultural Marketplace • Built with React, TypeScript & Supabase
      </footer>
    </div>
  );
};
