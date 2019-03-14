import React from 'react';
import PropTypes from 'prop-types';
import './Toolbar.css';

const TOOLBAR_LEFT = 'left';
const TOOLBAR_CENTER = 'center';
const TOOLBAR_RIGHT = 'right';

let constructElement = item => {
  const {align, ...props} = item.props; // eslint-disable-line no-unused-vars
  return React.createElement(item.type, props, item.props.children);
};

const Toolbar = ({className, ...props}) => {
  const elements = Array.isArray(props.children)
    ? props.children
    : [props.children];
  return (
    <div className={`Toolbar ${className || ''}`} {...props}>
      <div className="Toolbar__left">
        {elements
          .filter(items => items.props.align === TOOLBAR_LEFT)
          .map(item => constructElement(item))}
      </div>
      <div className="Toolbar__center">
        {elements
          .filter(items => items.props.align === TOOLBAR_CENTER)
          .map(item => constructElement(item))}
      </div>
      <div className="Toolbar__right">
        {elements
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
