import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';
import '../Skeleton/skeleton.css';

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
