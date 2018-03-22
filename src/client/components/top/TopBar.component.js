import React from 'react';
import Link from '../general/Link.component';
import {HISTORY_PUSH, HISTORY_PUSH_FORCE_REFRESH} from '../../redux/middleware';
import {ON_LOGOUT_REQUEST} from '../../redux/user.reducer';
import logo from '../../logo.svg';
import ShortListDropDown from '../list/ShortListDropDown.container';
import ProfileImage from '../general/ProfileImage.component';

export default function TopBar(props) {
  // eslint-disable-line no-unused-vars
  return (
    <div className="row topbar container">
      <div
        className="col-xs-6 text-left header"
        onClick={() => {
          props.dispatch({type: HISTORY_PUSH, path: '/'});
        }}
      >
        <div>
          <img src={logo} alt="logo" />
        </div>
        <div>
          <h1>Læsekompasset</h1>
        </div>
      </div>
      <div className="col-xs-6 text-right login">
        <div className="inline">
          <Link href="/filter">
            <i className="glyphicon glyphicon-search icon" />
          </Link>
        </div>
        <ShortListDropDown />
        {!props.user.isLoggedIn && (
          <span
            onClick={() => {
              props.dispatch({
                type: HISTORY_PUSH_FORCE_REFRESH,
                path: '/v1/login'
              });
            }}
          >
            Log ind
          </span>
        )}
        {props.user.isLoggedIn && (
          <div className="inline">
            <Link href="/profile">
              <ProfileImage type="top" user={props.user} />
            </Link>
            <span
              className="topbar-logout ml2"
              onClick={() => {
                props.dispatch({type: ON_LOGOUT_REQUEST});
              }}
            >
              Log ud
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
