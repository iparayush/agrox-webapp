import React from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAgrox();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-11/12 max-w-md pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-slide-up ${
            toast.type === 'success'
              ? 'bg-[#16803C] text-white border-[#3FAE5A]'
              : toast.type === 'error'
              ? 'bg-red-700 text-white border-red-500'
              : 'bg-[#17231A] text-white border-gray-700'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#F4B942] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-white shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#3FAE5A] shrink-0" />}
            <span className="text-xs font-semibold">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-full text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
