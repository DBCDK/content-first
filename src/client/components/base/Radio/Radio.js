import React from 'react';
import './Radio.css';

const Radio = ({
  className = '',
  value = '',
  group,
  onChange,
  checked = false,
  children,
  ...props
}) => {
  return (
    <label className={`Radio__wrap`} data-cy={props['data-cy']}>
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
