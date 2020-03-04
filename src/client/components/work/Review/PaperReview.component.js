import React from 'react';
import './Review.css';
import {connect} from 'react-redux';
import {OPEN_MODAL} from '../../../redux/modal.reducer';
import T from '../../base/T';
import ReviewItem from './ReviewItem.component';

/**
 * This class displays a single (news)paper review item
 * Creator and full review links are hidden for now.
 */
export class PaperReview extends React.Component {
  render() {
    if (this.props.review === false) {
      return '';
    }

    const review = this.props.review;
    const infomediaData = review.infomedia;

    const loggedIn = this.props.isLoggedIn;
    const isKiosk = this.props.isKiosk;

    let showLink =
      typeof this.props.showLink !== 'undefined' ? this.props.showLink : true;
    let permission = true;
    if (infomediaData) {
      permission = infomediaData.statusCode !== 403;
      showLink = infomediaData.length > 0 || !loggedIn;
    }
    const creator = review.creatorOth && review.creatorOth[0];
    const shortDate =
      (review.isPartOf &&
        review.isPartOf[0] &&
        review.isPartOf[0].split(',')[1] &&
        review.isPartOf[0].split(',')[1]) ||
      null;
    const date = shortDate
      ? new Date(
          shortDate.split('-')[0],
          parseInt(shortDate.split('-')[1], 10) - 1,
          shortDate.split('-')[2]
        )
      : review.date;
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

    function allowAccess() {
      if (permission && isKiosk) {
        return 'fullAccess';
      }
      if (loggedIn) {
        if (permission) {
          return 'fullAccess';
        }
        return 'noInfomediaAccess';
      }
      return 'mustLogIn';
    }

    let error = '';
    let onClick = null;
    let buttonText = '';

    if (showLink) {
      switch (allowAccess()) {
        case 'noInfomediaAccess': {
          error = T({component: 'work', name: 'noInfomediaAccess'});
          break;
        }
        case 'fullAccess': {
          onClick = () =>
            this.props.showReviewModal('paperReview', this.props.book, review);
          buttonText = T({component: 'work', name: 'readReview'});
          break;
        }
        case 'mustLogIn': {
          onClick = this.props.requireLogin;
          buttonText = T({component: 'work', name: 'readReview'});
          break;
        }
        default: {
          break;
        }
      }
    }
    return (
      <ReviewItem
        title={source}
        date={date}
        author={creator}
        buttonText={buttonText}
        onClick={onClick}
        error={error}
        rating={rating}
        maxRating={maxRating}
        ratingType={ratingShape}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.userReducer.isLoggedIn,
    isKiosk: state.kiosk.enabled
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
  },
  requireLogin: () => {
    dispatch({
      type: OPEN_MODAL,
      modal: 'login',
      context: {
        title: <T component="login" name="loginButton" />,
        reason: <T component="work" name="mustLogIn" />
      }
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PaperReview);
