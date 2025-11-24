import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = ({ label, error, options, className = '', ...props }: SelectProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-bold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`w-full appearance-none rounded-xl border-2 ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500'
          } px-4 py-2.5 pr-10 text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <div className="mt-2 flex items-center gap-1.5">
          <svg className="h-4 w-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-medium text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};
