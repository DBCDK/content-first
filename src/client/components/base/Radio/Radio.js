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
        tabIndex={-1}
        role="checkbox"
        aria-checked={checked}
        title={group}
      />
      <span
        className="Radio__button"
        role="checkbox"
        tabIndex="0"
        onChange={onChange}
        checked={checked}
        title={group + '_selector'}
      />
    </label>
  );
};

export default Radio;
