import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Layers, AlertTriangle, RefreshCw } from 'lucide-react';

export const FarmerInventory: React.FC = () => {
  const { products, updateProductStock } = useAgrox();

  const farmerProducts = products.filter((p) => p.farmer_id === 'farmer-1');

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#17231A]">Inventory Control</h2>
          <p className="text-xs text-gray-500">Live farm stock monitoring & batch updates</p>
        </div>
      </div>

      {/* Stock Cards */}
      <div className="space-y-3">
        {farmerProducts.map((p) => {
          const isLowStock = p.available_quantity_kg < 100;
          return (
            <div
              key={p.id}
              className={`p-4 rounded-3xl border transition-all flex items-center justify-between ${
                isLowStock ? 'bg-amber-50/60 border-amber-200' : 'bg-white border-gray-100 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-gray-100"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#17231A]">{p.name}</h4>
                    {isLowStock && (
                      <Badge variant="warning" size="sm" icon={<AlertTriangle className="w-3 h-3" />}>
                        Low Stock
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-medium block mt-0.5">
                    Price: ₹{p.price_per_unit} / {p.unit}
                  </span>
                  <span className="text-sm font-black text-[#16803C]">
                    {p.available_quantity_kg} {p.unit} available
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                onClick={() => {
                  const val = prompt(`Update stock for ${p.name} (${p.unit}):`, String(p.available_quantity_kg));
                  if (val && !isNaN(Number(val))) {
                    updateProductStock(p.id, Number(val));
                  }
                }}
              >
                Update
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
