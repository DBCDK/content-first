import React from 'react';

export default (props) => (
  <span onClick={props.onClick} className={`checkmark-btn btn${props.marked ? ' checkmark-btn-marked' : ' checkmark-btn-unmarked'}`}>
    <span style={{paddingRight: '0px'}} className="work-item--remember-btn-label">{props.label}</span>
    <div style={{paddingLeft: '10px', fontSize: '10px', width: '20px', display: 'inline-block'}} className={props.marked ? 'glyphicon glyphicon-ok' : ''}/>
  </span>
);
