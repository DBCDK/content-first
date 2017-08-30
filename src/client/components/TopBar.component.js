import React from 'react';

export default function TopBar(props) {
  return (
    <div className='row topbar'>
      <div className='col-xs-6 text-left header'>Læsekompasset</div>
      <div className='col-xs-6 text-right login'>Log ind</div>
    </div>
  );
}
