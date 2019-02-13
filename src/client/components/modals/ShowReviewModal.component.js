import React from 'react';
import Review from '../work/Review.component';
import Modal from './Modal.component';

/**
 * This class shows a review in a Modal box
 */
export default class ShowReviewModal extends React.Component {
  render() {
    return (
      <Modal
        className="show-review--modal"
        onClose={this.props.context.onCancel}
        hideCancel={this.props.context.hideCancel}
        hideConfirm={this.props.context.hideConfirm}
        doneText={this.props.context.confirmText}
        cancelText="Fortryd"
      >
        <Review
          reviewType={this.props.context.reviewType}
          view={this.props.context.view}
          review={this.props.context.review}
          book={this.props.context.book}
        />
      </Modal>
    );
  }
}
