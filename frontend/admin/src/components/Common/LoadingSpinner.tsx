import React from 'react';
import { Spinner } from '@nextui-org/react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Spinner size={size} color="primary" />
      {label && <p className="mt-2 text-gray-600">{label}</p>}
    </div>
  );
};