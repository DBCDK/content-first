import React from 'react';
import {connect} from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
  ON_USERLISTS_COLLAPSE,
  ON_USERLISTS_EXPAND
} from '../../../redux/list.reducer';

import {createGetUsersSelector} from '../../../redux/users';
import {createGetLists} from '../../../redux/list.reducer';
import {ON_SHORTLIST_COLLAPSE} from '../../../redux/shortlist.reducer';
import {HISTORY_PUSH} from '../../../redux/middleware';
import toColor from '../../../utils/toColor';
import Button from '../../base/Button/Button';
import Text from '../../base/Text';
import T from '../../base/T/';
import Link from '../../general/Link.component';
import Spinner from '../../general/Spinner/Spinner.component';

import {OPEN_MODAL} from '../../../redux/modal.reducer';

import './dropdownList.css';
import toReadListIcon from '../../images/toReadListIcon.png';
import readListIcon from '../../images/readListIcon.png';

import {withLists, withList} from '../../hoc/List';
import {withFollows} from '../../hoc/Follow';
import {withUser} from '../../hoc/User';

const OwnerName = withUser(({user, className}) => {
  if (!user) {
    return null;
  }
  return <span className={className}>{user.name}</span>;
});
const ListElement = props => {
  if (!props.list || !props.list._id || props.list.error || !props.list._type) {
    return null;
  }

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

  return (
    <Link
      onClick={() => {
        if (props.closeModal) {
          props.closeModal();
        }
      }}
      href={url}
      data-cy={`list-link-${props.list.title}`}
    >
      <div
        data-cy={`list-overview-element-${props.list.title}`}
        className={`top-bar-dropdown-list-element${
          props.modalView ? '--modal' : ''
        }`}
      >
        <div className="top-bar-dropdown-list-element--cover-image">
          {renderListsCover(props.list)}
        </div>
        <div className="top-bar-dropdown-list-element--text">
          <div className="top-bar-dropdown-list-element--header">
            {props.list.title}
          </div>
          <div className="top-bar-dropdown-list-element--taxonomy-description">
            {props.list.description}
          </div>
          <div className="top-bar-dropdown-list-element--origin">
            {!props.isListOwner && (
              <span>
                {T({component: 'general', name: 'by'})}
                <OwnerName id={props.list._owner} className="ml-1" />
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const ListElementWithList = withList(ListElement);

const UserListsContent = props => {
  return (
    <div
      className={
        (props.modalView
          ? 'user-lists-modal-content '
          : 'top-bar-dropdown-list--content ') +
        ` text-left${!props.modalView && !props.expanded ? ' slide-out' : ' '}`
      }
    >
      {!props.modalView && (
        <React.Fragment>
          <i
            onClick={props.onClose}
            alt="Luk"
            className="material-icons top-bar-dropdown-list--close-btn"
          >
            clear
          </i>
          <Text
            type="body"
            variant="color-elm--weight-semibold--transform-uppercase"
            className="tc"
            style={{marginBottom: '10px'}}
          >
            <T component="list" name="listButton" />
          </Text>
        </React.Fragment>
      )}

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
      <div
        className={
          'top-bar-dropdown-list--footer' +
          (props.modalView ? ' user-lists-modal--footer' : ' ')
        }
      >
        <div onClick={() => props.onCreateNewList()}>
          <Button
            size="medium"
            type="tertiary"
            dataCy="lists-dropdown-new-list"
          >
            <T component="list" name="createNew" />
          </Button>
        </div>
      </div>
    </div>
  );
};
class ListOverviewDropDown extends React.Component {
  renderLists = lists => {
    return lists.map((list, index) => (
      <ListElementWithList
        id={list._id}
        key={'ele-' + list._id}
        profiles={this.props.profiles}
        index={index}
        modalView={this.props.modalView}
        closeModal={this.props.closeModal}
      />
    ));
  };

  render() {
    let {
      hasFetched,
      systemLists,
      customLists,
      followedLists,
      expanded,
      modalView
    } = this.props;
    followedLists =
      followedLists && followedLists.map(entry => ({_id: entry.id}));

    return (
      <React.Fragment>
        {!modalView && (
          <div
            className={this.props.className + ' top-bar-dropdown-list'}
            onClick={() => {
              this.props.onListsIconClick(
                expanded,
                this.props.shortListExpanded
              );
            }}
            data-cy={this.props.dataCy}
          >
            {this.props.children}
          </div>
        )}

        <UserListsContent
          expanded={expanded}
          modalView={modalView}
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
              {systemLists && this.renderLists(systemLists)}
              {customLists && this.renderLists(customLists)}
              {followedLists && this.renderLists(followedLists)}
            </React.Fragment>
          )}
        </UserListsContent>
      </React.Fragment>
    );
  }
}

const usersSelector = createGetUsersSelector();
const listsSelector = createGetLists();

const mapStateToProps = (state, ownProps) => {
  const openplatformId = state.userReducer.openplatformId;

  return {
    expanded: ownProps.expanded || state.listReducer.expanded,
    profiles: usersSelector(state),
    shortListExpanded: state.shortListReducer.expanded,
    openplatformId: openplatformId,
    customLists: listsSelector(state, {
      _owner: openplatformId,
      type: 'CUSTOM_LIST'
    }),
    systemLists: listsSelector(state, {
      _owner: openplatformId,
      type: 'SYSTEM_LIST'
    }),
    hasFetched: state.listReducer.hasFetchedOwned
  };
};
export const mapDispatchToProps = dispatch => ({
  onEditLists: () => {
    dispatch({type: HISTORY_PUSH, path: '/profile'});
    dispatch({type: ON_USERLISTS_COLLAPSE});
  },
  onCreateNewList: () => {
    dispatch({
      type: OPEN_MODAL,
      modal: 'list',
      createListAttempt: true
    });
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
)(withLists(withFollows(ListOverviewDropDown)));
