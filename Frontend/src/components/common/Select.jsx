import React from 'react';

const Select = React.forwardRef(({ label, error, children, className = '', ...props }, ref) => React.createElement('label', { className: 'block' }, [
  label ? React.createElement('span', { key: 'label', className: 'mb-2 block text-sm font-medium text-slate-700' }, label) : null,
  React.createElement('select', { key: 'select', ref, className: `input-field ${className}`.trim(), ...props }, children),
  error ? React.createElement('p', { key: 'error', className: 'mt-2 text-xs font-semibold text-red-500' }, error) : null,
]));

export default Select;