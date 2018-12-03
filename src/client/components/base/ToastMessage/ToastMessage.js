import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';

import './ToastMessage.css';

const ToastMessage = ({
  icon = false,
  type = 'success',
  lines = [],
  className,
  ...props
}) => {
  return (
    <div className={`${className || ''} ${type || ''} ToastMessage`} {...props}>
      {icon && (
        <Icon name={icon} className="ToastMessage__Icon md-medium mr1" />
      )}
      <span className="ToastMessage__Lines">
        {lines.map(line => (
          <span key={line} className="ToastMessage__Line">
            {line}
          </span>
        ))}
      </span>
    </div>
  );
};

ToastMessage.propTypes = {
  type: PropTypes.oneOf(['success', 'info', 'danger'])
};

export default ToastMessage;
