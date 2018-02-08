import React from 'react';
import Kryds from '../svg/Kryds.svg';

export default class Modal extends React.Component {
  render() {
    const {doneText = 'OK'} = this.props;

    return (
      <div className="modal-container">
        <div className="modal-backdrop" onClick={this.props.onClose}></div>
        <div
          className={`modal-window text-left ${
            this.props.className ? this.props.className : ''
          }`}
        >
          <img
            src={Kryds}
            alt="luk"
            className="modal-window--close-btn"
            onClick={this.props.onClose}
          />
          <div className="modal-window--header text-center">
            <h3>{this.props.header}</h3>
          </div>
          <div className="modal-window--content">{this.props.children}</div>
          <div className="modal-window--buttons text-center">
            <span className="btn btn-success" onClick={this.props.onDone}>
              {doneText}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
