import type { ReactNode } from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="py-12 sm:py-16 text-center px-4">
      <div className="mb-4 sm:mb-6 flex justify-center">
        <div className="rounded-full bg-gradient-to-br from-gray-100 to-gray-200 p-5 sm:p-6 shadow-inner">
          <div className="text-gray-400 [&>svg]:h-10 [&>svg]:w-10 sm:[&>svg]:h-12 sm:[&>svg]:w-12">
            {icon}
          </div>
        </div>
      </div>
      <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
      <p className="mb-6 sm:mb-8 text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="shadow-lg hover:shadow-xl w-full sm:w-auto">
          {action.label}
        </Button>
      )}
    </div>
  );
};
