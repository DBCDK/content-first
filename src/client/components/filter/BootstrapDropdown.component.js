import React from 'react';

const Dropdown = (props) => {
  return (
    <div className='dropdown'>
      <span className='dropdown-toggle' id={props.id} data-toggle='dropdown'>{props.selected}</span>
      <ul className='dropdown-menu' role='menu' aria-labelledby={props.id}>
        {props.options.map((option, idx) => <li role='presentation' key={idx}><a onClick={e => {
          props.onChange(option);
          e.preventDefault();
          return false;
        }} role='menuitem' tabIndex='-1' href=''>{option}</a></li>)}
      </ul>
    </div>
  );
};

export default Dropdown;
