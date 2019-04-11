import React from 'react';
import PropTypes from 'prop-types';
import './Text.css';

const Text = ({
  type = 'body',
  variant = false,
  children,
  className = '',
  ...props
}) => {
  const modifier = variant ? `Text__${type}--${variant}` : '';
  const Tag =
    className.split(' ').filter(s => s === 'd-inline').length > 0
      ? 'span'
      : 'p';
  return (
    <Tag className={`${className} Text Text__${type} ${modifier}`} {...props}>
      {children}
    </Tag>
  );
};

Text.propTypes = {
  type: PropTypes.oneOf(['large', 'body', 'small', 'micro'])
};

export default Text;
