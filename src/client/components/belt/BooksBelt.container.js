import React from 'react';
import {connect} from 'react-redux';
import TruncateMarkup from 'react-truncate-markup';
import WorkCard from '../work/WorkCard.container';
import Heading from '../base/Heading';
import Term from '../base/Term';
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
      <div className="row belt text-left mt4">
        <div className="header row">
          <Link
            href="/find"
            params={{tag: this.props.tagObjects.map(t => t.id)}}
          >
            <Heading
              className="inline border-right-xs-0 border-right-sm-1 pr2 pb0 pt0 pb-sm-1 pt-sm-1 ml1 mr2 mb0"
              tag="h1"
              type="section"
            >
              {this.props.title.split(' ').map((word, idx) => {
                if (idx === 0) {
                  return <strong>{word}</strong>;
                }
                return ' ' + word;
              })}
            </Heading>
          </Link>
          <div className="d-sm-inline h-scroll-xs h-scroll-sm-none">
            {this.props.tagObjects.map((t, idx) => {
              const isLast = idx === this.props.tagObjects.length - 1;
              return (
                <Term
                  className={'ml1 mt1' + (isLast ? ' mr1' : '')}
                  size="medium"
                  style={{verticalAlign: 'baseline'}}
                >
                  {t.title}
                </Term>
              );
            })}
          </div>
          <Heading tag="h3" type="lead" className="ml1 mt1 mb0">
            {this.props.subtext}
          </Heading>
        </div>

        <div className="row mt2">
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
                  className="ml1 mr1"
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
