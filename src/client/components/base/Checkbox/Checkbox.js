import React from 'react';
import './Checkbox.css';
import Radio from '../Radio';

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
        tabIndex={0}
        role="checkbox"
        aria-checked={checked}
      />
      <span className="Checkbox__button" tabIndex={-1} />
    </label>
  );
};

export default Checkbox;
