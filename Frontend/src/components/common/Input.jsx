import React from 'react';

const Input = React.forwardRef(({ label, error, className = '', ...props }, ref) => React.createElement('label', { className: 'block' }, [
  label ? React.createElement('span', { key: 'label', className: 'mb-2 block text-sm font-medium text-slate-700' }, label) : null,
  React.createElement('input', { key: 'input', ref, className: `input-field ${className}`.trim(), ...props }),
  error ? React.createElement('p', { key: 'error', className: 'mt-2 text-xs font-semibold text-red-500' }, error) : null,
]));

export default Input;