import React from 'react';
import {connect} from 'react-redux';
import VisibilitySensor from 'react-visibility-sensor';
import {difference, isEqual} from 'lodash';
import scrollToComponent from 'react-scroll-to-component';
import {isMobileOnly} from 'react-device-detect';
import Textarea from 'react-textarea-autosize';
import WorkCard from '../../work/WorkCard.container';
import Pin from '../../base/Pin';
import Title from '../../base/Title';
import Text from '../../base/Text';
import Icon from '../../base/Icon';
import Term from '../../base/Term';
import Slider from '../../belt/Slider.component';
import {RECOMMEND_REQUEST, getRecommendedPids} from '../../../redux/recommend';
import {HISTORY_PUSH} from '../../../redux/middleware';
import {
  updateBelt,
  ADD_CHILD_BELT,
  REMOVE_CHILD_BELT,
  BELT_SCROLL,
  TOGGLE_EDIT
} from '../../../redux/belts.reducer';
import {filtersMapAll} from '../../../redux/filter.reducer';
import Link from '../../general/Link.component';

import '../belt.css';

const skeletonElements = [];
for (let i = 0; i < 20; i++) {
  skeletonElements.push(i);
}

const EditBelt = props => {
  return (
    <div
      className="Belt_editButton d-flex align-items-center"
      onClick={props.onClick}
    >
      <Icon className="md-small" name="edit" />
      <Text className="m-0 ml-2 " type="small">
        Redigér
      </Text>
    </div>
  );
};

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
    let samePidClicked = false;
    let sameTypeClicked = false;

    if (parentBelt.child) {
      this.props.removeChildBelt(parentBelt);
      samePidClicked = parentBelt.child.pid === childBelt.pid;
      sameTypeClicked = parentBelt.child.type === childBelt.type;
    }

    if (!parentBelt.child || !samePidClicked || !sameTypeClicked) {
      this.props.addChildBelt(parentBelt, childBelt);
      this.scrollToChildBelt(this.refs.beltWrap, 220);
    }
  }

  onMoreLikeThisClick(parentBelt, work) {
    const type = 'belt';
    const book = work.book;

    const newBelt = {
      type,
      pid: book.pid,
      name: 'Minder om ' + book.title,
      key: 'Minder om ' + book.title,
      onFrontPage: false,
      child: false
    };

    this.handleChildBelts(parentBelt, newBelt);
  }

  onWorkClick(parentBelt, work) {
    const type = 'preview';
    const book = work.book;

    if (isMobileOnly) {
      this.props.historyPush(work.book.pid);
      return;
    }

    const newBelt = {
      type,
      pid: book.pid,
      key: 'Preview af ' + book.title,
      child: false
    };

    this.handleChildBelts(parentBelt, newBelt);
  }

  scrollToChildBelt(belt, offset) {
    scrollToComponent(belt, {offset});
  }

  onVisibilityChange = visible => {
    if (visible) {
      this.setState({visible});
    }
  };

  onEditBeltClick() {
    const belt = this.props.belt;
    this.props.editBelt(belt);
  }

  render() {
    const {
      fetchInitial = 8,
      showTags = true,
      belt,
      tagObjects,
      recommendedPids,
      onSubtextChange,
      onTitleChange
    } = this.props;

    if (!belt) {
      return null;
    }

    const {subtext, name, child, scrollPos, _owner, editing = false} = belt;

    const border = showTags ? 'border-right-sm-1 ' : '';
    const pids =
      recommendedPids.length > 0 && this.state.visible
        ? recommendedPids
        : skeletonElements;

    console.log('render?. . .');

    return (
      <VisibilitySensor
        onChange={this.onVisibilityChange}
        partialVisibility={true}
      >
        <React.Fragment>
          <div
            className="belt text-left mt-5 mt-sm-4 row position-relative"
            ref={beltWrap => (this.refs = {...this.refs, beltWrap})}
          >
            {_owner && <EditBelt onClick={() => this.onEditBeltClick()} />}
            <div className="p-0 col-12">
              <div className="header row">
                {!editing && (
                  <Link href="/find" params={{tag: tagObjects.map(t => t.id)}}>
                    <Title
                      Tag="h1"
                      type="title4"
                      variant="transform-uppercase"
                      className={
                        border +
                        ' inline border-right-xs-0 pr2 pb0 pt0 ml1 mr1 mb0'
                      }
                    >
                      {name.split(' ').map((word, idx) => {
                        if (idx === 0) {
                          return <strong key={idx}>{word}</strong>;
                        }
                        return ' ' + word;
                      })}
                      {_owner && (
                        <Pin
                          className="d-inline ml-2"
                          active={true}
                          onClick={() => this.onPinClick()}
                        />
                      )}
                    </Title>
                  </Link>
                )}
                {_owner &&
                  editing && (
                    <Textarea
                      className={`${border} form-control inline border-right-xs-0 pr2 pb0 pt0 ml1 mr1 mb0 Title Title__title3`}
                      name="belt-name"
                      placeholder="Giv dit gemte søgning en titel"
                      onChange={onTitleChange}
                      value={name}
                    />
                  )}
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
                {!editing &&
                  subtext && (
                    <div className="d-block w-100">
                      <Title Tag="h3" type="title5" className="ml1 mt1 mb0">
                        {subtext}
                      </Title>
                    </div>
                  )}
                {_owner &&
                  editing && (
                    <div className="d-block w-100">
                      <Textarea
                        className={`form-control ml1 mt1 mb0 Title Title__title5`}
                        name="belt-description"
                        placeholder="Giv din gemte søgning en beskrivelse"
                        onChange={onSubtextChange}
                        value={subtext}
                      />
                    </div>
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

export const mapDispatchToProps = (dispatch, ownProps) => ({
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
  historyPush: pid => {
    dispatch({type: HISTORY_PUSH, path: '/værk/' + pid});
  },
  editBelt: belt => {
    dispatch({type: TOGGLE_EDIT, belt});
  },
  onTitleChange: e => {
    dispatch(updateBelt({belt: ownProps.belt, data: {name: e.target.value}}));
  },
  onSubtextChange: e => {
    dispatch(
      updateBelt({belt: ownProps.belt, data: {subtext: e.target.value}})
    );
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BooksBelt);
