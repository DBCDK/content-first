import React from 'react';
import {connect} from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import toColor from '../../utils/toColor';
import Button from '../base/Button/Button';
import Heading from '../base/Heading/Heading';
import Link from '../general/Link.component';
import './dropdownList.css';
import toReadListIcon from '../images/toReadListIcon.png';
import readListIcon from '../images/readListIcon.png';
import {
  ON_USERLISTS_COLLAPSE,
  ON_USERLISTS_EXPAND
} from '../../redux/list.reducer';
import {ON_SHORTLIST_COLLAPSE} from '../../redux/shortlist.reducer';
import {HISTORY_PUSH} from '../../redux/middleware';
import {getFollowedLists} from '../../redux/selectors';
import {getListsForOwner} from '../../redux/list.reducer';
const ListElement = props => {
  const url = `/lister/${props.list._id}`;
  const renderListsCover = list => {
    return list.type === 'SYSTEM_LIST' ? (
      <img
        alt=""
        src={list.title === 'Vil læse' ? toReadListIcon : readListIcon}
      />
    ) : list.image ? (
      <img alt="" src={'/v1/image/' + list.image + '/50/50'} />
    ) : (
      <div
        className="list-card-coverTemplate-small"
        style={{background: toColor(list._id), height: '40px', width: '40px'}}
      >
        <div className="list-card-brick-small" />
        <div className="list-card-brick-small" />
        <div className="list-card-brick-small" />
      </div>
    );
  };
  const isOwner = props.list && props.list._owner === props.userID;
  return (
    <div className="top-bar-dropdown-list-element">
      <div className="top-bar-dropdown-list-element--cover-image">
        <Link href={url}>{renderListsCover(props.list)}</Link>
      </div>
      <div className="top-bar-dropdown-list-element--text">
        <div className="top-bar-dropdown-list-element--header">
          <Link href={url}>{props.list.title}</Link>
        </div>
        <div className="top-bar-dropdown-list-element--taxonomy-description">
          {props.list.description}
        </div>
        <div className="top-bar-dropdown-list-element--origin">
          {props.profiles[props.list._owner] && !isOwner
            ? 'Af ' + props.profiles[props.list._owner].name
            : ''}
        </div>
      </div>
    </div>
  );
};

const UserListsContent = props => {
  return (
    <div
      className={`top-bar-dropdown-list--content text-left${
        props.expanded ? '' : ' slide-out'
      }`}
    >
      <i
        onClick={props.onClose}
        className="material-icons top-bar-dropdown-list--close-btn"
      >
        clear
      </i>
      <Link href="/lister">
        <Heading type="peach-subtitle">Lister</Heading>
      </Link>
      {props.children &&
        props.children.length > 0 && (
          <div className="top-bar-dropdown-list--elements">
            <ReactCSSTransitionGroup
              transitionName="shortlist"
              transitionEnterTimeout={200}
              transitionLeaveTimeout={200}
            >
              {props.children}
            </ReactCSSTransitionGroup>
          </div>
        )}
      <div className="top-bar-dropdown-list--footer">
        <div onClick={() => props.onCreateNewList()}>
          <Button size="medium" type="tertiary">
            Opret ny liste
          </Button>
        </div>
        <div onClick={() => props.onEditLists()}>
          <Button size="medium" type="tertiary">
            Rediger lister
          </Button>
        </div>
      </div>
    </div>
  );
};
class ListOverviewDropDown extends React.Component {
  constructor(props) {
    super(props);
  }
  sortLists(lists) {
    return lists.sort((a, b) => {
      let aDate =
        !a._owner === this.props.userID && this.props.followReducer[a._id]
          ? this.props.followReducer[a._id]._created
          : a._created;
      let bDate =
        !b._owner === this.props.userID && this.props.followReducer[a._id]
          ? this.props.followReducer[b._id]._created
          : b._created;
      aDate = a.type === 'SYSTEM_LIST' ? bDate + 1 : aDate;
      bDate = b.type === 'SYSTEM_LIST' ? aDate + 1 : bDate;
      return bDate - aDate;
    });
  }
  render() {
    const {expanded} = this.props.listsState;
    const lists = this.props.userLists.concat(this.props.followedLists);
    const sortedLists = this.sortLists(lists);
    return (
      <React.Fragment>
        <div
          className={this.props.className + ' top-bar-dropdown-list'}
          onClick={() => {
            this.props.onListsIconClick(expanded, this.props.shortListExpanded);
          }}
        >
          {this.props.children}
        </div>
        <UserListsContent
          expanded={expanded}
          lists={sortedLists}
          onClose={() => this.props.onUserListsClose()}
          onEditLists={() => this.props.onEditLists()}
          onCreateNewList={() => this.props.onCreateNewList()}
        >
          {sortedLists.length > 0 &&
            sortedLists.map(list => {
              return (
                <ListElement
                  key={list._id}
                  list={list}
                  profiles={this.props.profiles}
                  userID={this.props.userID ? this.props.userID : ''}
                />
              );
            })}
        </UserListsContent>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    listsState: state.listReducer,
    profiles: state.users.toJS(),
    shortListExpanded: state.shortListReducer.expanded,
    userID: state.userReducer.openplatformId,
    followReducer: state.followReducer,
    followedLists: getFollowedLists(state),
    userLists: getListsForOwner(state, {
      owner: state.userReducer.openplatformId,
      sort: false
    })
  };
};
export const mapDispatchToProps = dispatch => ({
  onEditLists: () => {
    dispatch({type: HISTORY_PUSH, path: '/profile'});
    dispatch({type: ON_USERLISTS_COLLAPSE});
  },
  onCreateNewList: () => {
    dispatch({type: HISTORY_PUSH, path: '/lister/opret'});
    dispatch({type: ON_USERLISTS_COLLAPSE});
  },
  onListsIconClick: (userListsexpanded, shortListExpanded) => {
    dispatch({
      type: userListsexpanded ? ON_USERLISTS_COLLAPSE : ON_USERLISTS_EXPAND
    });
    // collapse shortlist if expanded
    if (shortListExpanded) {
      dispatch({type: ON_SHORTLIST_COLLAPSE});
    }
  },
  onUserListsClose: () => dispatch({type: ON_USERLISTS_COLLAPSE})
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListOverviewDropDown);
