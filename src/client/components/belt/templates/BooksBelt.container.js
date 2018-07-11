import React from 'react';
import {connect} from 'react-redux';
import {isMobile} from 'react-device-detect';
import {difference} from 'lodash';
import WorkCard from '../../work/WorkCard.container';
import Heading from '../../base/Heading';
import Term from '../../base/Term';
import Slider from '../../belt/Slider.component';
import {RECOMMEND_REQUEST, getRecommendedPids} from '../../../redux/recommend';
import {HISTORY_PUSH} from '../../../redux/middleware';
import {
  ADD_CHILD_BELT,
  REMOVE_CHILD_BELT,
  BELT_SCROLL,
  WORK_PREVIEW
} from '../../../redux/belts.reducer';
import {filtersMapAll} from '../../../redux/filter.reducer';
import Link from '../../general/Link.component';
import WorkPreview from '../../work/WorkPreview.component';

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
  }
  componentDidMount() {
    if (this.props.recommendedPids.length === 0) {
      this.props.fetchRecommendations(this.props.tags);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tags.length !== this.props.tags.length) {
      this.props.fetchRecommendations(nextProps.tags);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.belt !== this.props.belt ||
      nextProps.tags.length !== this.props.tags.length ||
      nextProps.recommendedPids.length !== this.props.recommendedPids.length ||
      nextState.didSwipe !== this.state.didSwipe
    );
  }

  toggleWorkPreview(pid, belt) {
    if (isMobile) {
      this.props.historyPush(pid);
      return;
    }
    let status = pid === belt.pidPreview ? false : pid;
    this.props.changePidPreview(status, belt);
  }

  render() {
    const {
      fetchInitial = 8,
      showTags = true,
      belt,
      tagObjects,
      recommendedPids,
      addChildBelt
    } = this.props;
    if (!belt) {
      return null;
    }

    const {subtext, child, scrollPos, pidPreview = false} = belt;

    const name = this.props.name || this.props.belt.name;
    const border = showTags ? 'border-right-sm-1 ' : '';
    const pids =
      recommendedPids.length > 0 ? recommendedPids : skeletonElements;

    return (
      <React.Fragment>
        <div className="row belt text-left mt3">
          <div className="header row">
            <Link href="/find" params={{tag: tagObjects.map(t => t.id)}}>
              <Heading
                className={
                  border +
                  'inline border-right-xs-0 pr2 pb0 pt0 pb-sm-1 pt-sm-1 ml1 mr1 mb0'
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
                    <Term
                      key={t.id}
                      className={'ml1 mt1' + (isLast ? ' mr1' : '')}
                      size="medium"
                      style={{verticalAlign: 'baseline'}}
                    >
                      {t.title}
                    </Term>
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

          <div className="row mt2">
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
                    highlight={
                      (child && child.pid === pid) || pid === pidPreview
                    }
                    allowFetch={this.state.didSwipe || idx < fetchInitial}
                    pid={pid}
                    key={pid}
                    origin={`Fra "${name}"`}
                    onMoreLikeThisClick={work => {
                      addChildBelt(belt, {
                        name: 'Minder om ' + work.book.title,
                        onFrontPage: true,
                        pidPreview: false,
                        pid
                      });
                    }}
                    onWorkPreviewClick={() => {
                      this.toggleWorkPreview(pid, belt);
                    }}
                  />
                );
              })}
            </Slider>
          </div>
          {pidPreview && (
            <WorkPreview
              pid={pidPreview}
              onMoreLikeThisClick={work => {
                addChildBelt(belt, {
                  name: 'Minder om ' + work.book.title,
                  onFrontPage: true,
                  pidPreview: false,
                  pid: work.book.pid
                });
              }}
            />
          )}
        </div>
        {belt.child &&
          this.props.childTemplate && (
            <this.props.childTemplate belt={belt.child} />
          )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const excluded = ownProps.excluded || [];
  return {
    recommendedPids:
      ownProps.tags.length > 0
        ? difference(
            getRecommendedPids(state.recommendReducer, {
              tags: ownProps.tags
            }).pids,
            excluded
          ).slice(0, 20)
        : [],
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
  changePidPreview: (pid, belt) => {
    dispatch({
      type: WORK_PREVIEW,
      pid,
      belt
    });
  },
  historyPush: pid => {
    dispatch({type: HISTORY_PUSH, path: '/værk/' + pid});
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BooksBelt);
