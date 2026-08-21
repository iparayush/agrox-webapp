import React from 'react';
import { ProductCategory } from '../../types';
import { useAgrox } from '../../context/AgroxContext';

interface CategoryCardProps {
  category: ProductCategory;
  imageUrl: string;
  itemCount?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  imageUrl,
  itemCount = 24,
}) => {
  const { setSelectedCategory, setCustomerScreen } = useAgrox();

  const handleClick = () => {
    setSelectedCategory(category);
    setCustomerScreen('search');
  };

  return (
    <div
      onClick={handleClick}
      className="relative overflow-hidden rounded-3xl aspect-4/3 cursor-pointer group shadow-xs hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <img
        src={imageUrl}
        alt={category}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3.5 text-white">
        <span className="text-sm font-extrabold tracking-wide">{category}</span>
        <span className="text-[11px] text-gray-300 font-medium">{itemCount}+ items</span>
      </div>
    </div>
  );
};
