import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ChevronLeft, MapPin, User, CheckCircle2, PackageCheck, Truck, ShieldCheck, PhoneCall } from 'lucide-react';
import { OrderStatus } from '../../types';

export const FarmerOrderDetail: React.FC = () => {
  const { orders, selectedOrderId, setFarmerScreen, updateOrderStatus } = useAgrox();

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleAction = (status: OrderStatus) => {
    updateOrderStatus(order.id, status);
  };

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setFarmerScreen('orders')}
          className="p-2 rounded-full bg-white border border-gray-200 text-[#17231A]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#17231A]">Order #{order.id}</h2>
            <Badge variant="success" size="sm">{order.order_status}</Badge>
          </div>
          <p className="text-xs text-gray-500">Placed on {new Date(order.created_at).toLocaleString()}</p>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Customer Details</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16803C] flex items-center justify-center font-bold text-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-[#17231A]">{order.customer_name}</h5>
              <p className="text-xs text-gray-500">{order.customer_phone}</p>
            </div>
          </div>
          <button className="p-2 rounded-xl bg-[#16803C] text-white hover:bg-[#126c32]">
            <PhoneCall className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-2 border-t border-gray-100 text-xs text-gray-600 space-y-1">
          <span className="font-semibold text-gray-700 block flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#16803C]" /> Delivery Address
          </span>
          <p className="pl-4">
            {order.delivery_address.street}, {order.delivery_address.city} - {order.delivery_address.pincode}
          </p>
        </div>
      </div>

      {/* Products Ordered */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Produce Items</h4>
        <div className="space-y-2.5 divide-y divide-gray-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  className="w-12 h-12 rounded-2xl object-cover border border-gray-100"
                />
                <div>
                  <h5 className="text-xs font-bold text-[#17231A]">{item.product_name}</h5>
                  <span className="text-[11px] text-gray-500">
                    {item.quantity} {item.unit} × ₹{item.unit_price}
                  </span>
                </div>
              </div>
              <span className="text-sm font-black text-[#16803C]">₹{item.total_price}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-gray-100 flex justify-between text-sm font-black text-[#17231A]">
          <span>Total Order Value</span>
          <span className="text-base text-[#16803C]">₹{order.total_amount}</span>
        </div>
      </div>

      {/* Order Status Action Workflow */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Update Order Status</h4>
        <div className="grid grid-cols-3 gap-2">
          <Button
            size="sm"
            variant={order.order_status === 'Accepted' ? 'primary' : 'outline'}
            onClick={() => handleAction('Accepted')}
          >
            1. Accept
          </Button>
          <Button
            size="sm"
            variant={order.order_status === 'Preparing' ? 'yellow' : 'outline'}
            onClick={() => handleAction('Preparing')}
          >
            2. Preparing
          </Button>
          <Button
            size="sm"
            variant={order.order_status === 'Ready' ? 'fresh' : 'outline'}
            onClick={() => handleAction('Ready')}
          >
            3. Ready
          </Button>
        </div>
      </div>
    </div>
  );
};
