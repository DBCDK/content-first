import React from 'react';

function Spinner(props) {
  const spinnerClass = props.className ? props.className : '';

  return (
    <span
      className={'spinner ' + spinnerClass}
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
