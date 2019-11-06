import React from 'react';
import {connect} from 'react-redux';
import {HISTORY_PUSH, HISTORY_NEW_TAB} from '../../redux/middleware';

import './Link.css';

const Link = ({
  href,
  type = HISTORY_PUSH,
  className = '',
  noHover = true,
  children = '',
  dispatch,
  onClick,
  params = {},
  dataCy,
  meta,
  disable = false,
  style = {},
  ...props
}) => {
  if (disable) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  const noHoverClass = noHover ? 'link--no-hover' : '';

  return (
    <a
      className={`link ${className} ${noHoverClass}`}
      href={href}
      style={style}
      onClick={e => {
        if (type !== HISTORY_NEW_TAB) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (onClick) {
          onClick();
        }
        dispatch({type: type, path: href, params, meta});
      }}
      target={type === HISTORY_NEW_TAB ? '_blank' : '_self'}
      data-cy={props['data-cy'] || dataCy || ''}
    >
      {children}
    </a>
  );
};

export default connect()(Link);
