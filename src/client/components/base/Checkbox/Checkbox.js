import React from 'react';
import './Checkbox.css';

// icons from:
// https://material.io/tools/icons/?icon=local_library&style=round

const Checkbox = ({group, children, className, ...props}) => {
  return (
    <label className="Checkbox__wrap">
      {children}
      <input className={`Checkbox`} type="checkbox" name={group} />
      <span className="Checkbox__button" />
    </label>
  );
};

export default Checkbox;

// <div className="Radio__wrap">
//
//   <input className={`Radio ${children ? 'mr-2' : ''}`} type="radio" />
//   {children && <label className="Radio__label">{children}</label>}
//
// </div>
