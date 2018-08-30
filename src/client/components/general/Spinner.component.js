import React from 'react';

function Spinner(props) {
  return (
    <span
      className={'spinner ' + props.className || ''}
      style={Object.assign(
        {
          borderTopColor: props.color || null,
          display: 'inline-block',
          width: props.size || '100%',
          height: props.size || '100%'
        },
        props.style
      )}
    />
  );
}

export default Spinner;
