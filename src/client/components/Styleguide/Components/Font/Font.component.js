import React from 'react';
import './Font.css';

const Font = ({title, className = '', styles}) => {
  return (
    <div className={`${className} Font`} style={styles}>
      {title}
    </div>
  );
};

export default Font;
