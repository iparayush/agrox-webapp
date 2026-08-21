import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Badge } from '../../components/common/Badge';
import { TrendingUp, Landmark, Calendar, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';

export const FarmerEarnings: React.FC = () => {
  const { settlements } = useAgrox();

  const [filter, setFilter] = useState<'Today' | 'Weekly' | 'Monthly'>('Monthly');

  const chartBars = [
    { label: 'Mon', height: '40%', val: '₹3.2k' },
    { label: 'Tue', height: '65%', val: '₹5.4k' },
    { label: 'Wed', height: '85%', val: '₹7.8k' },
    { label: 'Thu', height: '55%', val: '₹4.5k' },
    { label: 'Fri', height: '95%', val: '₹9.2k' },
    { label: 'Sat', height: '70%', val: '₹6.1k' },
    { label: 'Sun', height: '50%', val: '₹4.2k' },
  ];

  return (
    <div className="p-4 space-y-5 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#17231A]">Earnings & Settlements</h2>
          <p className="text-xs text-gray-500">Direct bank payouts & revenue analytics</p>
        </div>
      </div>

      {/* Hero Earnings Card */}
      <div className="bg-gradient-to-br from-[#16803C] via-[#126c32] to-[#3FAE5A] text-white p-6 rounded-3xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
            Total Revenue Earned
          </span>
          <div className="flex bg-white/20 p-0.5 rounded-xl backdrop-blur-xs">
            {(['Today', 'Weekly', 'Monthly'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  filter === f ? 'bg-white text-[#16803C]' : 'text-white/80 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-white">₹1,25,400</span>
          <span className="text-xs text-[#F4B942] font-bold flex items-center gap-0.5">
            <ArrowUpRight className="w-4 h-4" /> +18.4%
          </span>
        </div>

        <p className="text-xs text-emerald-100 font-medium">
          Payouts settled directly into SBI A/c •••• 4921
        </p>
      </div>

      {/* Simple Sales Visualizer Chart */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#17231A]">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#16803C]" /> Weekly Sales Trend
          </span>
          <span className="text-gray-400">Avg ₹5.8k/day</span>
        </div>

        <div className="h-36 flex items-end justify-between pt-6 px-2 gap-2 border-b border-gray-100">
          {chartBars.map((bar, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
              <span className="text-[9px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {bar.val}
              </span>
              <div
                className="w-full bg-[#16803C]/80 hover:bg-[#16803C] rounded-t-lg transition-all"
                style={{ height: bar.height }}
              />
              <span className="text-[10px] font-bold text-gray-500 mt-1">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Settlements */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h4 className="text-sm font-extrabold text-[#17231A] flex items-center gap-1.5">
          <Landmark className="w-4 h-4 text-[#16803C]" /> Recent Settlements Ledger
        </h4>

        <div className="space-y-3">
          {settlements.map((set) => (
            <div
              key={set.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F9F5] border border-gray-100 text-xs"
            >
              <div>
                <span className="font-bold text-[#17231A] block">{set.id}</span>
                <span className="text-gray-500 text-[11px]">{set.date} • {set.bank_ref}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-[#16803C] block">₹{set.amount}</span>
                {set.status === 'Completed' ? (
                  <Badge variant="verified" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                    Paid
                  </Badge>
                ) : (
                  <Badge variant="warning" size="sm" icon={<Clock className="w-3 h-3" />}>
                    Processing
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
