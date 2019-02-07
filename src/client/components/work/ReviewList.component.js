import React from 'react';
import Review from './Review.component';

/**
 * This class displays a list of reviews
 */
class ReviewList extends React.Component {
  /**
   * render
   * @returns {*}
   */
  render() {
    const reviews = this.props.reviews;
    if (reviews === false) {
      return '';
    }
    const book = this.props.book;
    return (
      <React.Fragment>
        {reviews.map((reviewList, outerKey) => {
          if (typeof reviewList.fullTextReviews !== 'undefined') {
            return reviewList.fullTextReviews.map(
              (fullTextReview, innerKey) => {
                return (
                  <Review
                    view="resume"
                    book={book}
                    reviewType="fullTextReviews"
                    review={fullTextReview}
                    key={outerKey + '-' + innerKey}
                  />
                );
              }
            );
          }
          return '';
        })}
      </React.Fragment>
    );
  }
}

export default ReviewList;
