import React from 'react';
import { FarmerProfile } from '../../types';
import { Badge } from '../common/Badge';
import { Rating } from '../common/Rating';
import { Button } from '../common/Button';
import { ShieldCheck, MapPin, Sprout } from 'lucide-react';
import { useAgrox } from '../../context/AgroxContext';

interface FarmerCardProps {
  farmer: FarmerProfile;
  onSelect?: () => void;
}

export const FarmerCard: React.FC<FarmerCardProps> = ({ farmer, onSelect }) => {
  const { setSelectedFarmerId, setCustomerScreen } = useAgrox();

  const handleCardClick = () => {
    setSelectedFarmerId(farmer.id);
    setCustomerScreen('farmer_profile');
    if (onSelect) onSelect();
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <img
              src={farmer.photo_url}
              alt={farmer.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#16803C]/20 shadow-xs"
            />
            {farmer.is_verified && (
              <div className="absolute -bottom-1 -right-1 bg-[#16803C] text-white p-0.5 rounded-full ring-2 ring-white">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h4 className="text-base font-bold text-[#17231A] truncate group-hover:text-[#16803C] transition-colors">
                {farmer.name}
              </h4>
              {farmer.is_verified && (
                <Badge variant="verified" size="sm">
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#16803C] shrink-0" />
              <span className="truncate">{farmer.district}</span>
            </div>
            <div className="mt-1">
              <Rating rating={farmer.rating} reviewsCount={farmer.reviews_count} size="sm" />
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-600 line-clamp-2 italic bg-[#F7F9F5] p-2.5 rounded-xl border border-gray-100/60 mb-3">
          "{farmer.bio}"
        </p>

        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mb-3">
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
            <Sprout className="w-3.5 h-3.5 text-[#16803C]" />
            {farmer.farm_size_acres} Acres
          </span>
          <span>•</span>
          <span>{farmer.village}</span>
        </div>
      </div>

      <Button
        size="sm"
        variant="outline"
        fullWidth
        className="rounded-xl group-hover:bg-[#16803C] group-hover:text-white transition-colors"
      >
        Shop From This Farmer
      </Button>
    </div>
  );
};
