import React from 'react';
import { Product } from '../../types';
import { Rating } from '../common/Rating';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ShoppingBag, ShieldCheck, MapPin, Calendar } from 'lucide-react';
import { useAgrox } from '../../context/AgroxContext';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'horizontal';
  onSelect?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = 'grid',
  onSelect,
}) => {
  const { addToCart, setSelectedProductId, setCustomerScreen } = useAgrox();

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setCustomerScreen('product_detail');
    if (onSelect) onSelect();
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  if (layout === 'horizontal') {
    return (
      <div
        onClick={handleCardClick}
        className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Badge variant="organic" size="sm">
              {product.farming_method}
            </Badge>
            <span className="text-[10px] text-gray-400 font-medium truncate">
              {product.variety}
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#17231A] truncate group-hover:text-[#16803C] transition-colors">
            {product.name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-extrabold text-[#16803C]">
              ₹{product.price_per_unit} <span className="text-xs font-normal text-gray-500">/ {product.unit}</span>
            </span>
            <Rating rating={product.rating} showCount={false} size="sm" />
          </div>
        </div>
        <Button
          size="sm"
          variant="primary"
          onClick={handleAddToCart}
          className="shrink-0 p-2.5 rounded-xl"
        >
          <ShoppingBag className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 z-10">
          <Badge variant="organic" size="sm">
            {product.farming_method}
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2 z-10 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-xs">
          <Rating rating={product.rating} reviewsCount={product.reviews_count} size="sm" />
        </div>
      </div>

      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Farmer Header */}
          <div className="flex items-center gap-1.5 mb-1.5 text-xs text-gray-500">
            <img
              src={product.farmer_avatar}
              alt={product.farmer_name}
              className="w-4 h-4 rounded-full object-cover"
            />
            <span className="font-semibold text-[#17231A]/80 truncate">{product.farmer_name}</span>
            {product.farmer_verified && (
              <ShieldCheck className="w-3.5 h-3.5 text-[#16803C] shrink-0" />
            )}
          </div>

          <h4 className="text-sm font-bold text-[#17231A] line-clamp-1 group-hover:text-[#16803C] transition-colors">
            {product.name}
          </h4>

          <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="w-3 h-3 text-[#16803C]" />
              {product.farmer_location}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-400 font-medium block -mb-0.5">Price</span>
            <span className="text-base font-black text-[#16803C]">
              ₹{product.price_per_unit}
              <span className="text-xs font-normal text-gray-500">/{product.unit}</span>
            </span>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={handleAddToCart}
            leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
            className="rounded-xl px-3"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};
