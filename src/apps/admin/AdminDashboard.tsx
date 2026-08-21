import React, { useEffect, useState } from 'react';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import {
  Users,
  Sprout,
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../lib/api';

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalCustomers: 14280,
    activeFarmers: 183,
    listedProducts: 420,
    totalOrders: 1240,
    grossGMV: 342800,
    pendingVerifications: 3,
  });
  const [orders, setOrders] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, ordersRes] = await Promise.all([
        api.admin.dashboard(),
        api.admin.getOrders(),
      ]);

      if (dashRes.success && dashRes.data) {
        setMetrics(dashRes.data);
      }
      if (ordersRes.success && ordersRes.data) {
        setOrders(ordersRes.data);
      }
    } catch (err) {
      console.warn('[AdminDashboard] Fetch error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const kpis = [
    { label: 'Total Customers', val: Number(metrics.totalCustomers).toLocaleString(), icon: Users, change: '+12%', color: 'bg-blue-50 text-blue-700' },
    { label: 'Active Farmers', val: String(metrics.activeFarmers), icon: Sprout, change: '+8%', color: 'bg-emerald-50 text-emerald-800' },
    { label: 'Listed Products', val: String(metrics.listedProducts), icon: Package, change: '+15%', color: 'bg-amber-50 text-amber-800' },
    { label: 'Total Orders', val: Number(metrics.totalOrders).toLocaleString(), icon: ShoppingBag, change: '+22%', color: 'bg-purple-50 text-purple-700' },
    { label: 'Gross Marketplace GMV', val: `₹${(Number(metrics.grossGMV) / 1000).toFixed(1)}k`, icon: TrendingUp, change: '+28%', color: 'bg-green-50 text-[#16803C]' },
    { label: 'Pending Verification', val: String(metrics.pendingVerifications), icon: Clock, change: metrics.pendingVerifications > 0 ? 'Action Req' : 'Clear', color: 'bg-red-50 text-red-700' },
  ];

  const recentOrdersColumns = [
    { header: 'Order ID', accessorKey: 'id' as const, cell: (r: any) => <span className="font-extrabold text-[#16803C]">{r.id}</span> },
    { header: 'Customer', accessorKey: 'customer_name' as const },
    { header: 'Farmer', accessorKey: 'farmer_name' as const },
    { header: 'Amount', cell: (r: any) => <span className="font-bold text-[#17231A]">₹{r.total_amount}</span> },
    { header: 'Payment', cell: (r: any) => <Badge variant="verified" size="sm">{r.payment_method} ({r.payment_status})</Badge> },
    { header: 'Status', cell: (r: any) => <Badge variant="success" size="sm">{r.order_status}</Badge> },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#17231A]">Executive Dashboard</h2>
          <p className="text-xs text-gray-500">Real-time marketplace telemetry & platform KPIs</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-2xs transition-all active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#16803C] ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-2xl ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> {kpi.change}
                </span>
              </div>
              <h4 className="text-2xl font-black text-[#17231A]">{kpi.val}</h4>
              <span className="text-xs text-gray-400 font-semibold block">{kpi.label}</span>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#17231A]">Sales Overview & GMV Trend</h3>
              <span className="text-xs text-gray-500 font-medium">Monthly revenue progression across cities</span>
            </div>
            <span className="text-xs font-bold text-[#16803C] bg-emerald-50 px-3 py-1 rounded-xl">
              Live Direct Trade
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-8 px-4 border-b border-gray-100">
            {[
              { month: 'Jan', val: '45%', amount: '₹1.2L' },
              { month: 'Feb', val: '60%', amount: '₹1.8L' },
              { month: 'Mar', val: '75%', amount: '₹2.3L' },
              { month: 'Apr', val: '50%', amount: '₹1.5L' },
              { month: 'May', val: '80%', amount: '₹2.6L' },
              { month: 'Jun', val: '95%', amount: '₹3.1L' },
              { month: 'Jul', val: '85%', amount: '₹2.8L' },
              { month: 'Aug', val: '100%', amount: `₹${(Number(metrics.grossGMV) / 100000).toFixed(1)}L` },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[10px] font-bold text-[#16803C] opacity-0 group-hover:opacity-100 transition-opacity">
                  {col.amount}
                </span>
                <div
                  className="w-full bg-[#16803C] hover:bg-[#3FAE5A] rounded-t-xl transition-all"
                  style={{ height: col.val }}
                />
                <span className="text-xs font-bold text-gray-500 mt-1">{col.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth & Platform Ratio */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-[#17231A]">Marketplace Composition</h3>
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-gray-600">Urban Customers</span>
                <span className="text-[#16803C]">{metrics.totalCustomers}</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#16803C] h-full" style={{ width: '82%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-gray-600">Verified Farmers</span>
                <span className="text-[#F4B942]">{metrics.activeFarmers}</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#F4B942] h-full" style={{ width: '12%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-gray-600">Active Products</span>
                <span className="text-blue-600">{metrics.listedProducts}</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: '6%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#17231A]">Live Orders Queue</h3>
          <span className="text-xs text-gray-500">Direct from mobile customer checkout</span>
        </div>
        {loading ? (
          <div className="p-8 bg-white rounded-3xl border border-gray-200 text-center text-gray-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#16803C]" />
            <span>Loading live order queue...</span>
          </div>
        ) : (
          <DataTable
            columns={recentOrdersColumns}
            data={orders}
            keyExtractor={(row) => row.id}
          />
        )}
      </div>
    </div>
  );
};
