import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isLoading?: boolean;
}

export function Input({ 
  label, 
  error, 
  isLoading = false, 
  className = '', 
  ...props 
}: InputProps) {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg shadow-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-50 disabled:cursor-not-allowed
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${isLoading ? 'opacity-50' : ''}
    ${className}
  `.trim();

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={inputClasses}
        disabled={props.disabled || isLoading}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}