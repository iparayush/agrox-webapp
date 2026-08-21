import React from 'react';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'
  | 'neutral'
  | 'organic'
  | 'verified';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
}) => {
  const styles: Record<BadgeVariant, string> = {
    success: 'bg-[#3FAE5A]/15 text-[#16803C] border border-[#3FAE5A]/30',
    warning: 'bg-[#F4B942]/20 text-[#8a5d00] border border-[#F4B942]/40',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200',
    organic: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold',
    verified: 'bg-emerald-600 text-white shadow-xs font-semibold',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-medium tracking-wide ${styles[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
