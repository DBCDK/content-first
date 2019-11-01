import React from 'react';

import './spinner.css';

function Spinner(props) {
  const spinnerClass = props.className ? props.className : '';
  const borderColor = props.color || 'var(--deYork)';

  return (
    <span
      className={'spinner ' + spinnerClass}
      data-cy={props['data-cy']}
      style={Object.assign(
        {
          borderTopColor: props.color || null,
          display: 'inline-block',
          width: props.size || '100%',
          height: props.size || '100%',
          borderColor,
          borderBottomColor: 'transparent'
        },
        props.style
      )}
    />
  );
}

export default Spinner;
