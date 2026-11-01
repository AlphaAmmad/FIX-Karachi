import React from 'react';

const LazyImage = ({ src, alt, className = '', ...rest }) => (
  React.createElement('img', { src, alt, loading: 'lazy', className, ...rest })
);

export default LazyImage;