import React from 'react';
import {connect} from 'react-redux';
import WorkCard from '../work/WorkCard.container';
import Slider from '../belt/Slider.component';
import {RECOMMEND_REQUEST, getRecommendedPids} from '../../redux/recommend';
import {filtersMapAll} from '../../redux/filter.reducer';
import Link from '../general/Link.component';

const skeletonElements = [];
for (let i = 0; i < 20; i++) {
  skeletonElements.push(i);
}
export class BooksBelt extends React.Component {
  constructor() {
    super();
    this.state = {showDetails: false, didSwipe: false};
  }
  componentDidMount() {
    if (this.props.recommendedPids.length === 0) {
      this.props.fetchRecommendations(this.props.tags);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.recommendedPids.length !== this.props.recommendedPids.length ||
      nextState.didSwipe !== this.state.didSwipe
    );
  }

  render() {
    const {fetchInitial = 8} = this.props;
    const pids =
      this.props.recommendedPids.length > 0
        ? this.props.recommendedPids
        : skeletonElements;

    return (
      <div className="row belt text-left">
        <div className="col-xs-12 header">
          <Link
            href="/find"
            params={{tag: this.props.tagObjects.map(t => t.id)}}
          >
            <span className="belt-title">{this.props.title}</span>
          </Link>
          <div className={'belt-subtext'}> {this.props.subtext}</div>
        </div>

        <div className="row mb4">
          <div className="col-xs-12">
            <Slider
              onSwipe={index => {
                if (index > 0 && !this.state.didSwipe) {
                  this.setState({didSwipe: true});
                }
              }}
            >
              {pids.map((pid, idx) => {
                return (
                  <WorkCard
                    allowFetch={this.state.didSwipe || idx < fetchInitial}
                    pid={pid}
                    key={pid}
                    origin={`Fra "${this.props.title}"`}
                  />
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    recommendedPids: getRecommendedPids(state.recommendReducer, {
      tags: ownProps.tags
    }).pids.slice(0, 20),
    tagObjects: ownProps.tags.map(tag => {
      return filtersMapAll[tag.id || tag];
    })
  };
};

export const mapDispatchToProps = dispatch => ({
  fetchRecommendations: tags =>
    dispatch({
      type: RECOMMEND_REQUEST,
      fetchWorks: false,
      tags,
      max: 50 // we ask for many recommendations, since client side filtering may reduce the actual result significantly
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(BooksBelt);
