import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'There are no items to display at the moment.',
  icon = <PackageOpen className="w-12 h-12 text-[#16803C]/60" />,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white/70 rounded-3xl border border-gray-100 shadow-2xs my-4">
      <div className="p-4 bg-[#F7F9F5] rounded-full mb-3 shadow-inner">
        {icon}
      </div>
      <h4 className="text-base font-bold text-[#17231A] mb-1">{title}</h4>
      <p className="text-xs text-gray-500 max-w-xs mb-4">{description}</p>
      {actionText && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
