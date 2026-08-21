import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Button } from '../../components/common/Button';
import { ArrowRight, Leaf, ShieldCheck, Truck } from 'lucide-react';

export const CustomerSplash: React.FC = () => {
  const { setCustomerScreen } = useAgrox();

  return (
    <div className="min-h-[85vh] flex flex-col justify-between p-6 bg-gradient-to-b from-[#F7F9F5] via-white to-[#F7F9F5]">
      {/* Top Header branding */}
      <div className="flex flex-col items-center text-center mt-8 animate-fade-in">
        <div className="w-28 h-28 rounded-3xl bg-white p-3 shadow-xl border border-gray-100 flex items-center justify-center mb-6 animate-pulse-slow">
          <img src="/agrox_logo.svg" alt="AGROX Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-3xl font-black text-[#17231A] tracking-wider mb-2">AGROX</h1>
        <div className="h-1 w-16 bg-[#16803C] rounded-full mb-4" />
        <p className="text-[#16803C] font-extrabold text-base max-w-xs leading-relaxed">
          Fresh from Farmers. Fair for Farmers. Better for Cities.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="my-8 space-y-4">
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16803C] flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#17231A]">100% Farm Fresh Harvest</h4>
            <p className="text-xs text-gray-500">Picked directly from verified local farms daily</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#F4B942] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#17231A]">Fair Prices for Farmers</h4>
            <p className="text-xs text-gray-500">Zero middleman exploitation, 100% transparent pricing</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#16803C]/10 text-[#16803C] flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#17231A]">Rapid City Delivery</h4>
            <p className="text-xs text-gray-500">Express delivery straight to your doorstep</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-4">
        <Button
          fullWidth
          size="lg"
          variant="primary"
          rightIcon={<ArrowRight className="w-5 h-5" />}
          onClick={() => setCustomerScreen('home')}
        >
          Explore Marketplace
        </Button>
        <Button
          fullWidth
          size="lg"
          variant="outline"
          onClick={() => setCustomerScreen('login')}
        >
          Login / Create Account
        </Button>
      </div>
    </div>
  );
};
