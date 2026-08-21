import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Rating } from '../../components/common/Rating';
import { Badge } from '../../components/common/Badge';
import { QuantitySelector } from '../../components/common/QuantitySelector';
import { Button } from '../../components/common/Button';
import {
  ChevronLeft,
  ShieldCheck,
  MapPin,
  Calendar,
  Package,
  Sprout,
  ShoppingBag,
  Zap,
} from 'lucide-react';

export const CustomerProductDetail: React.FC = () => {
  const {
    products,
    farmers,
    selectedProductId,
    setCustomerScreen,
    setSelectedFarmerId,
    addToCart,
  } = useAgrox();

  const [qty, setQty] = useState<number>(1);

  const product = products.find((p) => p.id === selectedProductId) || products[0];
  const farmer = farmers.find((f) => f.id === product.farmer_id) || farmers[0];

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    setCustomerScreen('cart');
  };

  return (
    <div className="bg-[#F7F9F5] min-h-[85vh] pb-24">
      {/* Top Header Floating Back */}
      <div className="relative aspect-4/3 w-full bg-gray-100">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => setCustomerScreen('home')}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/90 backdrop-blur-md text-[#17231A] shadow-md hover:bg-white transition-colors z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="absolute bottom-3 left-4 flex gap-2">
          <Badge variant="organic" size="md">
            {product.farming_method}
          </Badge>
          <Badge variant="success" size="md">
            Direct Harvest
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-5 max-w-md mx-auto">
        {/* Title & Price */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 block">{product.variety}</span>
              <h2 className="text-xl font-black text-[#17231A]">{product.name}</h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#16803C]">₹{product.price_per_unit}</span>
              <span className="text-xs text-gray-500 font-medium block">/ {product.unit}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
            <Rating rating={product.rating} reviewsCount={product.reviews_count} size="md" />
            <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
              Stock: {product.available_quantity_kg} {product.unit} available
            </span>
          </div>
        </div>

        {/* Harvest & Spec Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-gray-100 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-[#F4B942]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Harvest Date</span>
              <span className="text-xs font-bold text-[#17231A]">{product.harvest_date}</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-gray-100 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-[#16803C]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Min Order</span>
              <span className="text-xs font-bold text-[#17231A]">
                {product.min_order_qty} {product.unit}
              </span>
            </div>
          </div>
        </div>

        {/* Farmer Info Card */}
        <div
          onClick={() => {
            setSelectedFarmerId(farmer.id);
            setCustomerScreen('farmer_profile');
          }}
          className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs hover:border-[#16803C] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <img
              src={farmer.photo_url}
              alt={farmer.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-[#16803C]/20"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h4 className="text-sm font-bold text-[#17231A] truncate">{farmer.name}</h4>
                {farmer.is_verified && <ShieldCheck className="w-4 h-4 text-[#16803C] shrink-0" />}
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#16803C]" /> {farmer.district}
              </p>
            </div>
            <Button size="sm" variant="ghost" className="text-xs text-[#16803C]">
              View Farm ➔
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 space-y-2">
          <h4 className="text-sm font-bold text-[#17231A]">About This Harvest</h4>
          <p className="text-xs text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* Quantity Selector */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-[#17231A]">Select Quantity</span>
          <QuantitySelector
            quantity={qty}
            unit={product.unit}
            onIncrease={() => setQty((prev) => prev + 1)}
            onDecrease={() => setQty((prev) => Math.max(1, prev - 1))}
            min={product.min_order_qty}
          />
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 p-3 shadow-xl">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Button
            fullWidth
            size="lg"
            variant="outline"
            leftIcon={<ShoppingBag className="w-4 h-4" />}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          <Button
            fullWidth
            size="lg"
            variant="primary"
            leftIcon={<Zap className="w-4 h-4" />}
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};
