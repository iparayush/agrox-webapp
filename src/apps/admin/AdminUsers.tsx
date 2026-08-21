import React, { useEffect, useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Search, Loader2, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';

export const AdminUsers: React.FC = () => {
  const { addToast } = useAgrox();
  const [tab, setTab] = useState<'All' | 'Customers' | 'Farmers' | 'Admins'>('All');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const roleParam = tab === 'All' ? undefined : tab === 'Customers' ? 'CUSTOMER' : tab === 'Farmers' ? 'FARMER' : 'ADMIN';
      const res = await api.admin.getUsers(roleParam);
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.warn('[AdminUsers] Fetch failed:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [tab]);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    setUpdatingId(userId);
    try {
      const res = await api.admin.updateUserStatus(userId, newStatus);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
        );
        addToast(`User status updated to ${newStatus}`, 'success');
      } else {
        addToast(res.message || 'Failed to update user status', 'error');
      }
    } catch {
      addToast('Network error updating status', 'error');
    }
    setUpdatingId(null);
  };

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.phone?.toLowerCase().includes(query)
    );
  });

  const columns = [
    {
      header: 'User / Contact',
      cell: (r: any) => (
        <div>
          <span className="font-bold text-[#17231A] block">{r.name}</span>
          <span className="text-[11px] text-gray-400">{r.email}</span>
        </div>
      ),
    },
    { header: 'Phone', accessorKey: 'phone' as const },
    {
      header: 'Role',
      cell: (r: any) => {
        const role = r.role?.toUpperCase();
        return (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            role === 'CUSTOMER' ? 'bg-blue-50 text-blue-700' :
            role === 'FARMER' ? 'bg-emerald-50 text-emerald-800' :
            'bg-purple-50 text-purple-700'
          }`}>
            {role}
          </span>
        );
      },
    },
    {
      header: 'Status',
      cell: (r: any) => (
        <Badge variant={r.status === 'ACTIVE' || r.status === 'Active' ? 'success' : 'danger'} size="sm">
          {r.status}
        </Badge>
      ),
    },
    { header: 'Joined', accessorKey: 'joined' as const },
    {
      header: 'Moderation',
      cell: (r: any) => {
        const isActive = r.status === 'ACTIVE' || r.status === 'Active';
        const isBusy = updatingId === r.id;
        return (
          <Button
            size="sm"
            variant={isActive ? 'outline' : 'fresh'}
            onClick={() => handleToggleStatus(r.id, r.status)}
            disabled={isBusy}
            className={`text-xs py-1 px-2.5 ${isActive ? 'text-red-600 border-red-200 hover:bg-red-50' : ''}`}
          >
            {isBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : isActive ? 'Block User' : 'Unblock User'}
          </Button>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#17231A]">User Directory & Accounts</h2>
          <p className="text-xs text-gray-500">Live database directory of customers, farmers, and admins</p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-2xs self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#16803C] ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Users</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Tabs */}
        <div className="flex bg-white p-1 rounded-2xl border border-gray-200 sm:w-80 shadow-2xs">
          {(['All', 'Customers', 'Farmers', 'Admins'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                tab === t ? 'bg-[#16803C] text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-2 text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#16803C] shadow-2xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 bg-white rounded-3xl border border-gray-200 text-center text-gray-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#16803C]" />
          <span>Fetching live user directory...</span>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredUsers}
          keyExtractor={(r) => r.id}
        />
      )}
    </div>
  );
};
