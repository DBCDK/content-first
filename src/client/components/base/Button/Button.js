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
  dataCy,
  ...props
}) => {
  const modifier = variant ? `Button__${type}--${variant}` : '';

  return (
    <Tag
      className={`${className || ''}
      btn Button Button__${size} Button__${type} ${modifier}`}
      {...props}
      disabled={disabled}
      data-cy={dataCy || ''}
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
