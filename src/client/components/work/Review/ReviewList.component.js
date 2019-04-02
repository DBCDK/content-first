import React from 'react';
import ResumeReview from './ResumeReview.component';
import PaperReview from './PaperReview.component';
import Icon from '../../base/Icon';
import Title from '../../base/Title';
import Text from '../../base/Text';
import T from '../../base/T';
import SkeletonText from '../../base/Skeleton/Text';
import SkeletonUser from '../../base/Skeleton/User';
import {timestampToShortDate} from '../../../utils/dateTimeFormat';
import './Review.css';

/**
 * This class displays a list of reviews
 */
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

    return (
      reviews &&
      reviews.map((reviewList, outerKey) => {
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
        const hasRating = true; // reviewList.abstract; // show only reviews with rating
        return hasRating && <PaperReview review={reviewList} key={outerKey} />;
      })
    );
  }
  render() {
    const work = this.props.work;

    let containerHeight = this.state.collapsed
      ? {
          maxHeight: this.props.maxHeight + 'px'
        }
      : {};

    const reviewList = this.renderReviewList();
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
          <div className="row">
            <div className="col-md-12">
              <Title Tag="h5" type="title5" className="mt3 mb2">
                <T component="work" name={'reviewsTitle'} />
              </Title>
            </div>
          </div>

          {work.reviewsHasLoaded && (
            <div
              ref={reviewsContainer =>
                (this.refs = {...this.refs, reviewsContainer})
              }
            >
              {this.props.reviews.map(rev => {
                const date =
                  rev.creator.split(',')[1] &&
                  timestampToShortDate(rev.creator.split(',')[1]);
                return (
                  <div className="review_list__review mr-4 mb-3">
                    <span className="review_list__review__details ">
                      <Text
                        type="body"
                        variant="weight-semibold"
                        className="mb0"
                      >
                        {rev.creator.includes('Litteratursiden')
                          ? 'Litteratursiden'
                          : rev.creator}
                      </Text>

                      <Text className="d-flex">
                        <a
                          type="small"
                          onClick={() => {}}
                          target="_blank"
                          href={rev.url}
                        >
                          <T component="work" name={'readReview'} />
                        </a>
                        <a target="_blank" href={rev.url}>
                          <i
                            class="material-icons"
                            style={{fontSize: '1.2rem', textDecoration: 'none'}}
                          >
                            launch
                          </i>
                        </a>
                      </Text>
                    </span>
                    {date && (
                      <Text type="small" className="due-txt mb0">
                        {date}
                      </Text>
                    )}
                  </div>
                );
              })}
              {reviewList}
            </div>
          )}
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

          {this.state.collapsed && (
            <div
              className="show-more-reviews "
              onClick={() =>
                this.setState({
                  collapsed: !this.state.collapsed
                })
              }
              style={{
                background: `linear-gradient(to bottom, transparent,${
                  this.props.showMoreColor
                } )`
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
