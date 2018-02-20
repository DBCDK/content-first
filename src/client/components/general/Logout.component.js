import React from 'react';
import {connect} from 'react-redux';
import {ON_LOGOUT_REQUEST} from '../../redux/user.reducer';

export const LogoutLink = ({
  href = '/v1/login',
  className,
  children = '',
  dispatch
}) => (
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
);

export default connect()(LogoutLink);
