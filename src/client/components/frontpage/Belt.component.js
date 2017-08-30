import React from 'react';

export default function Belt(props) {
  return (
    <div className='row belt'>
      {props.belt.name}
    </div>
  );
};
