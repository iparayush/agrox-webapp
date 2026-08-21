import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { OrderCard } from '../../components/shared/OrderCard';
import { Button } from '../../components/common/Button';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Package,
  PlusCircle,
  BarChart3,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { setFarmerScreen, orders, products } = useAgrox();

  const pendingOrders = orders.filter((o) => o.order_status === 'Placed');
  const totalStockKg = products.reduce((acc, p) => acc + p.available_quantity_kg, 0);

  return (
    <div className="p-4 space-y-5 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-xl font-black text-[#17231A]">Good Morning, Ramesh 👋</h2>
            <ShieldCheck className="w-4 h-4 text-[#16803C]" />
          </div>
          <p className="text-xs text-gray-500">Niphad Farm Portal • Certified Organic</p>
        </div>
        <Button
          size="sm"
          variant="yellow"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={() => setFarmerScreen('add_product')}
        >
          Add Product
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Today's Sales */}
        <div className="bg-gradient-to-br from-[#16803C] to-[#3FAE5A] text-white p-4 rounded-3xl shadow-md">
          <div className="flex items-center justify-between text-white/80 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Sales</span>
            <TrendingUp className="w-4 h-4 text-[#F4B942]" />
          </div>
          <span className="text-2xl font-black text-white">₹4,280</span>
          <span className="text-[10px] text-emerald-100 font-medium block mt-1">+14% from yesterday</span>
        </div>

        {/* Orders */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#16803C]" />
          </div>
          <span className="text-2xl font-black text-[#17231A]">18</span>
          <span className="text-[10px] text-gray-500 font-medium block mt-1">13 fulfilled today</span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-[#F4B942]" />
          </div>
          <span className="text-2xl font-black text-[#F4B942]">{pendingOrders.length || 5}</span>
          <span className="text-[10px] text-amber-700 font-medium block mt-1">Action required</span>
        </div>

        {/* Total Stock */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Active Stock</span>
            <Package className="w-4 h-4 text-[#16803C]" />
          </div>
          <span className="text-2xl font-black text-[#17231A]">{totalStockKg} kg</span>
          <span className="text-[10px] text-gray-500 font-medium block mt-1">Across 7 produce items</span>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quick Actions</h4>
        <div className="grid grid-cols-4 gap-2 text-center">
          <button
            onClick={() => setFarmerScreen('add_product')}
            className="p-3 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:bg-emerald-50 transition-colors flex flex-col items-center gap-1.5"
          >
            <div className="p-2 rounded-xl bg-emerald-100 text-[#16803C]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#17231A]">Add Produce</span>
          </button>

          <button
            onClick={() => setFarmerScreen('orders')}
            className="p-3 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:bg-emerald-50 transition-colors flex flex-col items-center gap-1.5"
          >
            <div className="p-2 rounded-xl bg-amber-100 text-[#F4B942]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#17231A]">Orders</span>
          </button>

          <button
            onClick={() => setFarmerScreen('inventory')}
            className="p-3 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:bg-emerald-50 transition-colors flex flex-col items-center gap-1.5"
          >
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#17231A]">Inventory</span>
          </button>

          <button
            onClick={() => setFarmerScreen('earnings')}
            className="p-3 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:bg-emerald-50 transition-colors flex flex-col items-center gap-1.5"
          >
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#17231A]">Earnings</span>
          </button>
        </div>
      </div>

      {/* Recent Orders Stream */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-extrabold text-[#17231A]">Recent Incoming Orders</h3>
          <button
            onClick={() => setFarmerScreen('orders')}
            className="text-xs font-bold text-[#16803C] hover:underline"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {orders.slice(0, 2).map((order) => (
            <OrderCard key={order.id} order={order} role="farmer" />
          ))}
        </div>
      </div>
    </div>
  );
};
