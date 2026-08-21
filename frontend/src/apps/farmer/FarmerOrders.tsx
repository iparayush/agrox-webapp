import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { OrderCard } from '../../components/shared/OrderCard';
import { EmptyState } from '../../components/common/EmptyState';
import { ShoppingBag } from 'lucide-react';

export const FarmerOrders: React.FC = () => {
  const { orders, setFarmerScreen } = useAgrox();

  const [tab, setTab] = useState<'New' | 'Active' | 'Completed'>('New');

  const filtered = orders.filter((o) => {
    if (tab === 'New') return o.order_status === 'Placed';
    if (tab === 'Active') return ['Accepted', 'Preparing', 'Ready'].includes(o.order_status);
    return o.order_status === 'Delivered' || o.order_status === 'Cancelled';
  });

  return (
    <div className="p-4 space-y-4 pb-20">
      <div>
        <h2 className="text-xl font-black text-[#17231A]">Incoming Orders</h2>
        <p className="text-xs text-gray-500">Accept and fulfill direct city buyer orders</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-2xs">
        {(['New', 'Active', 'Completed'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === t
                ? 'bg-[#16803C] text-white shadow-xs'
                : 'text-gray-500 hover:text-[#17231A]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Orders Stream */}
      {filtered.length === 0 ? (
        <EmptyState
          title={`No ${tab} Orders`}
          description="New incoming orders will appear here automatically."
          icon={<ShoppingBag className="w-12 h-12 text-[#16803C]" />}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} role="farmer" />
          ))}
        </div>
      )}
    </div>
  );
};
