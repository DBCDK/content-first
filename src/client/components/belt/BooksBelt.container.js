import React from 'react';
import {connect} from 'react-redux';
import WorkItem from '../work/WorkItemConnected.component';
import {HISTORY_PUSH} from '../../redux/middleware';
import Slider from '../belt/Slider.component';
import {RECOMMEND_REQUEST} from '../../redux/recommend';
import {getRecommendedBooks} from '../../redux/selectors';
import {filtersMapAll} from '../../redux/filter.reducer';
import {beltNameToPath} from '../../utils/belt';

export class BooksBelt extends React.Component {
  constructor() {
    super();
    this.state = {showDetails: false};
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.recommendedBooks.books.length !==
      this.props.recommendedBooks.books.length
    );
  }

  componentDidMount() {
    if (this.props.recommendedBooks.books.length === 0) {
      this.props.fetchBelt(this.props.tags);
    }
  }

  getTooltipText(filters) {
    return filters.length > 0
      ? filters
          .map(filter => {
            return `<span>${filter.title}</span>`;
          })
          .join(' ')
      : '<span>Ingen filtre</span>';
  }

  render() {
    return (
      <div className="row belt text-left">
        <div className="col-xs-12 header">
          <span
            className="belt-title"
            data-html="true"
            data-toggle="tooltip"
            data-original-title={this.getTooltipText(this.props.tagObjects)}
            onClick={() =>
              this.props.historyPush(beltNameToPath(this.props.title))
            }
          >
            {this.props.title || 'ost'}
          </span>
        </div>
        {this.props.recommendedBooks && (
          <div className="row mb4">
            <div className="col-xs-12">
              <Slider>
                {!this.props.recommendedBooks.isLoading &&
                  this.props.recommendedBooks.books.map(work => (
                    <WorkItem
                      work={work}
                      key={work.book.pid}
                      origin={`Fra "${this.props.title}"`}
                    />
                  ))}
              </Slider>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    recommendedBooks: getRecommendedBooks(state, ownProps.tags, 20),
    tagObjects: ownProps.tags.map(id => filtersMapAll[id])
  };
};

export const mapDispatchToProps = dispatch => ({
  fetchBelt: tags =>
    dispatch({
      type: RECOMMEND_REQUEST,
      tags,
      max: 50 // we ask for many recommendations, since client side filtering may reduce the actual result significantly
    }),
  historyPush: path => {
    dispatch({
      type: HISTORY_PUSH,
      path
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BooksBelt);
