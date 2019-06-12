import React from 'react';
import './Checkbox.css';

const Checkbox = ({
  className = '',
  value = '',
  children,
  onChange,
  checked = false
}) => {
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
