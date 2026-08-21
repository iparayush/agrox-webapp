import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { OrderCard } from '../../components/shared/OrderCard';
import { EmptyState } from '../../components/common/EmptyState';
import { ShoppingBag } from 'lucide-react';

export const CustomerOrders: React.FC = () => {
  const { orders, setCustomerScreen } = useAgrox();
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed' | 'Cancelled'>('Active');

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'Active') return ['Placed', 'Accepted', 'Preparing', 'Ready'].includes(o.order_status);
    if (activeTab === 'Completed') return o.order_status === 'Delivered';
    return o.order_status === 'Cancelled';
  });

  return (
    <div className="p-4 space-y-4 pb-20">
      <div>
        <h2 className="text-xl font-black text-[#17231A]">My Orders</h2>
        <p className="text-xs text-gray-500">Track current and past farm produce deliveries</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-2xs">
        {(['Active', 'Completed', 'Cancelled'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === tab
                ? 'bg-[#16803C] text-white shadow-xs'
                : 'text-gray-500 hover:text-[#17231A]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Order Cards List */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          title={`No ${activeTab} Orders`}
          description="You don't have any orders in this category right now."
          icon={<ShoppingBag className="w-12 h-12 text-[#16803C]" />}
          actionText="Shop Fresh Produce"
          onAction={() => setCustomerScreen('home')}
        />
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} role="customer" />
          ))}
        </div>
      )}
    </div>
  );
};
