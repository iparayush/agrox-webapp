import React, { useEffect, useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Loader2, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';

export const AdminProducts: React.FC = () => {
  const { addToast } = useAgrox();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getProducts();
      if (res.success && res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.warn('[AdminProducts] Fetch failed:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleStatus = async (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setUpdatingId(productId);
    try {
      const res = await api.admin.updateProductStatus(productId, newStatus);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, status: newStatus, is_approved: newStatus === 'ACTIVE' }
              : p
          )
        );
        addToast(`Product listing set to ${newStatus}`, 'success');
      } else {
        addToast(res.message || 'Failed to update product status', 'error');
      }
    } catch {
      addToast('Network error updating product', 'error');
    }
    setUpdatingId(null);
  };

  const columns = [
    {
      header: 'Produce Listing',
      cell: (r: any) => (
        <div className="flex items-center gap-2.5">
          <img src={r.image_url} alt={r.name} className="w-10 h-10 rounded-xl object-cover border border-gray-100" />
          <div>
            <span className="font-bold text-[#17231A] block">{r.name}</span>
            <span className="text-[11px] text-gray-500 font-medium">{r.variety}</span>
          </div>
        </div>
      ),
    },
    { header: 'Farmer Partner', accessorKey: 'farmer_name' as const },
    { header: 'Category', accessorKey: 'category' as const },
    {
      header: 'Price / Unit',
      cell: (r: any) => (
        <span className="font-black text-[#16803C]">
          ₹{r.price_per_unit} / {r.unit}
        </span>
      ),
    },
    {
      header: 'Stock Inventory',
      cell: (r: any) => (
        <span className="font-bold text-gray-700">
          {r.available_quantity_kg} {r.unit}
        </span>
      ),
    },
    {
      header: 'Moderation',
      cell: (r: any) => (
        <Badge variant={r.status === 'ACTIVE' ? 'success' : 'warning'} size="sm">
          {r.status === 'ACTIVE' ? 'Active / Live' : 'Inactive / Draft'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (r: any) => {
        const isActive = r.status === 'ACTIVE';
        const isBusy = updatingId === r.id;
        return (
          <Button
            size="sm"
            variant={isActive ? 'outline' : 'fresh'}
            onClick={() => handleToggleStatus(r.id, r.status)}
            disabled={isBusy}
            className={`text-xs py-1 px-3 ${isActive ? 'text-gray-600 border-gray-200 hover:bg-gray-50' : ''}`}
          >
            {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isActive ? 'Deactivate' : 'Approve & List'}
          </Button>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#17231A]">Product Catalog Moderation</h2>
          <p className="text-xs text-gray-500">Live quality audit and catalog moderation for fresh harvest</p>
        </div>
        <button
          onClick={fetchProducts}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-2xs transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#16803C] ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 bg-white rounded-3xl border border-gray-200 text-center text-gray-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#16803C]" />
          <span>Fetching live produce catalog...</span>
        </div>
      ) : (
        <DataTable columns={columns} data={products} keyExtractor={(r) => r.id} />
      )}
    </div>
  );
};
