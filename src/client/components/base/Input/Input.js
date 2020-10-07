import React from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  inputRef = null,
  value = '',
  placeholder,
  onChange,
  children,
  className,
  ...props
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
        data-cy={props['data-cy'] || ''}
        aria-label={placeholder}
        tabindex="0"
      />
    </div>
  );
};

export default Input;
