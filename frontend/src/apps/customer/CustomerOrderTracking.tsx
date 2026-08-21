import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { ChevronLeft, MapPin, CheckCircle2, Circle, Clock, ShieldCheck, PhoneCall, Navigation } from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export const CustomerOrderTracking: React.FC = () => {
  const { orders, selectedOrderId, setCustomerScreen } = useAgrox();

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCustomerScreen('orders')}
          className="p-2 rounded-full bg-white border border-gray-200 text-[#17231A]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#17231A]">Order #{order.id}</h2>
            <Badge variant="success" size="sm">{order.order_status}</Badge>
          </div>
          <p className="text-xs text-gray-500">Placed on {new Date(order.created_at).toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Map Placeholder for Real-Time GPS Tracking */}
      <div className="relative overflow-hidden rounded-3xl h-48 bg-emerald-900 border border-gray-200 shadow-md">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
          alt="Live Map Tracking"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="bg-[#16803C] text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Navigation className="w-3 h-3 animate-spin" /> Live GPS Tracking Active
            </span>
            <span className="bg-white/90 text-[#17231A] text-[10px] font-extrabold px-2.5 py-1 rounded-full">
              ETA: 25 mins
            </span>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/50 text-[#17231A] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#16803C] text-white flex items-center justify-center font-bold text-xs">
                AG
              </div>
              <div>
                <h5 className="text-xs font-bold">Delivery Runner: Rahul Patil</h5>
                <p className="text-[10px] text-gray-500">MH 15 AG 8920 • Direct Cold Transport</p>
              </div>
            </div>
            <button className="p-2 rounded-xl bg-[#16803C] text-white hover:bg-[#126c32]">
              <PhoneCall className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modern 5-step Vertical Timeline */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <h4 className="text-sm font-extrabold text-[#17231A]">Delivery Timeline</h4>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
          {order.timeline.map((step, idx) => (
            <div key={idx} className="relative flex items-start justify-between">
              {/* Dot Icon */}
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${
                  step.completed
                    ? 'bg-[#16803C] text-white'
                    : step.current
                    ? 'bg-[#F4B942] text-[#17231A] animate-ping'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Circle className="w-2.5 h-2.5 fill-current" />
                )}
              </div>

              <div>
                <h5
                  className={`text-xs font-bold ${
                    step.completed || step.current ? 'text-[#17231A]' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </h5>
                <span className="text-[10px] text-gray-400 block">{step.timestamp || 'Pending'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Info & Line Items */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h4 className="text-sm font-extrabold text-[#17231A]">Items in this Shipment</h4>
        <div className="space-y-2 divide-y divide-gray-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h5 className="font-bold text-[#17231A]">{item.product_name}</h5>
                  <span className="text-gray-500">
                    {item.quantity} {item.unit} × ₹{item.unit_price}
                  </span>
                </div>
              </div>
              <span className="font-black text-[#16803C]">₹{item.total_price}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-gray-100 flex justify-between text-xs font-bold text-[#17231A]">
          <span>Fulfilled by Farmer</span>
          <span className="text-[#16803C] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> {order.farmer_name}
          </span>
        </div>
      </div>
    </div>
  );
};
