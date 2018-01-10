import React from 'react';
export default props => {
  return (
    <div className="line-behind-text text-center">
      <span
        className="line-behind-text--label"
        style={{backgroundColor: props.backgroundColor}}
      >
        {props.label}
      </span>
      <div className="line-behind-text--line" />
    </div>
  );
};
