import React from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  inputRef = null,
  value = '',
  placeholder,
  onChange,
  children,
  className
}) => {
  return (
    <div className="Input__wrap">
      {children && <label className={`Input__label`}>{children}</label>}
      <input
        type={type}
        ref={inputRef}
        className={`Input ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
