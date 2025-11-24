import type { TaskPriority, TaskStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'status' | 'priority' | 'default';
  status?: TaskStatus;
  priority?: TaskPriority;
  className?: string;
}

export const Badge = ({ children, variant = 'default', status, priority, className = '' }: BadgeProps) => {
  const getStatusColor = (s?: TaskStatus) => {
    switch (s) {
      case 'pending':
        return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300';
      case 'in-progress':
        return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-300';
      case 'completed':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (p?: TaskPriority) => {
    switch (p) {
      case 'low':
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-300';
      case 'medium':
        return 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-300';
      case 'high':
        return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const variantStyles = variant === 'status' 
    ? getStatusColor(status) 
    : variant === 'priority' 
    ? getPriorityColor(priority) 
    : 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold border shadow-sm transition-all duration-200 hover:shadow-md whitespace-nowrap ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};
