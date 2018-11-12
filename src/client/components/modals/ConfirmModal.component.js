import React from 'react';
import Paragraph from '../base/Paragraph';
import Modal from './Modal.component';
export default class ConfirmModal extends React.Component {
  render() {
    return (
      <Modal
        header={this.props.context.title}
        onDone={this.props.context.onConfirm}
        onClose={this.props.context.onCancel}
        hideCancel={this.props.context.hideCancel}
        hideConfirm={this.props.context.hideConfirm}
        doneText={this.props.context.confirmText}
        cancelText="Fortryd"
        url={this.props.context.url}
      >
        <Paragraph>{this.props.context.reason}</Paragraph>
      </Modal>
    );
  }
}
