import React, { useEffect, useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ShieldCheck, Loader2, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';

export const AdminFarmers: React.FC = () => {
  const { addToast } = useAgrox();
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getFarmers();
      if (res.success && res.data) {
        setFarmers(res.data);
      }
    } catch (err) {
      console.warn('[AdminFarmers] Fetch failed:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const handleToggleVerification = async (farmerId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'APPROVED' ? 'SUSPENDED' : 'APPROVED';
    setUpdatingId(farmerId);
    try {
      const res = await api.admin.verifyFarmer(farmerId, newStatus);
      if (res.success) {
        setFarmers((prev) =>
          prev.map((f) =>
            f.id === farmerId
              ? { ...f, verification_status: newStatus, is_verified: newStatus === 'APPROVED' }
              : f
          )
        );
        addToast(`Farmer status set to ${newStatus}`, 'success');
      } else {
        addToast(res.message || 'Failed to update status', 'error');
      }
    } catch {
      addToast('Network error updating status', 'error');
    }
    setUpdatingId(null);
  };

  const columns = [
    {
      header: 'Farmer Partner',
      cell: (r: any) => (
        <div className="flex items-center gap-2.5">
          <img src={r.photo_url} alt={r.name} className="w-9 h-9 rounded-xl object-cover border border-gray-100" />
          <div>
            <span className="font-bold text-[#17231A] block">{r.name}</span>
            <span className="text-[11px] text-gray-500 font-medium">{r.farm_name} • {r.farm_size_acres} Acres</span>
          </div>
        </div>
      ),
    },
    { header: 'Village & District', cell: (r: any) => <span>{r.village}, {r.district}</span> },
    { header: 'Rating', cell: (r: any) => <span className="font-bold text-[#F4B942]">★ {r.rating}</span> },
    {
      header: 'Verification',
      cell: (r: any) => (
        <Badge variant={r.verification_status === 'APPROVED' ? 'verified' : 'warning'} size="sm">
          {r.verification_status === 'APPROVED' ? 'Verified Partner' : 'Pending Verification'}
        </Badge>
      ),
    },
    {
      header: 'Admin Action',
      cell: (r: any) => {
        const isApproved = r.verification_status === 'APPROVED';
        const isBusy = updatingId === r.id;
        return (
          <Button
            size="sm"
            variant={isApproved ? 'outline' : 'fresh'}
            onClick={() => handleToggleVerification(r.id, r.verification_status)}
            disabled={isBusy}
            className={`text-xs py-1 px-3 ${isApproved ? 'text-amber-700 border-amber-200 hover:bg-amber-50' : ''}`}
          >
            {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isApproved ? 'Suspend' : 'Approve Partner'}
          </Button>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#17231A]">Farmer Onboarding & Approvals</h2>
          <p className="text-xs text-gray-500">Live directory of farmers, land records and KYC verification statuses</p>
        </div>
        <button
          onClick={fetchFarmers}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-2xs transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#16803C] ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 bg-white rounded-3xl border border-gray-200 text-center text-gray-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#16803C]" />
          <span>Loading verified farmers database...</span>
        </div>
      ) : (
        <DataTable columns={columns} data={farmers} keyExtractor={(r) => r.id} />
      )}
    </div>
  );
};
