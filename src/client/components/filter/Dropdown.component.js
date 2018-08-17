import React from 'react';

// a hack to get the width of the select element
const getWidth = (text, className) => {
  var tmp = document.createElement('div');
  tmp.className = className;
  tmp.innerHTML = text;
  tmp.style.visibility = 'hidden';
  tmp.style.display = 'inline-block';
  tmp.style.position = 'absolute';
  document.body.appendChild(tmp);
  const width = tmp.clientWidth;
  document.body.removeChild(tmp);
  return width;
};

const Dropdown = props => {
  return (
    <select
      style={{
        width: getWidth(props.selected, props.className) + props.margin + 'px'
      }}
      value={props.selected}
      onChange={e => {
        props.onChange(e.target.value);
      }}
    >
      {props.options.map((option, idx) => (
        <option key={idx}>{option}</option>
      ))}
    </select>
  );
};

export default Dropdown;
