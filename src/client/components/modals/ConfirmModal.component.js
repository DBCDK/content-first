import React from 'react';
export default class Modal extends React.Component {
  render() {
    return (
      <div className="modal-container">
        <div className="modal-backdrop" onClick={this.props.onClose} />
        <div
          className={`modal-window text-left p-4 ${
            this.props.className ? this.props.className : ''
          }`}
        >
          <i
            className="material-icons modal-window--close-btn"
            onClick={this.props.context.onCancel}
          >
            clear
          </i>
          <div className="modal-window--header text-left">
            <h3>{this.props.context.title}</h3>
          </div>
          <div className="modal-window--content">
            <p>{this.props.context.reason}</p>
          </div>
          <div className="modal-window--buttons text-right">
            <span
              className="btn btn-success"
              onClick={this.props.context.onConfirm}
            >
              {this.props.context.confirmText}
            </span>
            <span className="btn " onClick={this.props.context.onCancel}>
              Fortryd
            </span>
          </div>
        </div>
      </div>
    );
  }
}
