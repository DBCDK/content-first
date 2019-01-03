import React from 'react';
import {connect} from 'react-redux';
import {
  updateList,
  storeList,
  removeList,
  getListByIdSelector
} from '../../../redux/list.reducer';
import {HISTORY_REPLACE} from '../../../redux/middleware';
import {getUser} from '../../../redux/users';
import ListContextMenu from './ListContextMenu';
import FollowButton from '../button/FollowButton';
import AddBookButton from '../button/AddBookButton';
import Text from '../../base/Text';
import {timestampToDateTime} from '../../../utils/timeToString';
import ProfileImage from '../../general/ProfileImage.component';
const getListById = getListByIdSelector();

const StickySettings = ({
  _id,
  list,
  owner,
  showOwner = false,
  showDate = false,
  onAddBook,
  onEdit,
  disabled
}) => {
  console.log('disabled', disabled);
  return (
    <div
      className="fixed-top d-flex justify-content-center pointer-events-none"
      style={{top: 140}}
    >
      <div className="fixed-width-col-sm d-xs-none d-xl-block" />
      <div className="list-container fixed-width-col-md" />
      <div className="fixed-width-col-sm d-xs-none d-lg-block ml-4 pointer-events-initial">
        {showDate && (
          <Text type="small" variant="color-due">
            {timestampToDateTime(list._created)}
          </Text>
        )}
        {showOwner && (
          <ProfileImage user={owner} size={'40'} namePosition="right" />
        )}
        {(showOwner || showDate) && (
          <hr className="border-top border-pistache" />
        )}
        <FollowButton _id={list._id} />
        <div style={{position: 'relative'}}>
          {disabled && (
            <div
              className="position-absolute"
              style={{
                width: '100%',
                height: '100%',
                top: 0,
                background: 'white',
                opacity: 0.7,
                zIndex: 1000
              }}
            />
          )}

          <AddBookButton
            _id={list._id}
            className="mt-3"
            onClick={onAddBook}
            disabled={disabled}
          />
        </div>

        <ListContextMenu
          className="mt-3"
          _id={_id}
          onEdit={onEdit}
          title="Redigér liste"
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const list = getListById(state, {_id: ownProps._id});
  return {
    isOwner: ownProps._id && list._owner === state.userReducer.openplatformId,
    owner: getUser(state, {id: list._owner}),
    list,
    editing: list.editing,
    isNew: list.isNew
  };
};
export const mapDispatchToProps = (dispatch, ownProps) => ({
  cancel: originalList =>
    dispatch(updateList({...originalList, editing: false})),
  submit: () => {
    dispatch(updateList({_id: ownProps._id, editing: false, isNew: false}));
    dispatch(storeList(ownProps._id));
  },
  deleteList: () => dispatch(removeList(ownProps._id)),
  exitList: () => dispatch({type: HISTORY_REPLACE, path: '/profile'})
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StickySettings);
