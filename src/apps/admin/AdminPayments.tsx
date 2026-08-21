import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { CreditCard, CheckCircle2, Clock, XCircle, RotateCcw } from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const { orders } = useAgrox();

  const totalGMV = orders.reduce((acc, o) => acc + o.total_amount, 0) + 189200;

  const paymentKpis = [
    { label: 'Total Payments Processed', val: `₹${(totalGMV / 1000).toFixed(1)}k`, icon: CreditCard, color: 'bg-emerald-50 text-[#16803C]' },
    { label: 'Successful Transactions', val: '99.4%', icon: CheckCircle2, color: 'bg-blue-50 text-blue-700' },
    { label: 'Pending Settlement', val: '₹14,280', icon: Clock, color: 'bg-amber-50 text-amber-700' },
    { label: 'Failed Gateway Attempts', val: '0.6%', icon: XCircle, color: 'bg-red-50 text-red-600' },
    { label: 'Refunded Orders', val: '₹0', icon: RotateCcw, color: 'bg-purple-50 text-purple-700' },
  ];

  const transactionsData = [
    { txnId: 'TXN-991823', orderId: 'AGX-8921', amount: 131, method: 'UPI (GPay)', status: 'Success', date: '2026-08-21 09:30 AM' },
    { txnId: 'TXN-991820', orderId: 'AGX-8919', amount: 135, method: 'Credit Card', status: 'Success', date: '2026-08-20 04:20 PM' },
    { txnId: 'TXN-991815', orderId: 'AGX-8912', amount: 450, method: 'Net Banking', status: 'Success', date: '2026-08-20 11:15 AM' },
    { txnId: 'TXN-991802', orderId: 'AGX-8908', amount: 280, method: 'UPI (PhonePe)', status: 'Success', date: '2026-08-19 02:40 PM' },
  ];

  const columns = [
    { header: 'Transaction ID', accessorKey: 'txnId' as const, cell: (r: any) => <span className="font-mono font-bold text-gray-800">{r.txnId}</span> },
    { header: 'Order Ref', accessorKey: 'orderId' as const, cell: (r: any) => <span className="font-extrabold text-[#16803C]">{r.orderId}</span> },
    { header: 'Amount', cell: (r: any) => <span className="font-black text-[#17231A]">₹{r.amount}</span> },
    { header: 'Payment Method', accessorKey: 'method' as const },
    {
      header: 'Gateway Status',
      cell: (r: any) => (
        <Badge variant="verified" size="sm">
          {r.status}
        </Badge>
      ),
    },
    { header: 'Timestamp', accessorKey: 'date' as const },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#17231A]">Financial Settlements & Gateway Ledger</h2>
        <p className="text-xs text-gray-500">Live monitoring of customer payments and direct farmer bank payouts</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {paymentKpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs space-y-2">
              <div className={`p-2.5 rounded-2xl w-fit ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-2xl font-black text-[#17231A]">{kpi.val}</h4>
              <span className="text-xs text-gray-400 font-semibold block">{kpi.label}</span>
            </div>
          );
        })}
      </div>

      {/* Transactions Table */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-[#17231A]">Live Gateway Ledger</h3>
        <DataTable columns={columns} data={transactionsData} keyExtractor={(r) => r.txnId} />
      </div>
    </div>
  );
};
