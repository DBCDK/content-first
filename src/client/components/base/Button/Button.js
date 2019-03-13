import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';
import '../Skeleton/skeleton.css';

const Button = ({
  Tag = 'button',
  size = 'large',
  type = 'primary',
  iconLeft = '',
  iconRight = '',
  variant = false,
  children,
  className,
  disabled = false,
  dataCy,
  ...props
}) => {
  const modifier = variant ? `Button__${type}--${variant}` : '';

  const iconLeftSnippet =
    iconLeft === '' ? (
      ''
    ) : (
      <i className="material-icons Button__icon--left">{iconLeft}</i>
    );
  const iconRightSnippet =
    iconRight === '' ? (
      ''
    ) : (
      <i className="material-icons Button__icon--right">{iconRight}</i>
    );

  return (
    <Tag
      className={`${className || ''}
      btn Button Button__${size} Button__${type} ${modifier}`}
      {...props}
      disabled={disabled}
      data-cy={dataCy || ''}
    >
      {iconLeftSnippet}
      {children}
      {iconRightSnippet}
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
