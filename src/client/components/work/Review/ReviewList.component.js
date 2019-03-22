import React from 'react';
import ResumeReview from './ResumeReview.component';
import PaperReview from './PaperReview.component';
import Icon from '../../base/Icon';
import Title from '../../base/Title';
import Text from '../../base/Text';
import T from '../../base/T';
import SkeletonText from '../../base/Skeleton/Text';
import SkeletonUser from '../../base/Skeleton/User';
import './Review.css';

/**
 * This class displays a list of reviews
 */
class ReviewList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayAllReviews: false,
      showReviewButton: true
    };
  }

  componentDidMount() {
    console.log('this.refs', this.refs);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.work.reviewsHasLoaded &&
      this.props.work.reviewsHasLoaded !== prevProps.work.reviewsHasLoaded
    ) {
      const showReviewButton =
        this.refs.reviewsContainer &&
        this.refs.reviewsContainer.offsetHeight >= this.props.maxHeight;
      console.log(
        '  this.refs.reviewsContainer.offsetHeight ',
        this.refs.reviewsContainer.offsetHeight
      );
      this.setState({showReviewButton: showReviewButton});
    }
  }

  renderReviewList() {
    const reviews = this.props.lectorReviews;

    return (
      reviews &&
      reviews.map((reviewList, outerKey) => {
        console.log('reviewList', reviewList);

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
        const hasRating = reviewList.abstract; // show only reviews with rating
        return hasRating && <PaperReview review={reviewList} key={outerKey} />;
      })
    );
  }
  render() {
    const work = this.props.work;

    const showReviewButton =
      work.reviewsHasLoaded && this.state.showReviewButton;
    /*
      work.reviewsHasLoaded &&
      (this.state.displayAllReviews
        ? this.refs.reviewsContainer &&
          this.refs.reviewsContainer.offsetHeight >= 500
        : true);*/
    console.log('showReviewButton', showReviewButton);

    const containerHeight = {
      maxHeight: !this.state.displayAllReviews
        ? this.props.maxHeight + 'px'
        : ''
    };

    const reviewList = this.renderReviewList();
    console.log('renderReviewList', reviewList);
    return (
      <React.Fragment>
        <div
          ref={reviewsContainer =>
            (this.refs = {...this.refs, reviewsContainer})
          }
          className={
            ' ' +
            this.props.className +
            (!this.state.displayAllReviews
              ? ' paper_reviews_show'
              : ' paper_reviews_hide_overflow')
          }
          style={containerHeight}
        >
          <div className="row">
            <div className="col-md-12">
              <Title Tag="h5" type="title5" className="mt3 mb2">
                <T component="work" name={'reviewsTitle'} />
              </Title>
            </div>
          </div>

          {work.reviewsHasLoaded &&
            this.props.reviews.map(rev => {
              console.log('rev', rev);

              return (
                <a
                  href={rev.url}
                  target="_blank"
                  className="WorkPage__review mb1"
                >
                  <span className="WorkPage__review__details ">
                    <Text type="body" variant="weight-semibold" className="mb0">
                      {rev.creator}
                    </Text>
                    <Text type="body">{rev.date}</Text>
                  </span>
                </a>
              );
            })}
          {!work.reviewsHasLoaded && (
            <React.Fragment>
              <a className="workPreview__review mb1">
                <SkeletonUser pulse={true} className="mr1" />
                <SkeletonText
                  lines={2}
                  color="#e9eaeb"
                  className="Skeleton__Pulse"
                />
              </a>
              <a className="workPreview__review mb1">
                <SkeletonUser pulse={true} className="mr1" />
                <SkeletonText
                  lines={2}
                  color="#e9eaeb"
                  className="Skeleton__Pulse"
                />
              </a>
              <a className="workPreview__review">
                <SkeletonUser pulse={true} className="mr1" />
                <SkeletonText
                  lines={2}
                  color="#e9eaeb"
                  className="Skeleton__Pulse"
                />
              </a>
            </React.Fragment>
          )}

          {reviewList}
          {showReviewButton &&
            !this.state.displayAllReviews && (
              <div
                className="show-more-reviews "
                onClick={() =>
                  this.setState({
                    displayAllReviews: !this.state.displayAllReviews
                  })
                }
                style={{
                  background: `linear-gradient(to bottom, transparent,${
                    this.props.showMoreColor
                  } )`
                }}
              >
                <span>
                  {this.state.displayAllReviews
                    ? 'Skjul anmedelser'
                    : 'Vis flere anmedelser'}
                </span>
                <Icon
                  name={
                    this.state.displayAllReviews ? 'expand_less' : 'expand_more'
                  }
                />
              </div>
            )}
        </div>
      </React.Fragment>
    );
  }
}

export default ReviewList;
