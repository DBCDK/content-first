import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
export default props => {
  return (
    <ReactCSSTransitionGroup
      transitionName="popover"
      transitionEnterTimeout={200}
      transitionLeaveTimeout={200}
    >
      {props.show && (
        <div
          className={`popover ${props.className}`}
          style={{display: 'block', padding: 15, minHeight: 60, ...props.style}}
        >
          <div className="arrow" style={{top: 30}} />
          {props.children}
        </div>
      )}
    </ReactCSSTransitionGroup>
  );
};
