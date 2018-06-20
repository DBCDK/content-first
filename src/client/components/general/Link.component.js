import React from 'react';
import {connect} from 'react-redux';
import {HISTORY_PUSH, HISTORY_REPLACE} from '../../redux/middleware';

const Link = ({
  href,
  type = HISTORY_PUSH,
  className = 'list-card-nohover',
  children = '',
  dispatch,
  params = {}
}) => (
  <a
    className={className}
    href={href}
    onClick={e => {
      e.preventDefault();
      dispatch({type: type, path: href, params});
    }}
  >
    {children}
  </a>
);

export default connect()(Link);
