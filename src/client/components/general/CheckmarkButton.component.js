import React from 'react';

export default (props) => (
  <span onClick={props.onClick} className={`btn checkmark-btn${props.marked ? ' checked' : ''}`}>
    <span style={{paddingRight: '0px'}} className="checkmark-btn-label">{props.label}</span>
    <div style={{paddingLeft: '10px', fontSize: '10px', width: '20px', display: 'inline-block'}} className={props.marked ? 'glyphicon glyphicon-ok' : ''}/>
  </span>
);
