import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Button } from '../../components/common/Button';
import { ChevronLeft, ShieldCheck, QrCode, CreditCard, Landmark, CheckCircle2, Lock } from 'lucide-react';
import { PaymentMethod } from '../../types';

export const CustomerPayment: React.FC = () => {
  const { cart, placeOrder, setCustomerScreen } = useAgrox();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('ayushi@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price_per_unit * item.quantity, 0);
  const deliveryFee = 25;
  const discount = subtotal > 200 ? 15 : 0;
  const total = subtotal + deliveryFee - discount;

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const createdOrder = placeOrder(paymentMethod, 'Standard');
      if (createdOrder) {
        setCustomerScreen('order_tracking');
      }
    }, 1200);
  };

  return (
    <div className="p-4 space-y-5 pb-28">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCustomerScreen('checkout')}
          className="p-2 rounded-full bg-white border border-gray-200 text-[#17231A]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-black text-[#17231A]">Choose Payment Method</h2>
          <p className="text-xs text-gray-500">100% Encrypted & Safe Payments</p>
        </div>
      </div>

      {/* Security Indicator */}
      <div className="flex items-center gap-3 bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
        <ShieldCheck className="w-6 h-6 text-[#16803C] shrink-0" />
        <div>
          <h5 className="font-bold">AGROX Direct Payment Protection</h5>
          <p className="text-[11px] text-emerald-800">Your funds are held securely until delivery confirmation.</p>
        </div>
      </div>

      {/* Payment Options */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        {/* UPI Option */}
        <div
          onClick={() => setPaymentMethod('UPI')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            paymentMethod === 'UPI'
              ? 'border-[#16803C] bg-emerald-50/40'
              : 'border-gray-100 hover:border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-[#16803C] rounded-xl">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#17231A]">UPI / Google Pay / PhonePe</h4>
                <p className="text-xs text-gray-500">Instant zero fee payment</p>
              </div>
            </div>
            <input type="radio" checked={paymentMethod === 'UPI'} readOnly className="accent-[#16803C]" />
          </div>

          {paymentMethod === 'UPI' && (
            <div className="mt-3 pt-3 border-t border-emerald-100/80">
              <label className="text-xs font-semibold text-gray-700 block mb-1">UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
              />
            </div>
          )}
        </div>

        {/* Card Option */}
        <div
          onClick={() => setPaymentMethod('Card')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            paymentMethod === 'Card'
              ? 'border-[#16803C] bg-emerald-50/40'
              : 'border-gray-100 hover:border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-[#F4B942] rounded-xl">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#17231A]">Credit / Debit Card</h4>
                <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
              </div>
            </div>
            <input type="radio" checked={paymentMethod === 'Card'} readOnly className="accent-[#16803C]" />
          </div>
        </div>

        {/* Net Banking Option */}
        <div
          onClick={() => setPaymentMethod('Net Banking')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            paymentMethod === 'Net Banking'
              ? 'border-[#16803C] bg-emerald-50/40'
              : 'border-gray-100 hover:border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#17231A]">Net Banking</h4>
                <p className="text-xs text-gray-500">SBI, HDFC, ICICI, Axis & others</p>
              </div>
            </div>
            <input type="radio" checked={paymentMethod === 'Net Banking'} readOnly className="accent-[#16803C]" />
          </div>
        </div>
      </div>

      {/* Fixed Pay Button */}
      <div className="fixed bottom-14 left-0 right-0 z-30 bg-white border-t border-gray-200 p-3 shadow-xl">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium block">Total Payable</span>
            <span className="text-xl font-black text-[#16803C]">₹{total}</span>
          </div>
          <Button
            size="lg"
            variant="primary"
            isLoading={isProcessing}
            leftIcon={<Lock className="w-4 h-4" />}
            onClick={handlePayNow}
          >
            Pay Now ₹{total}
          </Button>
        </div>
      </div>
    </div>
  );
};
