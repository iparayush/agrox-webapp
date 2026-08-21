import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ShieldCheck, Upload, FileText, CheckCircle2, Clock, Landmark } from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export const FarmerVerification: React.FC = () => {
  const { setFarmerScreen, setFarmerLoggedIn, addToast } = useAgrox();

  const [currentStep, setCurrentStep] = useState<number>(3); // Step 3 Documents
  const [aadhaarFile, setAadhaarFile] = useState<string>('aadhaar_card_scan.pdf');
  const [farmProofFile, setFarmProofFile] = useState<string>('7-12_land_extract.pdf');
  const [accountNo, setAccountNo] = useState('•••• •••• 4921');
  const [ifsc, setIfsc] = useState('SBIN0001234');

  const handleSubmitVerification = () => {
    setCurrentStep(4);
    setFarmerLoggedIn(true);
    addToast('Documents submitted for AGROX admin verification!', 'success');
  };

  return (
    <div className="p-4 space-y-5 pb-20">
      <div>
        <h2 className="text-xl font-black text-[#17231A]">Farmer Verification</h2>
        <p className="text-xs text-gray-500">Verify your farm details to get your Verified Seller Badge</p>
      </div>

      {/* 4-Step Progress Wizard Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className={currentStep >= 1 ? 'text-[#16803C]' : 'text-gray-400'}>1. Personal</span>
          <span className={currentStep >= 2 ? 'text-[#16803C]' : 'text-gray-400'}>2. Farm</span>
          <span className={currentStep >= 3 ? 'text-[#16803C]' : 'text-gray-400'}>3. Documents</span>
          <span className={currentStep >= 4 ? 'text-[#16803C]' : 'text-gray-400'}>4. Submit</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#16803C] h-full transition-all duration-500"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-amber-50 p-4 rounded-3xl border border-amber-200 flex items-center gap-3">
        <div className="p-3 bg-[#F4B942] text-[#17231A] rounded-2xl shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-amber-900">Verification Pending</h4>
            <Badge variant="warning" size="sm">Step 3 of 4</Badge>
          </div>
          <p className="text-xs text-amber-800 mt-0.5">
            Admin review takes 2-4 business hours once documents are uploaded.
          </p>
        </div>
      </div>

      {/* Document Upload Form */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <h4 className="text-sm font-extrabold text-[#17231A]">Upload Official Documents</h4>

        {/* Identity Proof */}
        <div className="p-3.5 rounded-2xl border border-gray-200 bg-[#F7F9F5]">
          <label className="text-xs font-bold text-[#17231A] block mb-1">
            1. Identity Proof (Aadhaar / Voter ID)
          </label>
          <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-200">
            <span className="text-xs text-gray-600 truncate flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#16803C]" /> {aadhaarFile}
            </span>
            <button className="text-xs font-bold text-[#16803C] hover:underline flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> Re-upload
            </button>
          </div>
        </div>

        {/* Farm Land Ownership */}
        <div className="p-3.5 rounded-2xl border border-gray-200 bg-[#F7F9F5]">
          <label className="text-xs font-bold text-[#17231A] block mb-1">
            2. Farm Land Proof (7/12 Extract / Khasra)
          </label>
          <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-200">
            <span className="text-xs text-gray-600 truncate flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#16803C]" /> {farmProofFile}
            </span>
            <button className="text-xs font-bold text-[#16803C] hover:underline flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> Re-upload
            </button>
          </div>
        </div>

        {/* Bank Account Info */}
        <div className="p-3.5 rounded-2xl border border-gray-200 bg-[#F7F9F5] space-y-2">
          <label className="text-xs font-bold text-[#17231A] block flex items-center gap-1">
            <Landmark className="w-4 h-4 text-[#16803C]" /> 3. Direct Bank Settlement Account
          </label>
          <Input
            label="Account Number"
            type="text"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
          />
          <Input
            label="IFSC Code"
            type="text"
            value={ifsc}
            onChange={(e) => setIfsc(e.target.value)}
          />
        </div>

        <Button
          fullWidth
          size="lg"
          variant="primary"
          onClick={handleSubmitVerification}
          leftIcon={<CheckCircle2 className="w-5 h-5" />}
        >
          Submit Documents for Verification
        </Button>

        <Button
          fullWidth
          size="md"
          variant="ghost"
          onClick={() => setFarmerScreen('dashboard')}
        >
          Skip & Explore Dashboard
        </Button>
      </div>
    </div>
  );
};
