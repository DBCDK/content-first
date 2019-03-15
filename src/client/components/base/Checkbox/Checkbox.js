import React from 'react';
import './Checkbox.css';

const Checkbox = ({value = '', children, onChange, checked, className}) => {
  return (
    <label className={`Checkbox__wrap`}>
      {children}
      <input
        className={`Checkbox ${className}`}
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span className="Checkbox__button" />
    </label>
  );
};

export default Checkbox;
