import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Button } from '../../components/common/Button';
import { MapPin, Truck, Zap, Clock, ChevronLeft, ArrowRight } from 'lucide-react';

export const CustomerCheckout: React.FC = () => {
  const {
    cart,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    setCustomerScreen,
  } = useAgrox();

  const [deliveryType, setDeliveryType] = useState<'Standard' | 'Express' | 'Scheduled'>('Standard');

  const chosenAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const subtotal = cart.reduce((acc, item) => acc + item.product.price_per_unit * item.quantity, 0);
  const deliveryFee = deliveryType === 'Express' ? 40 : deliveryType === 'Scheduled' ? 20 : 25;
  const discount = subtotal > 200 ? 15 : 0;
  const total = subtotal + deliveryFee - discount;

  return (
    <div className="p-4 space-y-5 pb-28">
      {/* Top Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCustomerScreen('cart')}
          className="p-2 rounded-full bg-white border border-gray-200 text-[#17231A]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-black text-[#17231A]">Checkout Order</h2>
          <p className="text-xs text-gray-500">Confirm delivery address & timing slot</p>
        </div>
      </div>

      {/* Delivery Address Card */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#16803C]" /> Delivery Address
          </h4>
          <span className="text-xs font-bold text-[#16803C] hover:underline cursor-pointer">
            + Add New
          </span>
        </div>

        {addresses.map((addr) => (
          <div
            key={addr.id}
            onClick={() => setSelectedAddressId(addr.id)}
            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
              selectedAddressId === addr.id
                ? 'border-[#16803C] bg-emerald-50/50'
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <input
              type="radio"
              checked={selectedAddressId === addr.id}
              onChange={() => setSelectedAddressId(addr.id)}
              className="mt-1 accent-[#16803C]"
            />
            <div>
              <h5 className="text-sm font-bold text-[#17231A]">{addr.name}</h5>
              <p className="text-xs text-gray-600 mt-0.5">{addr.street}, {addr.city} - {addr.pincode}</p>
              <span className="text-[11px] text-gray-400 font-medium block mt-1">{addr.phone}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Speed Selector */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1">
          <Truck className="w-3.5 h-3.5 text-[#16803C]" /> Choose Delivery Mode
        </h4>

        <div className="grid grid-cols-3 gap-2">
          <div
            onClick={() => setDeliveryType('Standard')}
            className={`p-3 rounded-2xl border-2 text-center cursor-pointer transition-all ${
              deliveryType === 'Standard'
                ? 'border-[#16803C] bg-emerald-50 text-[#16803C] font-bold'
                : 'border-gray-100 text-gray-600'
            }`}
          >
            <Truck className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs block font-bold">Standard</span>
            <span className="text-[10px] text-gray-500">₹25 • Today</span>
          </div>

          <div
            onClick={() => setDeliveryType('Express')}
            className={`p-3 rounded-2xl border-2 text-center cursor-pointer transition-all ${
              deliveryType === 'Express'
                ? 'border-[#16803C] bg-emerald-50 text-[#16803C] font-bold'
                : 'border-gray-100 text-gray-600'
            }`}
          >
            <Zap className="w-5 h-5 mx-auto mb-1 text-[#F4B942]" />
            <span className="text-xs block font-bold">Express</span>
            <span className="text-[10px] text-gray-500">₹40 • 2 Hours</span>
          </div>

          <div
            onClick={() => setDeliveryType('Scheduled')}
            className={`p-3 rounded-2xl border-2 text-center cursor-pointer transition-all ${
              deliveryType === 'Scheduled'
                ? 'border-[#16803C] bg-emerald-50 text-[#16803C] font-bold'
                : 'border-gray-100 text-gray-600'
            }`}
          >
            <Clock className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs block font-bold">Scheduled</span>
            <span className="text-[10px] text-gray-500">₹20 • Tomorrow</span>
          </div>
        </div>
      </div>

      {/* Order Items Summary */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-2 text-xs">
        <h4 className="text-sm font-bold text-[#17231A] mb-2">Order Items ({cart.length})</h4>
        {cart.map((item) => (
          <div key={item.product.id} className="flex justify-between items-center py-1">
            <span className="text-gray-700 font-medium">
              {item.product.name} ({item.quantity} {item.product.unit})
            </span>
            <span className="font-bold text-[#17231A]">₹{item.product.price_per_unit * item.quantity}</span>
          </div>
        ))}
        <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm font-extrabold">
          <span>Total Order Price</span>
          <span className="text-lg font-black text-[#16803C]">₹{total}</span>
        </div>
      </div>

      {/* Fixed Footer CTA */}
      <div className="fixed bottom-14 left-0 right-0 z-30 bg-white border-t border-gray-200 p-3 shadow-xl">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium block">Total to Pay</span>
            <span className="text-xl font-black text-[#16803C]">₹{total}</span>
          </div>
          <Button
            size="lg"
            variant="primary"
            rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={() => setCustomerScreen('payment')}
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};
