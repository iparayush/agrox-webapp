import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'fresh' | 'yellow' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-xs';

  const variants = {
    primary:
      'bg-[#16803C] hover:bg-[#126c32] text-white focus:ring-[#16803C]',
    fresh:
      'bg-[#3FAE5A] hover:bg-[#35964d] text-white focus:ring-[#3FAE5A]',
    yellow:
      'bg-[#F4B942] hover:bg-[#e2a833] text-[#17231A] focus:ring-[#F4B942]',
    outline:
      'border-2 border-[#16803C] text-[#16803C] hover:bg-[#16803C]/10 focus:ring-[#16803C]',
    ghost:
      'bg-transparent text-[#17231A] hover:bg-gray-100 focus:ring-gray-300 shadow-none',
    danger:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
