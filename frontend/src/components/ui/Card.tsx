import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`rounded-xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};
