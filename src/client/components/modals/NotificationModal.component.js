import React from 'react';
import Notification from '../general/Notification/Notification.component';
import Modal from './Modal/Modal.component';

/**
 * This class shows a notification in a Modal box
 */

export default class NotificationModal extends React.Component {
  render() {
    return (
      <Modal
        className="notification--modal"
        onClose={this.props.context.onCancel}
        onDone={this.props.context.onCancel}
        hideCancel={this.props.context.hideCancel}
        hideConfirm={this.props.context.hideConfirm}
        doneText={this.props.context.doneText}
        cancelText={this.props.context.cancelText}
      >
        {<Notification {...this.props.context} />}
      </Modal>
    );
  }
}
