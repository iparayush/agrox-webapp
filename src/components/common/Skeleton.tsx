import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
}) => {
  const roundedClass =
    variant === 'circular'
      ? 'rounded-full'
      : variant === 'text'
      ? 'rounded-md h-4'
      : 'rounded-2xl';

  return (
    <div
      className={`bg-gray-200 animate-pulse ${roundedClass} ${className}`}
    />
  );
};
