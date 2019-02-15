import React from 'react';
import ResumeReview from './ResumeReview.component';

/**
 * This class displays a list of reviews
 */
class ReviewList extends React.Component {
  render() {
    const reviews = this.props.reviews;
    if (reviews === false) {
      return '';
    }
    return (
      <React.Fragment>
        {reviews.map((reviewList, outerKey) => {
          if (typeof reviewList.fullTextReviews !== 'undefined') {
            return reviewList.fullTextReviews.map((review, innerKey) => {
              return (
                <ResumeReview
                  review={review}
                  book={this.props.book}
                  key={outerKey + '-' + innerKey}
                />
              );
            });
          }
          return '';
        })}
      </React.Fragment>
    );
  }
}

export default ReviewList;
