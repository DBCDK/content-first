import React from 'react';
import './Textarea.css';

const Textarea = ({
  textRef = null,
  value,
  placeholder,
  onChange = null,
  onFocus = null,
  onBlur = null,
  children,
  className,
  wrapClassName,
  wrapStyles = {}
}) => {
  return (
    <div className={`Textarea__wrap ${wrapClassName}`} style={wrapStyles}>
      {children && <label className={`Textarea__label`}>{children}</label>}
      <textarea
        ref={textRef}
        className={`Textarea ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
};

export default Textarea;
