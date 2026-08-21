import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { ChevronLeft, Upload, Sparkles, CheckCircle2 } from 'lucide-react';
import { ProductCategory, FarmingMethod } from '../../types';

export const FarmerAddProduct: React.FC = () => {
  const { addProduct, setFarmerScreen } = useAgrox();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Vegetables');
  const [variety, setVariety] = useState('');
  const [price, setPrice] = useState('32');
  const [unit, setUnit] = useState('kg');
  const [quantity, setQuantity] = useState('200');
  const [minOrder, setMinOrder] = useState('1');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [farmingMethod, setFarmingMethod] = useState<FarmingMethod>('Organic');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: name || 'Fresh Organic Produce',
      category,
      variety: variety || 'Local Premium',
      price_per_unit: Number(price),
      unit,
      available_quantity_kg: Number(quantity),
      min_order_qty: Number(minOrder),
      harvest_date: harvestDate,
      farming_method: farmingMethod,
      description: description || 'Freshly harvested from AGROX verified local farm.',
      image_url: imageUrl,
    });
    setFarmerScreen('products');
  };

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setFarmerScreen('products')}
          className="p-2 rounded-full bg-white border border-gray-200 text-[#17231A]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-black text-[#17231A]">Add Product</h2>
          <p className="text-xs text-gray-500">List new fresh harvest for city buyers</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
        {/* Product Image Uploader */}
        <div>
          <label className="block text-xs font-semibold text-[#17231A]/80 uppercase tracking-wider mb-1.5">
            Product Photography
          </label>
          <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer group">
            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover group-hover:opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white gap-2 font-bold text-xs">
              <Upload className="w-4 h-4" /> Change Image
            </div>
          </div>
        </div>

        <Input
          label="Product Name"
          type="text"
          placeholder="e.g. Fresh Red Onion"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            options={[
              { value: 'Vegetables', label: 'Vegetables' },
              { value: 'Fruits', label: 'Fruits' },
              { value: 'Grains', label: 'Grains' },
              { value: 'Pulses', label: 'Pulses' },
              { value: 'Spices', label: 'Spices' },
              { value: 'Organic', label: 'Organic' },
              { value: 'Seeds', label: 'Seeds' },
              { value: 'Others', label: 'Others' },
            ]}
          />

          <Input
            label="Variety / Grade"
            type="text"
            placeholder="e.g. Nashik Red Grade A"
            value={variety}
            onChange={(e) => setVariety(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Price per Unit (₹)"
            type="number"
            placeholder="28"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <Select
            label="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            options={[
              { value: 'kg', label: 'Kilogram (kg)' },
              { value: 'quintal', label: 'Quintal' },
              { value: 'crate', label: 'Crate' },
              { value: 'pack', label: 'Pack' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Available Stock (kg)"
            type="number"
            placeholder="250"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />

          <Input
            label="Minimum Order Qty"
            type="number"
            placeholder="1"
            value={minOrder}
            onChange={(e) => setMinOrder(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Harvest Date"
            type="date"
            value={harvestDate}
            onChange={(e) => setHarvestDate(e.target.value)}
            required
          />

          <Select
            label="Farming Method"
            value={farmingMethod}
            onChange={(e) => setFarmingMethod(e.target.value as FarmingMethod)}
            options={[
              { value: 'Organic', label: 'Organic (Zero Chemical)' },
              { value: 'Natural', label: 'Natural Farming' },
              { value: 'Standard', label: 'Standard Cultivation' },
              { value: 'Hydroponic', label: 'Hydroponic' },
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#17231A]/80 uppercase tracking-wider mb-1.5">
            Product Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe soil type, taste profile, and harvest conditions..."
            className="w-full bg-white text-[#17231A] text-sm font-medium rounded-xl border border-gray-200 p-3 focus:outline-none focus:border-[#16803C] focus:ring-2 focus:ring-[#16803C]/20"
          />
        </div>

        <Button
          fullWidth
          size="lg"
          variant="primary"
          type="submit"
          leftIcon={<Sparkles className="w-5 h-5" />}
        >
          Publish Product Live
        </Button>
      </form>
    </div>
  );
};
