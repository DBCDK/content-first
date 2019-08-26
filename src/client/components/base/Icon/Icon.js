import React from 'react';
import './Icon.css';

// icons from:
// https://material.io/tools/icons/?icon=local_library&style=round

const Icon = ({
  name,
  hex = null,
  className = '',
  disabled = false,
  onClick = null,
  ...props
}) => {
  const classDisabled = disabled ? 'md-disabled' : '';
  return (
    <i
      className={`material-icons material-icons-${hex ||
        name} ${className} ${classDisabled}`}
      onClick={e => {
        if (!disabled && onClick) {
          onClick(e);
        }
      }}
      {...props}
    >
      {name}
    </i>
  );
};

export default Icon;
