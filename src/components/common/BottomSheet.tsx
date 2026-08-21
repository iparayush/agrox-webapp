import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      {/* Content */}
      <div className="relative w-full bg-white rounded-t-3xl shadow-2xl p-6 z-10 max-h-[85vh] overflow-y-auto border-t border-gray-100 animate-slide-up">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
        {title && (
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <h3 className="text-lg font-bold text-[#17231A]">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
