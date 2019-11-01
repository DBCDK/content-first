import React from 'react';
import Button from '../../Button';

import './Button.css';
import '../skeleton.css';

const SkeletonButton = ({className = '', children, type, size}) => {
  return (
    <Button
      type={type}
      size={size}
      className={`${className} Button__skeleton Skeleton__Pulse`}
    >
      {children}
    </Button>
  );
};

export default SkeletonButton;
