import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { SearchInput } from '../../components/common/SearchInput';
import { ProductCard } from '../../components/shared/ProductCard';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { Filter, History, Flame, SlidersHorizontal } from 'lucide-react';
import { ProductCategory } from '../../types';

export const CustomerSearch: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory } = useAgrox();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'All'>(selectedCategory);
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [onlyOrganic, setOnlyOrganic] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const recentSearches = ['Nashik Red Onion', 'Organic Tomatoes', 'Alphonso Mango', 'Turmeric'];
  const popularTags = ['Vegetables', 'Organic', 'Fruits', 'Grains', 'Under ₹50'];

  const filteredProducts = products.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.farmer_name.toLowerCase().includes(query.toLowerCase());

    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesPrice = p.price_per_unit <= maxPrice;
    const matchesOrganic = !onlyOrganic || p.farming_method === 'Organic';

    return matchesQuery && matchesCategory && matchesPrice && matchesOrganic;
  });

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Top Search Bar */}
      <div className="flex items-center gap-2">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search vegetables, fruits, farmers..."
        />
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className={`p-3 rounded-2xl border transition-colors ${
            showFilters
              ? 'bg-[#16803C] text-white border-[#16803C]'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Expandable Filter Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-3 animate-slide-down">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter Results
            </h4>
            <button
              onClick={() => {
                setActiveCategory('All');
                setMaxPrice(300);
                setOnlyOrganic(false);
              }}
              className="text-xs font-bold text-[#16803C] hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <span className="text-xs font-semibold text-gray-700 block mb-1.5">Category</span>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Vegetables', 'Fruits', 'Grains', 'Spices', 'Organic'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as any)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-[#16803C] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1">
              <span>Max Price</span>
              <span className="text-[#16803C] font-black">₹{maxPrice} / kg</span>
            </div>
            <input
              type="range"
              min="20"
              max="300"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#16803C]"
            />
          </div>

          {/* Farming Method Filter */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-gray-700">Organic Only</span>
            <input
              type="checkbox"
              checked={onlyOrganic}
              onChange={(e) => setOnlyOrganic(e.target.checked)}
              className="w-4 h-4 accent-[#16803C] rounded-md"
            />
          </div>
        </div>
      )}

      {/* Recent & Popular Tags when no query */}
      {!query && (
        <div className="space-y-4 pt-2">
          {/* Recent Searches */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <History className="w-3.5 h-3.5" /> Recent Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-medium text-[#17231A] hover:border-[#16803C] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#F4B942]" /> Popular Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="bg-[#F7F9F5] border border-gray-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#16803C] hover:bg-[#16803C] hover:text-white transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-extrabold text-[#17231A]">
            {query ? `Search results for "${query}"` : 'All Products'}
          </h3>
          <span className="text-xs text-gray-500 font-medium">
            {filteredProducts.length} items found
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState
            title="No matching produce found"
            description="Try searching with a different term or clearing your filters."
            onAction={() => {
              setQuery('');
              setActiveCategory('All');
            }}
            actionText="Clear Filters"
          />
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
