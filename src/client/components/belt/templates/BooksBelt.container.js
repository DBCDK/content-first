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
import Button from '../../base/Button';
import ContextMenu, {ContextMenuAction} from '../../base/ContextMenu';
import Slider from '../../belt/Slider.component';
import {RECOMMEND_REQUEST, getRecommendedPids} from '../../../redux/recommend';
import {HISTORY_PUSH} from '../../../redux/middleware';
import {
  updateBelt,
  updateBeltData,
  removeBelt,
  ADD_CHILD_BELT,
  REMOVE_CHILD_BELT,
  BELT_SCROLL,
  TOGGLE_EDIT,
  BELT_TITLE_CLICK,
  BELT_TAG_CLICK
} from '../../../redux/belts.reducer';
import {getIdsFromRange, getTagsbyIds} from '../../../redux/selectors';
import Link from '../../general/Link.component';

import '../belt.css';

const skeletonElements = [];
for (let i = 0; i < 20; i++) {
  skeletonElements.push(i);
}

const EditBelt = props => {
  if (isMobileOnly) {
    return <BeltContextMenu onClick={props.onClick} />;
  }

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

const BeltContextMenu = ({onClick}) => {
  const style = {position: 'absolute', right: '-25px', top: 0, zIndex: 1};

  return (
    <ContextMenu title={''} className={''} style={style}>
      <ContextMenuAction
        title="Redigér tekst og billede"
        icon="edit"
        onClick={onClick}
      />
    </ContextMenu>
  );
};

const Tag = ({tag, isLast, onClick}) => {
  return (
    <Link key={tag.id} href="/find" params={{tags: tag.id}} onClick={onClick}>
      <Term
        className={'ml-2 mt1' + (isLast ? ' mr-2' : '')}
        size="medium"
        style={{verticalAlign: 'baseline'}}
      >
        {tag.title}
      </Term>
    </Link>
  );
};

export class BooksBelt extends React.Component {
  constructor() {
    super();

    this.state = {
      showDetails: false,
      didSwipe: false,
      titleMissing: false,
      subtextMissing: false
    };
    this.fetchedTags = null;
  }

  componentDidMount() {
    this.fetchRecommendations();
    this.initMissingText();
    if (this.props.belt.scrollIntoView) {
      this.scrollToBelt(this.refs.beltWrap);
    }
  }

  componentDidUpdate() {
    this.fetchRecommendations();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.belt !== this.props.belt ||
      nextProps.tags.length !== this.props.tags.length ||
      nextProps.recommendedPids.length !== this.props.recommendedPids.length ||
      nextState.didSwipe !== this.state.didSwipe ||
      nextState.visible !== this.state.visible
    );
  }

  initMissingText() {
    const belt = this.props.belt;
    const titleMissing = belt.name === '' ? true : false;
    const subtextMissing = belt.subtext === '' ? true : false;

    this.setState({titleMissing, subtextMissing});
  }

  fetchRecommendations = () => {
    if (
      isEqual(this.fetchedTags, this.props.plainSelectedTagIds) ||
      !this.state.visible
    ) {
      return;
    }
    this.props.fetchRecommendations(this.props.plainSelectedTagIds);
    this.fetchedTags = this.props.plainSelectedTagIds;
  };

  handleChildBelts(parentBelt, childBelt, workPosition) {
    let samePidClicked = false;
    let sameTypeClicked = false;

    if (parentBelt.child) {
      this.props.removeChildBelt(parentBelt);
      samePidClicked = parentBelt.child.pid === childBelt.pid;
      sameTypeClicked = parentBelt.child.type === childBelt.type;
    }

    if (!parentBelt.child || !samePidClicked || !sameTypeClicked) {
      this.props.addChildBelt(parentBelt, childBelt, workPosition);
    }
  }

  onMoreLikeThisClick(parentBelt, work, row, workPosition) {
    const type = 'belt';
    const book = work.book;

    const newBelt = {
      type,
      pid: book.pid,
      name: 'Minder om ' + book.title,
      key: 'Minder om ' + book.title,
      onFrontPage: false,
      child: false,
      scrollIntoView: true
    };

    this.handleChildBelts(parentBelt, newBelt, workPosition);
  }

  onWorkClick(parentBelt, work, row, workPosition) {
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
      child: false,
      scrollIntoView: true
    };

    this.handleChildBelts(parentBelt, newBelt, workPosition);
  }

  scrollToBelt(belt) {
    scrollToComponent(belt, {
      align: 'bottom',
      ease: 'inOutCube'
    });
  }

  onVisibilityChange = visible => {
    if (visible) {
      this.setState({visible});
    }
  };

  onEditBeltClick() {
    const belt = this.props.belt;
    this.props.editBelt(belt);

    if (!belt.editing) {
      this.setState({title: belt.name, subtext: belt.subtext || ''});
    }
  }

  onTitleChange = e => {
    const val = e.target.value;
    const titleMissing = val === '' ? true : false;

    this.setState({titleMissing});
    this.props.changeTitle(val);
  };

  onSubtextChange = e => {
    const val = e.target.value;
    const subtextMissing = val === '' ? true : false;

    this.setState({subtextMissing});
    this.props.changeSubtext(val);
  };

  onCancelEdit = () => {
    this.props.editBelt(this.props.belt);
    this.props.changeTitle(this.state.title);
    this.props.changeSubtext(this.state.subtext);
    this.setState({title: null, subtext: null});
  };

  render() {
    const {
      fetchInitial = 8,
      showTags = true,
      belt,
      selectedTags,
      plainSelectedTagIds,
      plainSelectedTags,
      recommendedPids,
      onSaveEdit,
      removePin
    } = this.props;

    if (!belt) {
      return null;
    }

    const {subtext, child, scrollPos, _owner, editing = false} = belt;

    let {name} = belt;
    if (this.props.name) {
      name = this.props.name;
    }

    const titleMissing = this.state.titleMissing;
    const subtextMissing = this.state.subtextMissing;
    const titleMissingClass = titleMissing ? 'value-missing' : '';
    const subtextMissingClass = subtextMissing ? '' : ''; // value-missing

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
          <div
            id={`temp_${plainSelectedTagIds.map(v => v.id || v).join('')}`}
            className="belt text-left mt-5 mt-sm-4 row position-relative"
            ref={beltWrap => (this.refs = {...this.refs, beltWrap})}
          >
            {_owner && <EditBelt onClick={() => this.onEditBeltClick()} />}
            <div className="p-0 col-12">
              <div className="header row d-flex flex-nowrap">
                {_owner && (
                  <div className=" d-none d-sm-block logo-circle ml-2" />
                )}
                {_owner && editing ? (
                  <div className="d-flex flex-wrap col-12 col-sm-10">
                    <Textarea
                      className={`${titleMissingClass} ${border} col-12 col-sm-6 p-0 pl-1 border-right-xs-0 mr-2 mb0 mt-3 Title Title__title4 Title__title4--transform-uppercase`}
                      name="belt-name"
                      placeholder={'Husk at give båndet en overskrift'}
                      onChange={this.onTitleChange}
                      rows={1}
                      value={name}
                    />
                    {showTags && (
                      <div className="d-sm-inline h-scroll-xs h-scroll-sm-none">
                        {plainSelectedTags.map((t, idx) => {
                          return (
                            <Tag
                              tag={t}
                              isLast={idx === plainSelectedTags.length - 1}
                              onClick={() => this.props.tagClick(t)}
                            />
                          );
                        })}
                      </div>
                    )}
                    <Textarea
                      className={`${subtextMissingClass} col-12 p-0 pl-1 mt1 mb0 Title Title__title5`}
                      name="belt-description"
                      placeholder="Giv din gemte søgning en beskrivelse"
                      onChange={this.onSubtextChange}
                      value={subtext}
                    />
                    <div
                      div
                      className="d-flex w-100 w-sm-auto flex-row-reverse flex-sm-row"
                    >
                      <Button
                        type="quaternary"
                        size="medium"
                        className="mr-0 mr-sm-4 ml-2 ml-sm-0 mt-2 mb-2 mt-sm-4 mb-sm-4"
                        onClick={!titleMissing && onSaveEdit}
                      >
                        {'Gem ændringer'}
                      </Button>
                      <Button
                        type="link"
                        size="medium"
                        className="mr-2 ml-2 mt-2 mb-2 mt-sm-4 mb-sm-4"
                        onClick={this.onCancelEdit}
                      >
                        {'Fortryd'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="pl-0 d-flex flex-wrap mw-100">
                    <Link
                      href="/find"
                      params={{
                        tags: selectedTags
                          .map(
                            t =>
                              t instanceof Array ? t.map(aT => aT.id) : t.id
                          )
                          .join(',')
                      }}
                      onClick={this.props.titleClick}
                    >
                      <Title
                        Tag="h1"
                        type="title4"
                        variant="transform-uppercase"
                        className={
                          border +
                          ' inline border-right-xs-0 pr2 pb0 pt0 ml-2 ml-sm-3 mr-2 mr-sm-3 mb0'
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
                            onClick={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              removePin(belt);
                            }}
                          />
                        )}
                      </Title>
                    </Link>
                    {showTags && (
                      <div className="d-sm-inline h-scroll-xs h-scroll-sm-none">
                        {plainSelectedTags.map((t, idx) => {
                          return (
                            <Tag
                              tag={t}
                              key={idx}
                              isLast={idx === plainSelectedTags.length - 1}
                              onClick={() => this.props.tagClick(t)}
                            />
                          );
                        })}
                      </div>
                    )}
                    {subtext && (
                      <div className="w-100 w-sm-auto d-block">
                        <Title
                          Tag="h3"
                          type="title5"
                          className="ml-2 ml-sm-3 mr-2 mr-sm-3 mt-2 mb-0"
                        >
                          {subtext}
                        </Title>
                      </div>
                    )}
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
                        className="ml-2 mr-2"
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
                          this.onMoreLikeThisClick(belt, work, row, idx)
                        }
                        onWorkClick={(work, row) => {
                          this.onWorkClick(belt, work, row, idx);
                        }}
                        cardIndex={idx}
                      />
                    );
                  })}
                </Slider>
              </div>
            </div>
          </div>
          {belt.child &&
            this.props.childTemplate && (
              <this.props.childTemplate
                dataCy="workpreviewCard"
                belt={belt.child}
              />
            )}
        </React.Fragment>
      </VisibilitySensor>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const excluded = ownProps.excluded || [];

  const selectedTags = getTagsbyIds(state, ownProps.tags);
  const plainSelectedTagIds = getIdsFromRange(state, ownProps.tags);
  const plainSelectedTags = getTagsbyIds(state, plainSelectedTagIds);

  const recommendedPids = difference(
    getRecommendedPids(state.recommendReducer, {
      tags: plainSelectedTagIds
    }).pids,
    excluded
  ).slice(0, 20);

  return {
    recommendedPids,
    selectedTags,
    plainSelectedTagIds,
    plainSelectedTags
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
  addChildBelt: (parentBelt, childBelt, workPosition) => {
    dispatch({
      type: ADD_CHILD_BELT,
      parentBelt,
      childBelt,
      workPosition
    });
  },
  titleClick: () => {
    dispatch({
      type: BELT_TITLE_CLICK,
      belt: ownProps.belt
    });
  },
  tagClick: tag => {
    dispatch({
      type: BELT_TAG_CLICK,
      belt: ownProps.belt,
      tag
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
  removePin: belt => dispatch(removeBelt(belt)),
  historyPush: pid => {
    dispatch({type: HISTORY_PUSH, path: '/værk/' + pid});
  },
  editBelt: belt => {
    dispatch({type: TOGGLE_EDIT, belt});
  },
  changeTitle: val => {
    dispatch(updateBeltData({belt: ownProps.belt, data: {name: val}}));
  },
  changeSubtext: val => {
    dispatch(updateBeltData({belt: ownProps.belt, data: {subtext: val}}));
  },
  onSaveEdit: () => {
    dispatch(updateBelt(ownProps.belt));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BooksBelt);
