import React from 'react';
import './Textarea.css';

const Textarea = ({
  textRef = null,
  value,
  placeholder,
  onChange,
  children,
  className
}) => {
  return (
    <div className={`Textarea__wrap`}>
      {children && <label className={`Textarea__label`}>{children}</label>}
      <textarea
        ref={textRef}
        className={`Textarea ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Textarea;
