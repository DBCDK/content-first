import React from 'react';
import {connect} from 'react-redux';
import {HISTORY_PUSH, HISTORY_NEW_TAB} from '../../redux/middleware';

const Link = ({
  href,
  type = HISTORY_PUSH,
  className = 'list-card-nohover',
  children = '',
  dispatch,
  onClick,
  params = {},
  dataCy,
  meta,
  disable = false,
  style = {},
  ...props
}) =>
  disable ? (
    <React.Fragment>{children}</React.Fragment>
  ) : (
    <a
      className={className}
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

export default connect()(Link);
