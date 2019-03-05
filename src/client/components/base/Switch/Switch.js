import React from 'react';
import './Switch.css';

const Switch = ({
  name = '',
  className = null,
  value = '',
  children,
  onChange,
  checked
}) => {
  return (
    <div className="Switch">
      <input
        className={`Switch__input ${className}`}
        id={`Switch-${name}`}
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={`Switch-${name}`} className="Switch__label">
        {children}
      </label>
    </div>
  );
};

export default Switch;
