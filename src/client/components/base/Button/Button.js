import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';

import './Button.css';
import '../Skeleton/skeleton.css';

const Button = ({
  Tag = 'button',
  size = 'large',
  type = 'primary',
  iconLeft = null,
  iconRight = null,
  variant = false,
  children = null,
  className = '',
  disabled = false,
  dataCy,
  'data-cy': dataCyHyphen,
  href,
  hrefSelf,
  onClick,
  ...props
}) => {
  const modifier = variant ? `button__${type}--${variant}` : '';
  const iconLeftClass = iconLeft ? 'button__icon--left' : '';
  const iconRightClass = iconRight ? 'button__icon--right' : '';

  var onClickValue = {};
  if (typeof href !== 'undefined') {
    onClickValue = hrefSelf
      ? {onClick: () => window.open(href, '_self')}
      : {onClick: () => window.open(href)};
  } else if (typeof onClick !== 'undefined') {
    onClickValue = {onClick: onClick};
  }

  return (
    <Tag
      className={`${className}
      button button__${size} button__${type} ${modifier} ${iconLeftClass} ${iconRightClass}`}
      {...props}
      disabled={disabled}
      data-cy={dataCy || dataCyHyphen || ''}
      {...onClickValue}
    >
      {iconLeft && <Icon name={iconLeft} className="icon--left" />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} className="icon--right" />}
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
