import React from 'react';
import Text from '../Text';
import Icon from '../Icon';

import './Expand.css';

const Expand = ({title = '', className = null, onClick = null}) => {
  return (
    <div className="expand_wrap">
      <div
        className={`expand ${className}`}
        onClick={onClick}
        data-cy={'expand-button'}
      >
        <Text type="large">{title}</Text>
        <Icon name="keyboard_arrow_down" alt="Udvid" />
      </div>
    </div>
  );
};

export default Expand;
