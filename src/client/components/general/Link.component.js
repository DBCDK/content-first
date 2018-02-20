import React from 'react';
import {connect} from 'react-redux';
import {HISTORY_PUSH} from '../../redux/middleware';

const Link = ({href, className = '', children = '', dispatch}) => (
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
);

export default connect()(Link);
