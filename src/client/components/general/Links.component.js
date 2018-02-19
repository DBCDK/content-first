import React from 'react';
import {connect} from 'react-redux';
import {HISTORY_PUSH} from '../../redux/middleware';
import {ON_LOGOUT_REQUEST} from '../../redux/user.reducer';

export const Link = connect()(
  ({href, className = '', children = '', dispatch}) => (
    <a
      className={className}
      href={href}
      onClick={e => {
        dispatch({type: HISTORY_PUSH, path: href});
        e.preventDefault();
      }}
    >
      {children}
    </a>
  )
);

export const LogoutLink = connect()(
  ({href='/v1/login', className, children = '', dispatch}) => (
    <a
      className={className}
      href={href}
      onClick={e => {
        dispatch({type: ON_LOGOUT_REQUEST, path: href});
        e.preventDefault();
      }}
    >
      {children}
    </a>
  )
);
