import React from 'react';

export default (props) => {

  const hidden = props.show ? '' : ' modal-hidden';

  return (
    <div className={`modal-backdrop${hidden}`} onWheel={e => e.preventDefault()}>
      <div className={`modal-window text-left${hidden}`}>
        <div className="modal-window--header"><h3>{props.header}</h3></div>
        <div className="modal-window--content">
          {props.children}
        </div>
        <div className="modal-window--buttons text-right">
          <span className="btn btn-success" onClick={props.onClose}>OK</span>
        </div>
      </div>
    </div>
  );
};
