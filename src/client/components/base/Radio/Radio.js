import React from 'react';
import './Radio.css';

const Radio = ({value, group, onChange, checked, children, className}) => {
  return (
    <label className={`Radio__wrap`}>
      {children}
      <input
        className={`Radio ${className}`}
        name={group}
        value={value}
        type="radio"
        checked={checked}
        onChange={onChange}
      />
      <span className="Radio__button" />
    </label>
  );
};

export default Radio;
