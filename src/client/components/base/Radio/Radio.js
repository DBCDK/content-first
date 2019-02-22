import React from 'react';
import './Radio.css';

// icons from:
// https://material.io/tools/icons/?icon=local_library&style=round

const Radio = ({group, checked, onChange, children, className}) => {
  return (
    <label className={`Radio__wrap ${className}`}>
      {children}
      <input
        name={group}
        className={`Radio`}
        type="radio"
        checked={checked}
        onChange={e => onChange}
      />
      <span className="Radio__button" />
    </label>
  );
};

export default Radio;

// <div className="Radio__wrap">
//
//   <input className={`Radio ${children ? 'mr-2' : ''}`} type="radio" />
//   {children && <label className="Radio__label">{children}</label>}
//
// </div>
