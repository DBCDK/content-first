import React from 'react';
import {timestampToLongDate} from '../../utils/dateTimeFormat';
import './Review.css';
import Title from '../base/Title';
import Text from '../base/Text';
import {OPEN_MODAL} from '../../redux/modal.reducer';
import {connect} from 'react-redux';
import Link from '../general/Link.component';

/**
 * This class displays a single review item
 */
export class Review extends React.Component {
  /**
   * render
   * @returns {*}
   */
  render() {
    const view =
      typeof this.props.view === 'undefined'
        ? 'full'
        : this.props.view === 'full'
          ? 'full'
          : 'resume';
    const reviewType = this.props.reviewType;
    if (this.props.review === false) {
      return '';
    }
    const author = this.props.book.creator;
    const title = this.props.book.title;
    if (reviewType === 'fullTextReviews') {
      // Handle fullTextReviews
      const review = this.props.review;
      const name =
        typeof review.reviewer === 'undefined'
          ? false
          : (review.reviewer.firstname !== 'undefined'
              ? review.reviewer.firstname
              : '') +
            ' ' +
            (review.reviewer.surname !== 'undefined'
              ? review.reviewer.surname
              : '');
      const date =
        typeof review.creationDate === 'undefined'
          ? ''
          : timestampToLongDate(review.creationDate);
      if (typeof review.review === 'undefined' || review.review === null) {
        return '';
      }
      const reviewKeys = Object.keys(review.review);
      if (view === 'full') {
        var paragraphNumber = 0;
        return (
          <div className="Review__container mr-4 mb-5">
            <div className="Review__block--top">
              <Text type="micro" className="mb3">
                Bibliotekernes vurdering af {author}: {title}
              </Text>
              <Text type="small" className="due-txt">
                {date}
              </Text>
            </div>
            {reviewKeys.map(key => {
              return (
                <React.Fragment key={key}>
                  <Title Tag="h6" type="title6" className="mb0">
                    {key}
                  </Title>
                  {paragraphNumber++ === 0 ? (
                    <Title Tag="h5" type="title5" className="mb2">
                      {review.review[key]}
                    </Title>
                  ) : (
                    <Text type="body">{review.review[key]}</Text>
                  )}
                </React.Fragment>
              );
            })}
            <Text type="body" className="mb0">
              Lektørudtalelse
            </Text>
            {name !== false &&
              name.trim() !== '' && (
                <Text type="body" className="mb0">
                  {name}
                </Text>
              )}
          </div>
        );
      }
      // view === 'resume'
      const reviewParagraph =
        typeof review.review.Vurdering !== 'undefined'
          ? review.review.Vurdering
          : review.review[reviewKeys[0]]; // If Vurdering is not present, take the first review paragraph
      return (
        <div className="Review__container mr-4 mb-5">
          <div className="Review__block--top">
            <Title Tag="h6" type="title6">
              Bibliotekernes vurdering
            </Title>
            <Text type="small" className="due-txt">
              {date}
            </Text>
          </div>
          {name !== false &&
            name.trim() !== '' && (
              <Text type="body" className="mb0">
                Af {name}
              </Text>
            )}
          <Text type="body">
            <em>{reviewParagraph}</em>
          </Text>
          <Text>
            <Link
              className="mb0"
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
    return ''; // Non-handled review types
  }
}

/**
 *
 * @returns {{}}
 */
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
        view: 'full',
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
)(Review);
