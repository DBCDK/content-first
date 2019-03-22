import React from 'react';
import {timestampToShortDate} from '../../../utils/dateTimeFormat';
import './Review.css';
import Title from '../../base/Title';
import Text from '../../base/Text';
import {OPEN_MODAL} from '../../../redux/modal.reducer';
import {connect} from 'react-redux';
import ReviewRating from './ReviewRating.component';
/**
 * This class displays a single paper review item
 * Creator and ful review link are hidden for now.
 */
export class PaperReview extends React.Component {
  render() {
    if (this.props.review === false) {
      return '';
    }
    const review = this.props.review;
    const creator = review.creatorOth[0];
    const date =
      (review.isPartOf[0].split(',')[1] &&
        timestampToShortDate(review.isPartOf[0].split(',')[1])) ||
      null;

    const source =
      review.isPartOf[0].split(',')[0] &&
      review.isPartOf[0].split(',')[0].replace('.dk online', '');

    const maxRating = review.abstract
      ? review.abstract[0]
          .trim()
          .replace('Vurdering:', '')
          .split('/')[1]
      : null;
    const rating = review.abstract
      ? review.abstract[0]
          .trim()
          .replace('Vurdering:', '')
          .split('/')[0]
      : null;
    const ratingShape = source === 'Politiken' ? 'favorite' : 'star';

    return (
      <div className={'Review__container mr-4 mb-3'}>
        <div className="Review__block--top">
          <div className="Review__block--title mb0 d-flex">
            <Title Tag="h6" type="title6" className="mb-0 mr-2">
              {source}
            </Title>
            <ReviewRating
              maxRating={maxRating}
              rating={rating}
              type={ratingShape}
            />
          </div>

          {date && (
            <Text type="small" className="due-txt mb0">
              {date}
            </Text>
          )}
        </div>
        {creator &&
          false &&
          creator.trim() !== '' && (
            <Text type="body" className="Review__block--lector mb1">
              Af {creator}
            </Text>
          )}

        {false && (
          <Text>
            <a
              className="Review__block--link mb0 tooltips"
              type="small"
              onClick={() => {}}
              target="_blank"
              href={
                review.identifierURI && review.identifierURI[0]
                  ? review.identifierURI[0]
                  : null
              }
            >
              Læs anmedelsen
              <span>
                Dit biblliotek har ikke adgang til artiklen i Infomedia
              </span>
            </a>
          </Text>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.userReducer.isLoggedIn
  };
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
)(PaperReview);
