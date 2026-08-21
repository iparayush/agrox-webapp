import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Rating } from '../../components/common/Rating';
import { Badge } from '../../components/common/Badge';
import { ProductCard } from '../../components/shared/ProductCard';
import { Button } from '../../components/common/Button';
import { ChevronLeft, ShieldCheck, MapPin, Sprout, Image, Star } from 'lucide-react';

export const CustomerFarmerProfile: React.FC = () => {
  const { farmers, products, selectedFarmerId, setCustomerScreen } = useAgrox();

  const farmer = farmers.find((f) => f.id === selectedFarmerId) || farmers[0];
  const farmerProducts = products.filter((p) => p.farmer_id === farmer.id);

  return (
    <div className="bg-[#F7F9F5] min-h-[85vh] pb-24">
      {/* Header Banner */}
      <div className="relative h-44 bg-gradient-to-r from-[#16803C] to-[#3FAE5A] p-4 text-white">
        <button
          onClick={() => setCustomerScreen('home')}
          className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Farmer Profile Avatar Overlay */}
        <div className="absolute -bottom-10 left-6 flex items-end gap-3">
          <div className="relative">
            <img
              src={farmer.photo_url}
              alt={farmer.name}
              className="w-20 h-20 rounded-3xl object-cover border-4 border-white shadow-lg bg-white"
            />
            {farmer.is_verified && (
              <div className="absolute -bottom-1 -right-1 bg-[#16803C] text-white p-1 rounded-full ring-2 ring-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-12 px-4 space-y-5 max-w-md mx-auto">
        {/* Name & Basic Info */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xl font-black text-[#17231A]">{farmer.name}</h2>
                {farmer.is_verified && <Badge variant="verified" size="sm">Verified</Badge>}
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#16803C]" /> {farmer.district}
              </p>
            </div>
            <Rating rating={farmer.rating} reviewsCount={farmer.reviews_count} size="md" />
          </div>

          <p className="text-xs text-gray-600 mt-3 bg-[#F7F9F5] p-3 rounded-2xl border border-gray-100 italic">
            "{farmer.bio}"
          </p>

          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100 text-xs">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-[#16803C]" />
              <span className="font-bold text-[#17231A]">{farmer.farm_size_acres} Acres Land</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#F4B942]" />
              <span className="font-bold text-[#17231A]">Organic Certified</span>
            </div>
          </div>
        </div>

        {/* Farm Photos Gallery */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-[#17231A] flex items-center gap-1.5">
            <Image className="w-4 h-4 text-[#16803C]" /> Farm Photos
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {farmer.farm_photos.map((photo, idx) => (
              <img
                key={idx}
                src={photo}
                alt={`Farm photo ${idx + 1}`}
                className="w-full h-28 rounded-2xl object-cover border border-gray-100 hover:scale-102 transition-transform"
              />
            ))}
          </div>
        </div>

        {/* Products from this farmer */}
        <div>
          <h3 className="text-base font-extrabold text-[#17231A] mb-3">
            Fresh Produce from {farmer.name} ({farmerProducts.length})
          </h3>
          <div className="grid grid-cols-2 gap-3.5">
            {farmerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
