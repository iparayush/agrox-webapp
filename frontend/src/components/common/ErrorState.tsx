import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this information. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-red-50/50 rounded-3xl border border-red-100 my-4">
      <div className="p-3 bg-red-100 text-red-600 rounded-full mb-3">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-red-900 mb-1">{title}</h4>
      <p className="text-xs text-red-700 max-w-xs mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" leftIcon={<RotateCcw className="w-3.5 h-3.5" />} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
