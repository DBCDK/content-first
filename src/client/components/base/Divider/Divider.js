import React from 'react';
import PropTypes from 'prop-types';
import './Divider.css';

const Divider = ({
  type = 'horizontal',
  variant = 'thick',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`${className} divider divider__${type} divider__${type}--${variant}`}
      {...props}
    />
  );
};

Divider.propTypes = {
  type: PropTypes.oneOf(['horizontal', 'vertical']),
  variant: PropTypes.oneOf(['thin', 'thick'])
};

export default Divider;
