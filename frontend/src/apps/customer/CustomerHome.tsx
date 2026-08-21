import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { CustomerMobileHeader } from '../../components/layout/CustomerMobileHeader';
import { ProductCard } from '../../components/shared/ProductCard';
import { FarmerCard } from '../../components/shared/FarmerCard';
import { Search, Sparkles, Sprout, ArrowRight, ChevronRight } from 'lucide-react';
import { ProductCategory } from '../../types';

export const CustomerHome: React.FC = () => {
  const {
    products,
    farmers,
    setCustomerScreen,
    setSelectedCategory,
  } = useAgrox();

  const [searchVal, setSearchVal] = useState('');

  const categoryList: { name: ProductCategory; icon: string; image: string }[] = [
    { name: 'Vegetables', icon: '🥬', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80' },
    { name: 'Fruits', icon: '🍎', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80' },
    { name: 'Grains', icon: '🌾', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80' },
    { name: 'Pulses', icon: '🫘', image: 'https://images.unsplash.com/photo-1614350292382-c448d0110dfa?auto=format&fit=crop&w=400&q=80' },
    { name: 'Spices', icon: '🌶️', image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=400&q=80' },
    { name: 'Organic', icon: '🌱', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80' },
  ];

  const handleCategoryClick = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setCustomerScreen('search');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F5] flex flex-col">
      {/* Mobile Top Header (AGROX Logo, Cart, Notifications, Location) */}
      <CustomerMobileHeader />

      {/* Main Scrollable Content */}
      <div className="flex-1 p-4 space-y-5 pb-24 max-w-lg mx-auto w-full">
        {/* 1. Search Bar */}
        <div
          onClick={() => setCustomerScreen('search')}
          className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-gray-200/80 shadow-2xs cursor-pointer hover:border-[#16803C]/50 transition-all group"
        >
          <Search className="w-5 h-5 text-gray-400 group-hover:text-[#16803C] transition-colors" />
          <span className="text-xs sm:text-sm text-gray-400 font-medium select-none">
            Search vegetables, fruits, farmers...
          </span>
        </div>

        {/* 2. Hero Agricultural Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#16803C] to-[#259449] text-white p-5 sm:p-6 shadow-md">
          <div className="relative z-10 space-y-2 max-w-[70%]">
            <span className="inline-flex items-center gap-1 bg-[#F4B942] text-[#17231A] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
              <Sparkles className="w-3 h-3" /> Direct From Farms
            </span>
            <h2 className="text-xl sm:text-2xl font-black leading-tight text-white">
              Fresh Produce Direct From Farmers
            </h2>
            <p className="text-xs text-white/90 font-medium leading-relaxed">
              Zero unnecessary middlemen. Fair prices. Fresh produce.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCustomerScreen('categories')}
                className="bg-[#F4B942] hover:bg-[#e6ab31] text-[#17231A] text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <span>Shop Fresh</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Banner Graphic Asset */}
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
            alt="Harvest Basket"
            className="absolute -right-6 -bottom-6 w-44 h-44 object-cover rounded-full opacity-35 mix-blend-overlay pointer-events-none"
          />
        </div>

        {/* 3. Categories (Horizontal Scrolling) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-extrabold text-[#17231A] tracking-tight">Categories</h3>
            <button
              onClick={() => setCustomerScreen('categories')}
              className="text-xs font-bold text-[#16803C] hover:underline flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
            {categoryList.map((cat) => (
              <div
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="flex flex-col items-center shrink-0 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200/70 shadow-2xs p-1 overflow-hidden group-hover:border-[#16803C] group-hover:scale-105 transition-all duration-200">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <span className="text-xs font-bold text-[#17231A] mt-1.5 group-hover:text-[#16803C] transition-colors">
                  {cat.icon} {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Fresh Today (2-Column Mobile Grid) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-extrabold text-[#17231A] tracking-tight flex items-center gap-1.5">
                Fresh Today 🌿
              </h3>
              <span className="text-[11px] text-gray-500 font-medium">Harvested within 24 hours</span>
            </div>
            <button
              onClick={() => setCustomerScreen('search')}
              className="text-xs font-bold text-[#16803C] hover:underline"
            >
              See All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* 5. Popular Farmers (Horizontal Scrolling) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-extrabold text-[#17231A] tracking-tight flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-[#16803C]" /> Farmers Near You
              </h3>
              <span className="text-[11px] text-gray-500 font-medium">Verified local Nashik producers</span>
            </div>
          </div>

          <div className="flex gap-3.5 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
            {farmers.map((farmer) => (
              <div key={farmer.id} className="w-64 shrink-0">
                <FarmerCard farmer={farmer} />
              </div>
            ))}
          </div>
        </div>

        {/* 6. Popular Products */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-extrabold text-[#17231A] tracking-tight">Popular Products 🔥</h3>
          </div>
          <div className="space-y-3">
            {products.slice(2, 6).map((product) => (
              <ProductCard key={product.id} product={product} layout="horizontal" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
