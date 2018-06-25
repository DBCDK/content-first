import React from 'react';
import Text from '../Text';
import './User.css';
import '../skeleton.css';

const User = ({className, name = false, pulse = false, styles, children}) => {
  const animation = pulse ? 'Skeleton__pulse__active' : '';
  return [
    <div className={'Skeleton__user__wrap ' + animation} style={styles}>
      <span className={`Skeleton__user ${className || ''}`}>{children}</span>
      {name && (
        <Text lines={1} color="#e9eaeb" className="Skeleton__user__name" />
      )}
    </div>
  ];
};

export default User;
