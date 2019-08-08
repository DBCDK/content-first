import React from 'react';
import PropTypes from 'prop-types';
import './Toolbar.css';

const TOOLBAR_LEFT = 'left';
const TOOLBAR_CENTER = 'center';
const TOOLBAR_RIGHT = 'right';

const constructElement = (item, index) => {
  const {align, ...props} = item.props; // eslint-disable-line no-unused-vars
  return React.createElement(
    item.type,
    {key: index, ...props},
    item.props.children
  );
};

const constructElements = (elements, position) => {
  return elements
    .filter(item => item && item.props && item.props.align === position)
    .map((item, index) =>
      Array.isArray(item)
        ? constructElements(item, position)
        : constructElement(item, index)
    );
};

const Toolbar = ({className, ...props}) => {
  const elements = Array.isArray(props.children)
    ? props.children
    : [props.children];
  const allElements = [];
  elements.forEach(element => {
    if (Array.isArray(element)) {
      element.forEach(innerElement => allElements.push(innerElement));
    } else {
      allElements.push(element);
    }
  });
  return (
    <div className={`Toolbar ${className || ''}`} {...props}>
      <div className="Toolbar__left">
        {constructElements(allElements, TOOLBAR_LEFT)}
      </div>
      <div className="Toolbar__center">
        {constructElements(allElements, TOOLBAR_CENTER)}
      </div>
      <div className="Toolbar__right">
        {constructElements(allElements, TOOLBAR_RIGHT)}
      </div>
    </div>
  );
};

Toolbar.propTypes = {
  align: PropTypes.oneOf([TOOLBAR_LEFT, TOOLBAR_CENTER, TOOLBAR_RIGHT])
};

export default Toolbar;
