import React from 'react';

export default function TopBar(props) { // eslint-disable-line no-unused-vars
  return (
    <div className='row topbar'>
      <div className='col-xs-6 text-left header'>
        <h1>Læsekompasset</h1>
      </div>
      <div className='col-xs-6 text-right login'>Log ind</div>
    </div>
  );
}
