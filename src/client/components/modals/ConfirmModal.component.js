import React from 'react';
import Modal from './Modal/Modal.component';
export default class ConfirmModal extends React.Component {
  render() {
    return (
      <Modal
        className={this.props.context.className}
        header={this.props.context.title}
        onDone={this.props.context.onConfirm || this.props.close} // if no onConfirm functions is provided the confirm button will close the modal when clicked
        onClose={this.props.close}
        hideCancel={this.props.context.hideCancel}
        hideConfirm={this.props.context.hideConfirm}
        doneText={this.props.context.confirmText}
        cancelText="Fortryd"
        url={this.props.context.url}
      >
        {this.props.context.reason}
      </Modal>
    );
  }
}
