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

  return (
    <p className={`${className} Text Text__${type} ${modifier}`} {...props}>
      {children}
    </p>
  );
};

Text.propTypes = {
  type: PropTypes.oneOf(['large', 'body', 'small', 'micro'])
};

export default Text;
