import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Save, ShieldCheck, Globe, CreditCard, Bell, Lock } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { addToast } = useAgrox();

  const [platformName, setPlatformName] = useState('AGROX — Farmer to City Marketplace');
  const [supportPhone, setSupportPhone] = useState('1800-FARM-CITY');
  const [autoApproveProducts, setAutoApproveProducts] = useState(false);
  const [upiGatewayEnabled, setUpiGatewayEnabled] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Marketplace settings updated successfully!', 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-black text-[#17231A]">System Configuration & Security</h2>
        <p className="text-xs text-gray-500">Configure marketplace parameters, payment gateways & security policies</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-[#17231A] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#16803C]" /> General Platform Settings
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Platform Name"
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
            />
            <Input
              label="Customer Support Helpline"
              type="text"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Marketplace Settings */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-[#17231A] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#16803C]" /> Marketplace & Moderation Rules
          </h3>
          <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
            <div>
              <h5 className="font-bold text-[#17231A]">Auto-Approve Farmer Product Listings</h5>
              <p className="text-gray-500">When enabled, newly submitted produce goes live immediately without manual admin review.</p>
            </div>
            <input
              type="checkbox"
              checked={autoApproveProducts}
              onChange={(e) => setAutoApproveProducts(e.target.checked)}
              className="w-4 h-4 accent-[#16803C] rounded-md"
            />
          </div>
        </div>

        {/* Payment Gateway */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-[#17231A] flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#16803C]" /> Payment Gateway Integration
          </h3>
          <div className="flex items-center justify-between text-xs py-2">
            <div>
              <h5 className="font-bold text-[#17231A]">Enable Razorpay / UPI Instant Payouts</h5>
              <p className="text-gray-500">Allow instant direct bank settlements to verified farmers upon order pickup.</p>
            </div>
            <input
              type="checkbox"
              checked={upiGatewayEnabled}
              onChange={(e) => setUpiGatewayEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#16803C] rounded-md"
            />
          </div>
        </div>

        {/* Security & Audit */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-[#17231A] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#16803C]" /> Security & Audit Logs
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="font-medium text-gray-700">Admin Role Permissions</span>
              <span className="font-bold text-[#16803C]">Full Access</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="font-medium text-gray-700">Recent Audit Action</span>
              <span className="text-gray-500">Approved Ramesh Patil land 7/12 extract</span>
            </div>
          </div>
        </div>

        <Button
          size="lg"
          variant="primary"
          type="submit"
          leftIcon={<Save className="w-5 h-5" />}
        >
          Save Configuration Changes
        </Button>
      </form>
    </div>
  );
};
