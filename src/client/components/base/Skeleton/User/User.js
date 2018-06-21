import React from 'react';
import './User.css';

const User = ({className, styles, children}) => {
  return (
    <span className={`Skeleton__user ${className || ''}`} style={styles}>
      {children}
    </span>
  );
};

export default User;
