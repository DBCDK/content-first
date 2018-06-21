import React from 'react';
import PropTypes from 'prop-types';
import './Term.css';

const Term = ({
  Tag = 'button',
  size = 'large',
  children,
  className,
  ...props
}) => {
  return (
    <Tag className={`${className || ''} btn Term Term__${size}`} {...props}>
      {children}
    </Tag>
  );
};

Term.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default Term;
