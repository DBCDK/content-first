import React from 'react';
import {HISTORY_PUSH} from '../redux/middleware';

export default function TopBar(props) { // eslint-disable-line no-unused-vars
  return (
    <div className='row topbar'>
      <div className='col-xs-6 text-left header' onClick={() => {
        props.dispatch({type: HISTORY_PUSH, path: '/'});
      }}>
        <div><img src='/logo.png' alt='logo'/></div>
        <div><h1>Læsekompasset</h1></div>
      </div>
      <div className='col-xs-6 text-right login'><span>Log ind</span></div>
    </div>
  );
}
