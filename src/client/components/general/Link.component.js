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
  params = {},
  dataCy
}) => (
  <a
    className={className}
    href={href}
    onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      dispatch({type: type, path: href, params});
      if (onClick) {
        onClick();
      }
    }}
    data-cy={dataCy || ''}
  >
    {children}
  </a>
);

export default connect()(Link);
