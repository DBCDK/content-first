import React from 'react';

export default class Modal extends React.Component {
  render() {
    const {doneText = 'OK'} = this.props;

    const status = this.props.doneDisabled ? 'disabled' : '';

    return (
      <div className="modal-container ">
        <div className="modal-backdrop" onClick={this.props.onClose} />
        <div
          className={`modal-window text-left p-4 ${
            this.props.className ? this.props.className : ''
          }`}
        >
          <i
            className="material-icons modal-window--close-btn mt-1"
            onClick={this.props.onClose}
          >
            clear
          </i>
          <div className="modal-window--header text-center">
            <h3>{this.props.header}</h3>
          </div>
          <div className="modal-window--content">{this.props.children}</div>
          <div className="modal-window--buttons text-center">
            <span
              className={`btn btn-success ${status}`}
              onClick={this.props.onDone}
            >
              {doneText}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
