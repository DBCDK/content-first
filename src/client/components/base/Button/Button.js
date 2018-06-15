import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({
  Tag = 'button',
  size = 'large',
  type = 'primary',
  children,
  className,
  ...props
}) => {
  return (
    <Tag
      className={`${className ||
        ''} btn Button Button__${type} Button__${size}`}
      {...props}
    >
      {children}
    </Tag>
  );
};

Button.propTypes = {
  size: PropTypes.oneOf(['small', 'medium']),
  type: PropTypes.oneOf(['primary', 'secondary', 'tertiary'])
};

export default Button;
