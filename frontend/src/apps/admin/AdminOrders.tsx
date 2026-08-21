import React, { useEffect, useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Loader2, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';

export const AdminOrders: React.FC = () => {
  const { addToast } = useAgrox();
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getOrders(statusFilter);
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.warn('[AdminOrders] Fetch failed:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await api.admin.updateOrderStatus(orderId, nextStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, order_status: nextStatus } : o))
        );
        addToast(`Order ${orderId} updated to ${nextStatus}`, 'success');
      } else {
        addToast(res.message || 'Failed to update order status', 'error');
      }
    } catch {
      addToast('Network error updating order', 'error');
    }
    setUpdatingId(null);
  };

  const columns = [
    { header: 'Order ID', accessorKey: 'id' as const, cell: (r: any) => <span className="font-extrabold text-[#16803C]">{r.id}</span> },
    { header: 'Customer', accessorKey: 'customer_name' as const },
    { header: 'Farmer Partner', accessorKey: 'farmer_name' as const },
    { header: 'Amount', cell: (r: any) => <span className="font-bold text-[#17231A]">₹{r.total_amount}</span> },
    { header: 'Payment Method', accessorKey: 'payment_method' as const },
    {
      header: 'Status',
      cell: (r: any) => <Badge variant="success" size="sm">{r.order_status}</Badge>,
    },
    { header: 'Timestamp', cell: (r: any) => new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    {
      header: 'Update Status',
      cell: (r: any) => {
        const isBusy = updatingId === r.id;
        return (
          <div className="flex items-center gap-1">
            {r.order_status !== 'Delivered' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdateStatus(r.id, 'Delivered')}
                disabled={isBusy}
                className="text-xs py-0.5 px-2 text-[#16803C] border-emerald-200 hover:bg-emerald-50"
              >
                {isBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Mark Delivered'}
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#17231A]">Logistics & Order Manager</h2>
          <p className="text-xs text-gray-500">Live order flow and cold-chain delivery operations</p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-gray-200 shadow-2xs">
            {['All', 'Delivered', 'Ready', 'Preparing', 'Placed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-[#16803C] text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-700 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#16803C] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 bg-white rounded-3xl border border-gray-200 text-center text-gray-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#16803C]" />
          <span>Fetching live order queue...</span>
        </div>
      ) : (
        <DataTable columns={columns} data={orders} keyExtractor={(r) => r.id} />
      )}
    </div>
  );
};
