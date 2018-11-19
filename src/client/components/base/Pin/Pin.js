import React from 'react';
import Icon from '../Icon';
import Text from '../Text';
import './Pin.css';

const Pin = ({
  Tag = 'h1',
  type = 'title3',
  active = false,
  text = false,
  className = '',
  ...props
}) => {
  const status = active ? 'active' : 'default';

  return (
    <div className={`Pin Pin__${status} ${className}`} {...props}>
      <Icon name="flag" />
      {text && (
        <Text className="m-0 ml-2 align-self-center" type="small">
          {text}
        </Text>
      )}
    </div>
  );
};

export default Pin;
