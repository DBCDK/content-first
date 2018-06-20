import React from 'react';
import PropTypes from 'prop-types';
import './Paragraph.css';

const Paragraph = ({type = 'whattocall', children, className, ...props}) => {
  return (
    <p className={`${className || ''} Paragraph Paragraph__${type}`} {...props}>
      {children}
    </p>
  );
};

Paragraph.propTypes = {
  type: PropTypes.oneOf(['whattocall'])
};

export default Paragraph;
