import React from 'react';
import './Review.css';
import {OPEN_MODAL} from '../../../redux/modal.reducer';
import {connect} from 'react-redux';
import ReviewItem from './ReviewItem.component';
import T from '../../base/T';

/**
 * This class displays a single resume review item
 */
export class ResumeReview extends React.Component {
  render() {
    if (this.props.review === false) {
      return '';
    }
    const review = this.props.review;
    const firstname = (review.reviewer && review.reviewer.firstname) || '';
    const surname = (review.reviewer && review.reviewer.surname) || '';
    const name = (firstname + ' ' + surname).trim(); // Trim the space away in case of missing first- or surname
    if (typeof review.review === 'undefined' || review.review === null) {
      return '';
    }
    const reviewKeys = Object.keys(review.review);
    const reviewParagraph =
      typeof review.review.Vurdering !== 'undefined'
        ? review.review.Vurdering
        : review.review[reviewKeys[0]]; // If Vurdering is not present, take the first review paragraph
    return (
      <ReviewItem
        title={T({component: 'work', name: 'lectorsReview'})}
        date={new Date(review.creationDate)}
        author={name}
        reviewParagraph={reviewParagraph}
        buttonText={T({component: 'work', name: 'readLectorReview'})}
        onClick={() => {
          this.props.showReviewModal(
            this.props.reviewType,
            this.props.book,
            this.props.review
          );
        }}
      />
    );
  }
}

function mapStateToProps() {
  return {};
}

/**
 *
 * @param dispatch
 * @returns {{showReviewModal: showReviewModal}}
 */
export const mapDispatchToProps = dispatch => ({
  showReviewModal: (reviewType, book, review) => {
    dispatch({
      type: OPEN_MODAL,
      modal: 'showReview',
      context: {
        reviewType: reviewType,
        book: book,
        review: review,
        confirmText: 'Luk',
        hideCancel: true,
        hideConfirm: true,
        onCancel: () => {
          dispatch({
            type: 'CLOSE_MODAL',
            modal: 'showReview'
          });
        }
      }
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ResumeReview);
