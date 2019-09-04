import React from 'react';
import {timestampToShortDate} from '../../../utils/dateTimeFormat';
import './Review.css';
import Title from '../../base/Title';
import Text from '../../base/Text';
import {connect} from 'react-redux';
import ReviewRating from './ReviewRating.component';
import {OPEN_MODAL} from '../../../redux/modal.reducer';
import T from '../../base/T';

/**
 * This class displays a single paper review item
 * Creator and ful review link are hidden for now.
 */
export class PaperReview extends React.Component {
  mouseOverFunc = () => {
    this.setState({mouseOverActive: true});
  };
  mouseOutFunc = () => {
    this.setState({mouseOverActive: false});
  };

  constructor(props) {
    super(props);
    this.state = {
      mouseOverActive: false
    };
  }

  render() {
    if (this.props.review === false) {
      return '';
    }

    const review = this.props.review;
    const infomediaData = review.infomedia;

    const loggedIn = this.props.isLoggedIn;
    let hasLink = true;
    let permission = true;

    if (infomediaData) {
      permission = infomediaData.statusCode !== 403;
      hasLink = infomediaData.length > 0 || !permission;
    }

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

    function showReview() {
      if (allowAccess() === 'fullAccess') {
        return '';
      }
      return ' closed-review';
    }

    function allowAccess() {
      if (loggedIn) {
        if (permission) {
          return 'fullAccess';
        }
        return 'noInfomediaAccess';
      }
      return 'mustLogIn';
    }

    let reviewLink;

    if (hasLink) {
      if (allowAccess() === 'fullAccess') {
        reviewLink = (
          <Text type="body" className="d-flex Review__block--lector mb-1">
            <a
              type="small"
              onClick={() => {
                this.props.showReviewModal(
                  'paperReview',
                  this.props.book,
                  review
                );
              }}
            >
              <T component="work" name={'readReview'} />
            </a>
          </Text>
        );
      } else {
        reviewLink = (
          <div>
            <div
              type="body"
              className="Desktop-review-info d-flex Review__block--lector mb-1"
            >
              <a type="small" onMouseOver={this.mouseOverFunc}>
                <T component="work" name={'readReview'} />
              </a>
            </div>
            <div
              type="body"
              className="Mobile-review-info d-flex Review__block--lector mb-1"
            >
              <a type="small" onClick={this.mouseOverFunc}>
                <T component="work" name={'readReview'} />
              </a>
            </div>
          </div>
        );
      }
    }
    return (
      <div className={'Review__container mr-4 mb-3' + showReview()}>
        <div className="Review__block--top">
          <div className="Review__block--title mb-0 d-flex">
            <Title Tag="h6" type="title6" className={'mb-0 mr-2'}>
              {source}
            </Title>
            <ReviewRating
              maxRating={maxRating}
              rating={rating}
              type={ratingShape}
            />
          </div>

          {date && (
            <Text type="small" className={'due-txt mb-0'}>
              {date}
            </Text>
          )}
        </div>
        {creator && creator.trim() !== '' && (
          <Text type="body" className={'Review__block--lector mb-1'}>
            Af {creator}
          </Text>
        )}

        {reviewLink}

        {this.state.mouseOverActive && (
          <React.Fragment>
            <div
              className="review-info"
              onClick={this.mouseOutFunc}
              onMouseOut={this.mouseOutFunc}
              id="popup"
            >
              <div className="review-info-text tooltips">
                <T component="work" name={allowAccess()} />
              </div>
            </div>
          </React.Fragment>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperReview);
