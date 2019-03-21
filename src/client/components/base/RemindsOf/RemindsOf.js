import React from 'react';
import Text from '../Text';
import T from '../T';
import './RemindsOf.css';

const Logo = () => {
  return (
    <div className="diblio-logo mr-2">
      <div />
      <div />
      <div />
    </div>
  );
};

const RemindsOf = ({className = null, onClick = null, ...props}) => {
  return (
    <div
      className={`RemindsOf pt-1 pr-3 pb-1 pl-3 ${className}`}
      onClick={onClick}
      {...props}
    >
      <Logo />
      <Text
        type="body"
        variant="color-white--weight-semibold--transform-uppercase"
      >
        <T component="work" name="remindsOf" />
      </Text>
    </div>
  );
};

export default RemindsOf;
