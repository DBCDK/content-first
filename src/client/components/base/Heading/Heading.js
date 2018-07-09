import React from 'react';
import PropTypes from 'prop-types';
import './Heading.css';

const Heading = ({
  Tag = 'h1',
  type = 'section',
  children,
  className,
  ...props
}) => {
  return (
    <Tag className={`${className || ''} Heading Heading__${type}`} {...props}>
      {children}
    </Tag>
  );
};

Heading.propTypes = {
  Tag: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  type: PropTypes.oneOf([
    'section',
    'subtitle',
    'peach-subtitle',
    'title',
    'lead',
    'heading'
  ])
};

export default Heading;
