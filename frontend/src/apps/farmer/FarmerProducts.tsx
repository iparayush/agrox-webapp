import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Plus, Edit3, Layers, Calendar, CheckCircle2 } from 'lucide-react';

export const FarmerProducts: React.FC = () => {
  const { products, setFarmerScreen, setSelectedProductId, updateProductStock } = useAgrox();

  const farmerProducts = products.filter((p) => p.farmer_id === 'farmer-1');

  return (
    <div className="p-4 space-y-4 pb-24 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#17231A]">My Listed Products</h2>
          <p className="text-xs text-gray-500">Manage active harvest listings & stock levels</p>
        </div>
        <Button
          size="sm"
          variant="yellow"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setFarmerScreen('add_product')}
        >
          Add Product
        </Button>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {farmerProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-white p-3.5 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-3.5"
          >
            <img
              src={prod.image_url}
              alt={prod.name}
              className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-gray-100"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="organic" size="sm">
                  {prod.farming_method}
                </Badge>
                {prod.is_active ? (
                  <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                    Active
                  </Badge>
                ) : (
                  <Badge variant="neutral" size="sm">
                    Draft
                  </Badge>
                )}
              </div>

              <h4 className="text-sm font-bold text-[#17231A] truncate">{prod.name}</h4>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-extrabold text-[#16803C]">
                  ₹{prod.price_per_unit} / {prod.unit}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  • {prod.available_quantity_kg} {prod.unit} stock
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setSelectedProductId(prod.id);
                    setFarmerScreen('add_product');
                  }}
                  className="py-1 px-2.5 text-xs rounded-xl"
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Layers className="w-3.5 h-3.5" />}
                  onClick={() => {
                    const newQty = prompt(`Update stock for ${prod.name} (kg):`, String(prod.available_quantity_kg));
                    if (newQty && !isNaN(Number(newQty))) {
                      updateProductStock(prod.id, Number(newQty));
                    }
                  }}
                  className="py-1 px-2.5 text-xs rounded-xl text-gray-700 hover:bg-gray-100"
                >
                  Stock
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setFarmerScreen('add_product')}
        className="fixed bottom-20 right-5 z-40 p-4 rounded-full bg-[#16803C] text-white shadow-2xl hover:bg-[#126c32] transition-all flex items-center justify-center border-2 border-white ring-4 ring-[#16803C]/20"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>
    </div>
  );
};
