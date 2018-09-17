import React from 'react';
import {connect} from 'react-redux';
import {
  updateList,
  storeList,
  removeList,
  getListByIdSelector
} from '../../../redux/list.reducer';
import {HISTORY_REPLACE} from '../../../redux/middleware';
import ListContextMenu from './ListContextMenu';
import FollowButton from '../button/FollowButton';
import AddBookButton from '../button/AddBookButton';
const getListById = getListByIdSelector();

const StickySettings = ({_id, list, onAddBook, onEdit}) => {
  return (
    <div
      className="fixed-top d-flex justify-content-center pointer-events-none"
      style={{top: 140}}
    >
      <div className="fixed-width-col-sm d-xs-none d-xl-block" />
      <div className="list-container fixed-width-col-md" />
      <div className="fixed-width-col-sm d-xs-none d-lg-block ml-4 pointer-events-initial">
        <FollowButton _id={list._id} />
        <AddBookButton _id={list._id} className="mt-3" onClick={onAddBook} />
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
