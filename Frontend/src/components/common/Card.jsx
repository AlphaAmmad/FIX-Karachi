import React from 'react';

const Card = ({ children, className = '' }) => React.createElement('div', { className: `rounded-[1.75rem] border border-slate-200 bg-white shadow-glow ${className}`.trim() }, children);

export default Card;