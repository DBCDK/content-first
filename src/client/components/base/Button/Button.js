import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';
import '../Skeleton/skeleton.css';

const Button = ({
  Tag = 'button',
  size = 'large',
  type = 'primary',
  variant = false,
  children,
  className,
  disabled = false,
  ...props
}) => {
  const modifier = variant ? `Button__${type}--${variant}` : '';

  return (
    <Tag
      className={`${className || ''}
      btn Button Button__${size} Button__${type} ${variant}`}
      {...props}
      disabled={disabled}
    >
      {children}
    </Tag>
  );
};

Button.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  type: PropTypes.oneOf([
    'primary',
    'secondary',
    'tertiary',
    'quaternary',
    'quinary',
    'term',
    'tag',
    'link',
    'link2'
  ])
};

export default Button;
