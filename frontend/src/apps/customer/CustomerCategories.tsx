import React from 'react';
import { CategoryCard } from '../../components/shared/CategoryCard';
import { ProductCategory } from '../../types';

export const CustomerCategories: React.FC = () => {
  const categories: { category: ProductCategory; image: string; count: number }[] = [
    {
      category: 'Vegetables',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      count: 48,
    },
    {
      category: 'Fruits',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      count: 32,
    },
    {
      category: 'Grains',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      count: 26,
    },
    {
      category: 'Pulses',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      count: 19,
    },
    {
      category: 'Spices',
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      count: 41,
    },
    {
      category: 'Organic',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      count: 55,
    },
    {
      category: 'Seeds',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
      count: 15,
    },
    {
      category: 'Others',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      count: 12,
    },
  ];

  return (
    <div className="p-4 space-y-4 pb-20">
      <div>
        <h2 className="text-xl font-black text-[#17231A]">Product Categories</h2>
        <p className="text-xs text-gray-500">Explore farm produce organized by type</p>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.category}
            category={cat.category}
            imageUrl={cat.image}
            itemCount={cat.count}
          />
        ))}
      </div>
    </div>
  );
};
