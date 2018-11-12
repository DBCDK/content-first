import React from 'react';
import {connect} from 'react-redux';
import {isMobileOnly} from 'react-device-detect';
import VisibilitySensor from 'react-visibility-sensor';
import {difference, isEqual} from 'lodash';
import scrollToComponent from 'react-scroll-to-component';
import WorkCard from '../../work/WorkCard.container';
import Heading from '../../base/Heading';
import Term from '../../base/Term';
import Slider from '../../belt/Slider.component';
import {RECOMMEND_REQUEST, getRecommendedPids} from '../../../redux/recommend';
import {HISTORY_PUSH} from '../../../redux/middleware';
import {
  ADD_CHILD_BELT,
  REMOVE_CHILD_BELT,
  REMOVE_BELT,
  BELT_SCROLL
} from '../../../redux/belts.reducer';
import {filtersMapAll} from '../../../redux/filter.reducer';
import Link from '../../general/Link.component';

const skeletonElements = [];
for (let i = 0; i < 20; i++) {
  skeletonElements.push(i);
}

export class BooksBelt extends React.Component {
  constructor() {
    super();
    this.state = {
      showDetails: false,
      didSwipe: false
    };
    this.fetchedTags = null;
  }

  componentDidMount() {
    this.fetchRecommendations();
  }

  componentDidUpdate() {
    this.fetchRecommendations();
  }

  fetchRecommendations = () => {
    if (isEqual(this.fetchedTags, this.props.tags) || !this.state.visible) {
      return;
    }
    this.props.fetchRecommendations(this.props.tags);
    this.fetchedTags = this.props.tags;
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.belt !== this.props.belt ||
      nextProps.tags.length !== this.props.tags.length ||
      nextProps.recommendedPids.length !== this.props.recommendedPids.length ||
      nextState.didSwipe !== this.state.didSwipe ||
      nextState.visible !== this.state.visible
    );
  }

  handleChildBelts(parentBelt, childBelt) {
    this.props.addChildBelt(parentBelt, childBelt);
    this.scrollToChildBelt(childBelt, 220);
  }

  onMoreLikeThisClick(parentBelt, work, row) {
    const type = 'belt';
    const book = work.book;

    const newBelt = {
      row,
      type,
      pid: book.pid,
      name: 'Minder om ' + book.title,
      key: 'Minder om ' + book.title,
      onFrontPage: false,
      child: false
    };

    this.handleChildBelts(parentBelt, newBelt);
  }

  onWorkClick(parentBelt, work, row) {
    const type = 'preview';
    const book = work.book;

    if (isMobileOnly) {
      this.props.historyPush(work.book.pid);
      return;
    }

    const newBelt = {
      row,
      type,
      pid: book.pid,
      key: 'Preview af ' + book.title,
      child: false
    };

    this.handleChildBelts(parentBelt, newBelt);
  }

  scrollToChildBelt(belt, offset) {
    scrollToComponent(this.refs.childBelt, {offset});
  }

  onVisibilityChange = visible => {
    if (visible) {
      this.setState({visible});
    }
  };

  render() {
    const {
      fetchInitial = 8,
      showTags = true,
      belt,
      tagObjects,
      recommendedPids
    } = this.props;

    if (!belt) {
      return null;
    }

    const {subtext, child, scrollPos} = belt;
    const name = this.props.name || this.props.belt.name;
    const border = showTags ? 'border-right-sm-1 ' : '';
    const pids =
      recommendedPids.length > 0 && this.state.visible
        ? recommendedPids
        : skeletonElements;

    return (
      <VisibilitySensor
        onChange={this.onVisibilityChange}
        partialVisibility={true}
      >
        <React.Fragment>
          <div className="belt text-left mt3 row">
            <div className="p-0 col-12">
              <div className="header row">
                <Link href="/find" params={{tag: tagObjects.map(t => t.id)}}>
                  <Heading
                    className={
                      border +
                      'inline border-right-xs-0 pr2 pb0 pt0 ml1 mr1 mb0 '
                    }
                    Tag="h1"
                    type="section"
                  >
                    {name.split(' ').map((word, idx) => {
                      if (idx === 0) {
                        return <strong key={idx}>{word}</strong>;
                      }
                      return ' ' + word;
                    })}
                  </Heading>
                </Link>
                {showTags && (
                  <div className="d-sm-inline h-scroll-xs h-scroll-sm-none">
                    {tagObjects.map((t, idx) => {
                      const isLast = idx === tagObjects.length - 1;
                      return (
                        <Link key={idx} href="/find" params={{tag: t.id}}>
                          <Term
                            className={'ml1 mt1' + (isLast ? ' mr1' : '')}
                            size="medium"
                            style={{verticalAlign: 'baseline'}}
                          >
                            {t.title}
                          </Term>
                        </Link>
                      );
                    })}
                  </div>
                )}
                {subtext && (
                  <Heading Tag="h3" type="lead" className="ml1 mt1 mb0">
                    {subtext}
                  </Heading>
                )}
              </div>

              <div className="mt2 row">
                <Slider
                  initialScrollPos={scrollPos}
                  onSwipe={index => {
                    if (index > 0 && !this.state.didSwipe) {
                      this.setState({didSwipe: true});
                    }
                    if (scrollPos !== index) {
                      this.props.beltScroll(belt, index);
                    }
                  }}
                >
                  {pids.map((pid, idx) => {
                    return (
                      <WorkCard
                        className="ml1 mr1"
                        enableHover={true}
                        highlight={child && child.pid === pid}
                        allowFetch={
                          this.state.visible &&
                          (this.state.didSwipe || idx < fetchInitial)
                        }
                        pid={pid}
                        key={pid}
                        origin={`Fra "${name}"`}
                        onMoreLikeThisClick={(work, row) =>
                          this.onMoreLikeThisClick(belt, work, row, true)
                        }
                        onWorkClick={(work, row) => {
                          this.onWorkClick(belt, work, row, true);
                        }}
                        scrollToChildBelt={() => {
                          this.scrollToChildBelt(belt);
                        }}
                      />
                    );
                  })}
                </Slider>
              </div>
            </div>
          </div>
          {belt.child &&
            this.props.childTemplate && (
              <this.props.childTemplate belt={belt.child} />
            )}
        </React.Fragment>
      </VisibilitySensor>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const excluded = ownProps.excluded || [];

  const recommendedPids =
    ownProps.tags && ownProps.tags.length > 0
      ? difference(
          getRecommendedPids(state.recommendReducer, {
            tags: ownProps.tags
          }).pids,
          excluded
        ).slice(0, 20)
      : [];

  const tagObjects = ownProps.tags
    ? ownProps.tags.map(tag => {
        return filtersMapAll[tag.id || tag];
      })
    : [];

  return {
    recommendedPids,
    tagObjects
  };
};

export const mapDispatchToProps = dispatch => ({
  fetchRecommendations: tags =>
    dispatch({
      type: RECOMMEND_REQUEST,
      fetchWorks: false,
      tags,
      max: 50 // we ask for many recommendations, since client side filtering may reduce the actual result significantly
    }),
  addChildBelt: (parentBelt, childBelt) => {
    dispatch({
      type: ADD_CHILD_BELT,
      parentBelt,
      childBelt
    });
  },
  removeChildBelt: parentBelt => {
    dispatch({
      type: REMOVE_CHILD_BELT,
      parentBelt
    });
  },
  beltScroll: (belt, scrollPos) => {
    dispatch({
      type: BELT_SCROLL,
      belt,
      scrollPos
    });
  },
  removeBelt: belt => {
    dispatch({
      type: REMOVE_BELT,
      belt
    });
  },
  historyPush: pid => {
    dispatch({type: HISTORY_PUSH, path: '/værk/' + pid});
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BooksBelt);
