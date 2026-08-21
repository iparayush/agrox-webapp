import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Bell, ShoppingBag, CreditCard, Truck, Sparkles } from 'lucide-react';

export const CustomerNotifications: React.FC = () => {
  const { notifications } = useAgrox();

  const todayNotifs = notifications.filter((n) => n.group === 'Today');
  const earlierNotifs = notifications.filter((n) => n.group === 'Earlier');

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-[#16803C]" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-[#F4B942]" />;
      case 'delivery':
        return <Truck className="w-4 h-4 text-blue-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <div>
        <h2 className="text-xl font-black text-[#17231A]">Notifications</h2>
        <p className="text-xs text-gray-500">Live order status & harvest announcements</p>
      </div>

      {/* Today Group */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Today</h4>
        <div className="space-y-2">
          {todayNotifs.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                !item.is_read ? 'bg-white border-[#16803C]/30 shadow-xs' : 'bg-gray-50 border-gray-100'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-[#F7F9F5] border border-gray-100 shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-[#17231A]">{item.title}</h5>
                <p className="text-xs text-gray-600 mt-0.5">{item.message}</p>
                <span className="text-[10px] text-gray-400 mt-1 block">{item.created_at}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Earlier Group */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Earlier</h4>
        <div className="space-y-2">
          {earlierNotifs.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-white border border-gray-100 flex items-start gap-3 opacity-80"
            >
              <div className="p-2.5 rounded-xl bg-gray-50 shrink-0">{getIcon(item.type)}</div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-[#17231A]">{item.title}</h5>
                <p className="text-xs text-gray-600 mt-0.5">{item.message}</p>
                <span className="text-[10px] text-gray-400 mt-1 block">{item.created_at}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
