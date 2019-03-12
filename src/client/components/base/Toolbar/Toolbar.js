import React from 'react';
import PropTypes from 'prop-types';
import './Toolbar.css';

const TOOLBAR_ALIGN = 'align';
const TOOLBAR_LEFT = 'left';
const TOOLBAR_CENTER = 'center';
const TOOLBAR_RIGHT = 'right';

let constructElement = item => {
  const propsWithoutAlign = {};
  Object.keys(item.props).forEach(key => {
    if (key !== TOOLBAR_ALIGN) {
      propsWithoutAlign[key] = item.props[key];
    }
  });
  return React.createElement(item.type, propsWithoutAlign, item.props.children);
};

const Toolbar = ({children}) => {
  return (
    <div className="Toolbar">
      <div className="Toolbar__left">
        {children
          .filter(items => items.props.align === TOOLBAR_LEFT)
          .map(item => constructElement(item))}
      </div>
      <div className="Toolbar__center">
        {children
          .filter(items => items.props.align === TOOLBAR_CENTER)
          .map(item => constructElement(item))}
      </div>
      <div className="Toolbar__right">
        {children
          .filter(items => items.props.align === TOOLBAR_RIGHT)
          .map(item => constructElement(item))}
      </div>
    </div>
  );
};

Toolbar.propTypes = {
  align: PropTypes.oneOf([TOOLBAR_LEFT, TOOLBAR_CENTER, TOOLBAR_RIGHT])
};

export default Toolbar;
