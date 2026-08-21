import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  unit?: string;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  unit = 'kg',
  min = 1,
  max = 999,
  size = 'md',
}) => {
  const isMin = quantity <= min;
  const isMax = quantity >= max;

  const btnPadding = size === 'sm' ? 'p-1.5' : 'p-2';
  const textClass = size === 'sm' ? 'text-xs px-2.5' : 'text-sm px-3.5';

  return (
    <div className="inline-flex items-center bg-gray-100/90 rounded-xl p-1 border border-gray-200 shadow-xs">
      <button
        type="button"
        onClick={onDecrease}
        disabled={isMin}
        className={`${btnPadding} rounded-lg bg-white text-[#17231A] hover:bg-gray-50 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs`}
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className={`font-bold text-[#17231A] ${textClass} min-w-[2.5rem] text-center`}>
        {quantity} <span className="text-gray-500 font-normal text-xs">{unit}</span>
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={isMax}
        className={`${btnPadding} rounded-lg bg-[#16803C] text-white hover:bg-[#126c32] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs`}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
