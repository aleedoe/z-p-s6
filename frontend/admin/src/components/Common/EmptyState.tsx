import React from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <Card className="w-full">
      <CardBody className="text-center p-12">
        {icon && <div className="mb-4 flex justify-center">{icon}</div>}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
        {actionLabel && onAction && (
          <Button
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            onPress={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </CardBody>
    </Card>
  );
};