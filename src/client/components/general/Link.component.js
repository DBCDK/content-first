import React from 'react';
import {connect} from 'react-redux';
import {HISTORY_PUSH, HISTORY_REPLACE} from '../../redux/middleware';

const Link = ({
  href,
  className = 'list-card-nohover',
  children = '',
  dispatch,
  replace = false,
  params = {}
}) => (
  <a
    className={className}
    href={href}
    onClick={e => {
      if (replace) {
        dispatch({type: HISTORY_REPLACE, path: href, params});
      } else {
        dispatch({type: HISTORY_PUSH, path: href, params});
      }
      e.preventDefault();
    }}
  >
    {children}
  </a>
);

export default connect()(Link);
