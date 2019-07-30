import React from 'react';
import './Color.css';

const Color = ({title, hex, className = ''}) => {
  return (
    <div className={`${className} Color__wrap`}>
      <div className={'Color'} style={{backgroundColor: hex}} />
      <div className="Color__details">
        <div className="Color__title">{title}</div>
        <div className="Color__hex">{hex}</div>
      </div>
    </div>
  );
};

export default Color;
