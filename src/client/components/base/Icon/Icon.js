import React from 'react';
import './Icon.css';

const Icon = ({name, className, ...props}) => {
  return (
    <i
      className={`${className || ''} glyphicon glyphicon-${name}`}
      {...props}
    />
  );
};

export default Icon;
