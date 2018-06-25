import React from 'react';
import './Text.css';
import '../skeleton.css';

function createLines(n, color) {
  let lines = [];
  for (let i = 0; i < n; i++) {
    lines.push(
      <div className="Skeleton__text__line" style={{backgroundColor: color}} />
    );
  }
  return lines;
}

const Text = ({className, lines = 3, color = '#f8f8f8', styles, children}) => {
  return (
    <div className={`Skeleton__text ${className || ''}`} style={styles}>
      {createLines(lines, color)}
    </div>
  );
};

export default Text;
