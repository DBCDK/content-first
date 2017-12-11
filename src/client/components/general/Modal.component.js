import React from 'react';

export default (props) => {

  const hidden = props.show ? '' : ' modal-hidden';
  const {doneText='OK'} = props;

  return (
    <div className={`modal-backdrop${hidden}`}>
      <div className={`modal-window text-left${hidden} ${props.className ? props.className : ''}`}>
        <div className="modal-window--header text-center"><h3>{props.header}</h3></div>
        <div className="modal-window--content">
          {props.children}
        </div>
        <div className="modal-window--buttons text-center">
          <span className="btn btn-success" onClick={props.onDone}>{doneText}</span>
        </div>
      </div>
    </div>
  );
};
