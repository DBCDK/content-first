import React from 'react';
import './Icon.css';

// Icon name to unicode hex map
import map from '../../../style/fonts/material-icons/MaterialIcons-Regular.json';

// icons from:
// https://material.io/tools/icons/?icon=local_library&style=round

const Icon = ({
  name,
  className = '',
  disabled = false,
  onClick = null,
  ...props
}) => {
  const classDisabled = disabled ? 'md-disabled' : '';

  //  Detect if icon name has a hex version in the json map
  const isUnicode = !!map[name];

  // Returns the hex version of the icon if available in the map
  const unicode = isUnicode ? `&#x${map[name]};` : name;

  return (
    <i
      dangerouslySetInnerHTML={{__html: isUnicode ? unicode : null}}
      className={`material-icons material-icons-${name} ${className} ${classDisabled}`}
      data-unicoded={isUnicode ? 'true' : 'false'}
      onClick={e => {
        if (!disabled && onClick) {
          onClick(e);
        }
      }}
      {...props}
    />
  );
};

export default Icon;
