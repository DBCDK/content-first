import React from 'react';
import {HISTORY_PUSH, HISTORY_PUSH_FORCE_REFRESH} from '../redux/middleware';
import {ON_LOGOUT_REQUEST} from '../redux/profile.reducer';
import logo from '../logo.svg';

export default function TopBar(props) { // eslint-disable-line no-unused-vars
  return (
    <div className='row topbar'>
      <div className='col-xs-6 text-left header' onClick={() => {
        props.dispatch({type: HISTORY_PUSH, path: '/'});
      }}>
        <div><img src={logo} alt='logo'/></div>
        <div><h1>Læsekompasset</h1></div>
      </div>
      <div className='col-xs-6 text-right login'>
        {!props.user.isLoggedIn && <span onClick={() => {
          props.dispatch({type: HISTORY_PUSH_FORCE_REFRESH, path: '/v1/login'});
        }}>Log ind</span>}
        {props.user.isLoggedIn &&
          <div>
            <span onClick={() => {
              props.dispatch({type: HISTORY_PUSH, path: '/profile'});
            }}>Min profil</span>
            <span onClick={() => {
              props.dispatch({type: ON_LOGOUT_REQUEST});
              props.dispatch({type: HISTORY_PUSH, path: '/'});
            }}>Log ud</span>
          </div>}
      </div>
    </div>
  );
}
