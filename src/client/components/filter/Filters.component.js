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

const FilterSelect = (props) => {

  let selectedText = null
  props.filter.options.forEach(o => {
    if (o.selected) {
      selectedText = o.title;
    }
  });

  const selectWidth = getWidth(selectedText, 'select-wrapper');

  return (
    <div className='select-wrapper'>
      <select value={selectedText} style={{width: selectWidth + 35}} onChange={(e) => {
        props.onSelect(e.target.value);
      }}>
        <optgroup label={props.filter.title}>
          {props.filter.options.map((option, idx) => <option key={idx}>{option.title}</option>)}
        </optgroup>
      </select>
      <span onClick={() => {
        console.log('Remove that filter');
      }}>X</span>
    </div>
  );
};

const Filters = (props) => {
  return (
    <div className='filters text-left'>
      {props.filters.map((filter, idx) => <FilterSelect key={idx} onSelect={val => props.onSelect(filter.title, val)} filter={filter}/>)}
    </div>
  );
};
export default Filters;
