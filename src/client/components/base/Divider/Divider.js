import React from 'react';
import './Divider.css';

const Divider = props => {
  var newProps = {...props, className: 'Divider ' + props.className};
  return <div {...newProps} />;
};

export default Divider;
