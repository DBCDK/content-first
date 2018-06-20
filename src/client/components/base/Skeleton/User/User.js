import React from 'react';
import './User.css';

const User = ({className, children}) => {
  return (
    <span className={`Skeleton__user ${className || ''}`}>{children}</span>
  );
};

export default User;
