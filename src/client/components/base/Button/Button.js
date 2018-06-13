import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({
  Tag = 'button',
  size = 'medium',
  type = 'primary',
  children,
  className,
  ...props
}) => {
  return (
    <Tag
      className={`${className ||
        ''} btn Button Button__${size} Button__${type}`}
      {...props}
    >
      {children}
    </Tag>
  );
};

Button.propTypes = {
  size: PropTypes.oneOf(['small']),
  type: PropTypes.oneOf(['primary', 'secondary', 'tertiary'])
};

export default Button;
