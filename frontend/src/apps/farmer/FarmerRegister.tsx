import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { User, Phone, Mail, MapPin, Sprout, ArrowRight } from 'lucide-react';

export const FarmerRegister: React.FC = () => {
  const { setFarmerScreen } = useAgrox();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [farmSize, setFarmSize] = useState('');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setFarmerScreen('verification');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between p-6 bg-white">
      <div className="pt-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#16803C] text-white flex items-center justify-center font-bold">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#17231A]">Start Selling on AGROX</h2>
            <p className="text-xs text-gray-500">Register your farm & access 1,00,000+ city buyers</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleContinue} className="space-y-3.5">
          <Input
            label="Farmer Name"
            type="text"
            placeholder="e.g. Ramesh Anandrao Patil"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="Mobile Number"
            type="tel"
            placeholder="+91 98765 43210"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            leftIcon={<Phone className="w-4 h-4" />}
            required
          />

          <Input
            label="Email Address (Optional)"
            type="email"
            placeholder="farmer@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Village"
              type="text"
              placeholder="e.g. Niphad"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              leftIcon={<MapPin className="w-4 h-4" />}
              required
            />
            <Input
              label="District"
              type="text"
              placeholder="e.g. Nashik"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              leftIcon={<MapPin className="w-4 h-4" />}
              required
            />
          </div>

          <Input
            label="Farm Size (Acres)"
            type="number"
            placeholder="e.g. 14.5"
            value={farmSize}
            onChange={(e) => setFarmSize(e.target.value)}
            leftIcon={<Sprout className="w-4 h-4" />}
            required
          />

          <Button fullWidth size="lg" variant="primary" type="submit" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Continue to Document Verification
          </Button>
        </form>
      </div>

      <div className="text-center pb-4 pt-6 border-t border-gray-100">
        <span className="text-xs text-gray-500">Already registered as a seller? </span>
        <button
          onClick={() => setFarmerScreen('login')}
          className="text-xs font-bold text-[#16803C] hover:underline"
        >
          Login
        </button>
      </div>
    </div>
  );
};
