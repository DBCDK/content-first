import React from 'react';
import {connect} from 'react-redux';
import {HISTORY_PUSH} from '../../redux/middleware';

const Link = ({
  href,
  type = HISTORY_PUSH,
  className = 'list-card-nohover',
  children = '',
  dispatch,
  onClick,
  params = {}
}) => (
  <a
    className={className}
    href={href}
    onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      dispatch({type: type, path: href, params});
      if (onClick) {
        e => onClick();
      }
    }}
  >
    {children}
  </a>
);

export default connect()(Link);
