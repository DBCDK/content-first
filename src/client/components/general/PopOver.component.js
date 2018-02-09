import React from 'react';
export default props => {
  return (
    <div
      className={`popover fade in ${props.className}`}
      style={{display: 'block', minHeight: 60, ...props.style}}
    >
      <div className="arrow" style={{top: 30}} />
      {props.children}
    </div>
  );
};
