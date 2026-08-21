import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Button } from '../../components/common/Button';
import { DataTable } from '../../components/common/DataTable';
import { Download, BarChart3, TrendingUp, Users, Sprout, Package } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { addToast } = useAgrox();

  const [activeReport, setActiveReport] = useState<'Sales' | 'Orders' | 'Farmer' | 'Customer' | 'Product'>('Sales');

  const reportData = [
    { metric: 'Gross GMV Volume', current: '₹3,42,800', previous: '₹2,67,400', growth: '+28.2%' },
    { metric: 'Total Delivered Orders', current: '1,258 orders', previous: '980 orders', growth: '+28.3%' },
    { metric: 'Average Order Value (AOV)', current: '₹272.50', previous: '₹272.85', growth: '-0.1%' },
    { metric: 'Farmer Retention Rate', current: '98.4%', previous: '96.2%', growth: '+2.2%' },
    { metric: 'City Delivery On-Time Rate', current: '99.1%', previous: '98.0%', growth: '+1.1%' },
  ];

  const columns = [
    { header: 'Key Performance Metric', accessorKey: 'metric' as const, cell: (r: any) => <span className="font-bold text-[#17231A]">{r.metric}</span> },
    { header: 'Current Period (2026)', accessorKey: 'current' as const, cell: (r: any) => <span className="font-black text-[#16803C]">{r.current}</span> },
    { header: 'Previous Period', accessorKey: 'previous' as const },
    { header: 'Period Growth', cell: (r: any) => <span className="font-bold text-[#3FAE5A]">{r.growth}</span> },
  ];

  const handleExportCSV = () => {
    addToast(`Exported ${activeReport}_Report_2026.csv`, 'success');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#17231A]">Marketplace Intelligence & Reports</h2>
          <p className="text-xs text-gray-500">Comprehensive analytics across sales, farmers, products & city orders</p>
        </div>

        <Button
          size="md"
          variant="yellow"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={handleExportCSV}
        >
          Export CSV Report
        </Button>
      </div>

      {/* Report Tabs */}
      <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-2xs max-w-2xl">
        {(['Sales', 'Orders', 'Farmer', 'Customer', 'Product'] as const).map((rep) => (
          <button
            key={rep}
            onClick={() => setActiveReport(rep)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeReport === rep ? 'bg-[#16803C] text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {rep} Report
          </button>
        ))}
      </div>

      {/* Analytics Summary */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
        <h3 className="text-base font-black text-[#17231A]">{activeReport} Executive Summary</h3>
        <DataTable columns={columns} data={reportData} keyExtractor={(r) => r.metric} />
      </div>
    </div>
  );
};
