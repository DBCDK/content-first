import React from 'react';
import PropTypes from 'prop-types';
import './Title.css';

const Title = ({
  Tag = 'h1',
  type = 'title3',
  variant = false,
  children,
  className = '',
  ...props
}) => {
  const modifier = variant ? `Title__${type}--${variant}` : '';

  return (
    <Tag className={`${className} Title Title__${type} ${modifier}`} {...props}>
      {children}
    </Tag>
  );
};

Title.propTypes = {
  Tag: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  type: PropTypes.oneOf([
    'title1',
    'title2',
    'title3',
    'title4',
    'title5',
    'title6'
  ])
};

export default Title;
