import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { QuantitySelector } from '../../components/common/QuantitySelector';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';

export const CustomerCart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, setCustomerScreen } = useAgrox();

  if (cart.length === 0) {
    return (
      <div className="p-4 pb-20">
        <EmptyState
          title="Your Cart is Empty"
          description="Browse fresh harvest from local farmers and add them to your cart!"
          icon={<ShoppingBag className="w-12 h-12 text-[#16803C]" />}
          actionText="Shop Fresh Produce"
          onAction={() => setCustomerScreen('home')}
        />
      </div>
    );
  }

  // Group cart items by farmer
  const itemsByFarmer: { [farmerName: string]: typeof cart } = {};
  cart.forEach((item) => {
    const farmerName = item.product.farmer_name;
    if (!itemsByFarmer[farmerName]) {
      itemsByFarmer[farmerName] = [];
    }
    itemsByFarmer[farmerName].push(item);
  });

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price_per_unit * item.quantity,
    0
  );
  const deliveryFee = 25;
  const discount = subtotal > 200 ? 15 : 0;
  const total = subtotal + deliveryFee - discount;

  return (
    <div className="p-4 space-y-4 pb-28">
      <div>
        <h2 className="text-xl font-black text-[#17231A]">My Cart ({cart.length})</h2>
        <p className="text-xs text-gray-500">Grouped by verified local farm partners</p>
      </div>

      {/* Grouped Farmer Cards */}
      <div className="space-y-4">
        {Object.entries(itemsByFarmer).map(([farmerName, farmerItems]) => (
          <div key={farmerName} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100 text-xs font-extrabold text-[#17231A]">
              <ShieldCheck className="w-4 h-4 text-[#16803C]" />
              <span>Fulfilled from: <span className="text-[#16803C]">{farmerName}</span></span>
            </div>

            <div className="space-y-3">
              {farmerItems.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#17231A] truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-xs font-bold text-[#16803C] block">
                      ₹{item.product.price_per_unit} / {item.product.unit}
                    </span>
                    <div className="mt-1.5 flex items-center justify-between">
                      <QuantitySelector
                        size="sm"
                        quantity={item.quantity}
                        unit={item.product.unit}
                        onIncrease={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        onDecrease={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      />
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Payment Summary */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-2.5 text-xs">
        <h4 className="text-sm font-bold text-[#17231A] mb-2">Order Bill Summary</h4>
        <div className="flex justify-between text-gray-600">
          <span>Items Subtotal</span>
          <span className="font-bold text-[#17231A]">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Standard City Delivery</span>
          <span className="font-bold text-[#17231A]">₹{deliveryFee}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-[#16803C] font-bold">
            <span>Direct Farmer Discount</span>
            <span>-₹{discount}</span>
          </div>
        )}
        <div className="pt-2 border-t border-gray-100 flex justify-between text-sm font-extrabold text-[#17231A]">
          <span>To Pay</span>
          <span className="text-base font-black text-[#16803C]">₹{total}</span>
        </div>
      </div>

      {/* Fixed Checkout CTA */}
      <div className="fixed bottom-14 left-0 right-0 z-30 bg-white border-t border-gray-200 p-3 shadow-xl">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium block">Total Payable</span>
            <span className="text-lg font-black text-[#16803C]">₹{total}</span>
          </div>
          <Button
            size="lg"
            variant="primary"
            rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={() => setCustomerScreen('checkout')}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};
