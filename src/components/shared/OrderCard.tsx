import React from 'react';
import { Order, OrderStatus } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ChevronRight, Calendar, PackageCheck, Truck, Clock } from 'lucide-react';
import { useAgrox } from '../../context/AgroxContext';

interface OrderCardProps {
  order: Order;
  role?: 'customer' | 'farmer' | 'admin';
  onSelect?: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  role = 'customer',
  onSelect,
}) => {
  const { setSelectedOrderId, setCustomerScreen, setFarmerScreen, updateOrderStatus } = useAgrox();

  const handleCardClick = () => {
    setSelectedOrderId(order.id);
    if (role === 'farmer') {
      setFarmerScreen('order_detail');
    } else {
      setCustomerScreen('order_tracking');
    }
    if (onSelect) onSelect();
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Placed':
        return <Badge variant="warning" icon={<Clock className="w-3 h-3" />}>Order Placed</Badge>;
      case 'Accepted':
        return <Badge variant="info" icon={<PackageCheck className="w-3 h-3" />}>Farmer Accepted</Badge>;
      case 'Preparing':
        return <Badge variant="warning">Preparing</Badge>;
      case 'Ready':
        return <Badge variant="success">Ready for Pickup</Badge>;
      case 'Delivered':
        return <Badge variant="verified" icon={<Truck className="w-3 h-3" />}>Delivered</Badge>;
      case 'Cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs hover:shadow-md transition-all cursor-pointer group mb-3"
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
        <div>
          <span className="text-xs text-gray-400 font-medium block">Order ID</span>
          <span className="text-sm font-extrabold text-[#17231A]">{order.id}</span>
        </div>
        <div>{getStatusBadge(order.order_status)}</div>
      </div>

      <div className="space-y-2 mb-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <img
              src={item.image_url}
              alt={item.product_name}
              className="w-10 h-10 rounded-xl object-cover border border-gray-100"
            />
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-[#17231A] truncate">{item.product_name}</h5>
              <p className="text-[11px] text-gray-500">
                {item.quantity} {item.unit} × ₹{item.unit_price}
              </p>
            </div>
            <span className="text-xs font-extrabold text-[#17231A]">₹{item.total_price}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
        <div>
          <span className="text-gray-400">Total Amount: </span>
          <span className="text-sm font-black text-[#16803C]">₹{order.total_amount}</span>
        </div>
        <div className="flex items-center gap-2">
          {role === 'farmer' && order.order_status === 'Placed' && (
            <Button
              size="sm"
              variant="fresh"
              onClick={(e) => {
                e.stopPropagation();
                updateOrderStatus(order.id, 'Accepted');
              }}
            >
              Accept
            </Button>
          )}
          <Button size="sm" variant="ghost" className="text-[#16803C] hover:bg-[#16803C]/10 gap-1">
            View Order <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
