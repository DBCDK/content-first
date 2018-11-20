import React from 'react';
import {connect} from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
  ON_USERLISTS_COLLAPSE,
  ON_USERLISTS_EXPAND,
  OWNED_LISTS_REQUEST,
  SYSTEM_LIST,
  CUSTOM_LIST
} from '../../../redux/list.reducer';

import {createGetUsersSelector} from '../../../redux/users';
import {ON_SHORTLIST_COLLAPSE} from '../../../redux/shortlist.reducer';
import {HISTORY_PUSH} from '../../../redux/middleware';
import {createGetFollowedLists} from '../../../redux/selectors';
import {createGetLists} from '../../../redux/list.reducer';
import toColor from '../../../utils/toColor';
import Button from '../../base/Button/Button';
import Text from '../../base/Text';
import Link from '../../general/Link.component';
import Spinner from '../../general/Spinner.component';
import './dropdownList.css';
import toReadListIcon from '../../images/toReadListIcon.png';
import readListIcon from '../../images/readListIcon.png';

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
        <Text
          type="body"
          variant="color-fersken--weight-semibold--transform-uppercase"
          className="tc"
        >
          Lister
        </Text>
      </Link>
      {props.children && props.children.length > 0 && (
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
  loadLists = () => {
    if (!this.fetched) {
      this.props.loadLists();
      this.fetched = true;
    }
  };
  componentDidUpdate() {
    if (this.props.expanded) {
      this.loadLists();
    }
  }
  renderLists = lists => {
    return lists.map(list => (
      <ListElement
        key={list._id}
        list={list}
        profiles={this.props.profiles}
        userID={this.props.userID ? this.props.userID : ''}
      />
    ));
  };
  render() {
    const {
      hasFetched,
      ownedSystemLists,
      ownedCustomLists,
      followedLists,
      expanded
    } = this.props;
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
          onClose={() => this.props.onUserListsClose()}
          onEditLists={() => this.props.onEditLists()}
          onCreateNewList={() => this.props.onCreateNewList()}
        >
          {!hasFetched && (
            <div className="text-center">
              <Spinner size="30px" className="mt-5" />
            </div>
          )}
          {hasFetched && (
            <React.Fragment>
              {ownedSystemLists && this.renderLists(ownedSystemLists)}
              {ownedCustomLists && this.renderLists(ownedCustomLists)}
              {followedLists && this.renderLists(followedLists)}
            </React.Fragment>
          )}
        </UserListsContent>
      </React.Fragment>
    );
  }
}

const customListSelector = createGetLists();
const systemListsSelector = createGetLists();
const usersSelector = createGetUsersSelector();
const getFollowedLists = createGetFollowedLists();

const mapStateToProps = state => {
  return {
    expanded: state.listReducer.expanded,
    profiles: usersSelector(state),
    shortListExpanded: state.shortListReducer.expanded,
    userID: state.userReducer.openplatformId,
    followReducer: state.followReducer,
    followedLists: getFollowedLists(state),
    ownedSystemLists: systemListsSelector(state, {
      _owner: state.userReducer.openplatformId,
      type: SYSTEM_LIST
    }),
    ownedCustomLists: customListSelector(state, {
      _owner: state.userReducer.openplatformId,
      type: CUSTOM_LIST
    }),
    hasFetched: state.listReducer.hasFetchedOwned
  };
};
export const mapDispatchToProps = dispatch => ({
  loadLists: () => dispatch({type: OWNED_LISTS_REQUEST}),
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
