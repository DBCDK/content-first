import React from 'react';
import ResumeReview from './ResumeReview.component';
import PaperReview from './PaperReview.component';
import Icon from '../../base/Icon';
import T from '../../base/T';
import SkeletonText from '../../base/Skeleton/Text';
import './Review.css';
import LitteratursidenReview from './LitteratursidenReview.component';

/**
 * This class displays a list of reviews
 **/

class ReviewList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewsHasLoaded: false,
      collapsed: false
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.work.reviewsHasLoaded &&
      this.props.work.reviewsHasLoaded !== prevProps.work.reviewsHasLoaded
    ) {
      const collapsed =
        this.refs.reviewsContainer &&
        this.refs.reviewsContainer.offsetHeight > this.props.maxHeight;
      this.setState({collapsed: collapsed, reviewsHasLoaded: false});
    }
  }

  renderReviewList() {
    const reviews = this.props.lectorReviews;

    let paperReviews = [];
    let libraryReview = [];
    if (reviews) {
      reviews.map((reviewList, outerKey) => {
        if (typeof reviewList.fullTextReviews !== 'undefined') {
          reviewList.fullTextReviews.map((review, innerKey) => {
            libraryReview.push(
              <ResumeReview
                review={review}
                book={this.props.book}
                key={outerKey + '-' + innerKey}
              />
            );
            return null;
          });
        }
        const hasRating = reviewList.abstract; // show only reviews with rating
        paperReviews.push(
          hasRating && (
            <PaperReview
              review={reviewList}
              book={this.props.book}
              showLink={this.props.showPaperLinks}
              key={outerKey}
            />
          )
        );
        return null;
      });
    }
    const litteratursidenReview = (
      <LitteratursidenReview
        reviews={this.props.reviews}
        key="litteratursiden-key"
      />
    );
    return [...libraryReview, litteratursidenReview, ...paperReviews];
  }

  render() {
    const ReviewSkeleton = () => (
      <React.Fragment>
        <div className="workPreview__review mb-3">
          <SkeletonText lines={3} color="#e9eaeb" className="Skeleton__Pulse" />
        </div>
        <div className="workPreview__review mb-3">
          <SkeletonText lines={3} color="#e9eaeb" className="Skeleton__Pulse" />
        </div>
        <div className="workPreview__review mb-3">
          <SkeletonText lines={3} color="#e9eaeb" className="Skeleton__Pulse" />
        </div>
      </React.Fragment>
    );

    const work = this.props.work;

    let containerHeight = this.state.collapsed
      ? {
          maxHeight: this.props.maxHeight + 'px'
        }
      : {};

    let reviewList = this.renderReviewList();

    if (work.reviewsHasLoaded && reviewList[0].length === 0) {
      reviewList = <T component="work" name="noReviews" />;
    }
    return (
      <React.Fragment>
        <div
          className={
            ' ' +
            this.props.className +
            (this.state.collapsed
              ? ' paper_reviews_show'
              : ' paper_reviews_hide_overflow')
          }
          style={containerHeight}
        >
          {work.reviewsHasLoaded && (
            <div
              ref={reviewsContainer =>
                (this.refs = {...this.refs, reviewsContainer})
              }
            >
              {reviewList}
            </div>
          )}
          {!work.reviewsHasLoaded && <ReviewSkeleton />}

          {false && this.state.collapsed && (
            <div
              className="show-more-reviews "
              onClick={() =>
                this.setState({
                  collapsed: !this.state.collapsed
                })
              }
              style={{
                background: `linear-gradient(to bottom, transparent, ${this.props.showMoreColor} 60% )`
              }}
            >
              <div>
                <Icon
                  name={!this.state.collapsed ? 'expand_less' : 'expand_more'}
                />
                <p>
                  <T component="work" name={'showMoreReviews'} />
                </p>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default ReviewList;
