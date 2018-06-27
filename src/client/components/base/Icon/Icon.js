import React from 'react';
import './Icon.css';

// icons from:
// https://material.io/tools/icons/?icon=local_library&style=round

const Icon = ({name, className, ...props}) => {
  return (
    <i className={`material-icons ${className || ''}`} {...props}>
      {name}
    </i>
  );
};

export default Icon;
