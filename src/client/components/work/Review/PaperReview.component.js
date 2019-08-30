import React from 'react';
import {timestampToShortDate} from '../../../utils/dateTimeFormat';
import './Review.css';
import Title from '../../base/Title';
import Text from '../../base/Text';
import {connect} from 'react-redux';
import ReviewRating from './ReviewRating.component';
import Link from '../../general/Link.component';
import {OPEN_MODAL} from "../../../redux/modal.reducer";

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
    const infomediaData = review.infomedia;
 //   console.log("infomediaData",infomediaData)
    const creator = review.creatorOth && review.creatorOth[0];
    let date =
      (review.isPartOf &&
        review.isPartOf[0].split(',')[1] &&
        review.isPartOf[0].split(',')[1]) ||
      null;
    date = date
      ? timestampToShortDate(
        new Date(
          date.split('-')[0],
          parseInt(date.split('-')[1], 10) - 1,
          date.split('-')[2]
        )
      )
      : null;
    date = date.split(' ')[1] !== 'undefined' ? date : review.date;
    const source =
      review.isPartOf &&
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
          <div className="Review__block--title mb-0 d-flex">
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
            <Text type="small" className="due-txt mb-0">
              {date}
            </Text>
          )}
        </div>
        {creator && creator.trim() !== '' && (
          <Text type="body" className="Review__block--lector mb-1">
            Af {creator}
          </Text>
        )}
        <Link
          className="Review__block--link mb0"
          type="small"
          onClick={() => {
            this.props.showReviewModal(
              'paperReview',
              this.props.book,
              review
            );
          }}
        >
          Læs anmeldelsen
        </Link>

        {false && (
          <Text>
            <a
              className="Review__block--link mb0 tooltips"
              type="small"
              onClick={() => {
              }}
              target="_blank"
              href={
                review.identifierURI && review.identifierURI[0]
                  ? review.identifierURI[0]
                  : null
              }
            >
              Læs anmeldelsen
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


export default connect(mapStateToProps, mapDispatchToProps)(PaperReview);
