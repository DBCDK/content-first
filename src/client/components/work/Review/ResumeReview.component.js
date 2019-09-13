import React from 'react';
import {timestampToShortDate} from '../../../utils/dateTimeFormat';
import './Review.css';
import Title from '../../base/Title';
import Text from '../../base/Text';
import {OPEN_MODAL} from '../../../redux/modal.reducer';
import {connect} from 'react-redux';
import Link from '../../general/Link.component';
import TruncateMarkup from 'react-truncate-markup';

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
    const date =
      (review.creationDate && timestampToShortDate(review.creationDate)) || '';
    if (typeof review.review === 'undefined' || review.review === null) {
      return '';
    }
    const reviewKeys = Object.keys(review.review);
    const reviewParagraph =
      typeof review.review.Vurdering !== 'undefined'
        ? review.review.Vurdering
        : review.review[reviewKeys[0]]; // If Vurdering is not present, take the first review paragraph
    return (
      <div className="Review__container mb-3">
        <div className="Review__block--top">
          <Title Tag="h6" type="title6" className="Review__block--title mb0">
            Bibliotekernes vurdering
          </Title>
          <Text type="small" className="due-txt mb0">
            {date}
          </Text>
        </div>
        {name !== false && name.trim() !== '' && (
          <Text type="body" className="Review__block--lector mb1">
            Af {name}
          </Text>
        )}
        <Text type="body" className="Review__block--paragraph mb0">
          <em>
            <TruncateMarkup lines={3} ellipsis="...">
              <span>{reviewParagraph}</span>
            </TruncateMarkup>
          </em>
        </Text>
        <Text>
          <Link
            className="Review__block--link mb0"
            type="small"
            onClick={() => {
              this.props.showReviewModal(
                this.props.reviewType,
                this.props.book,
                this.props.review
              );
            }}
          >
            Læs materialevurderingen
          </Link>
        </Text>
      </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResumeReview);
