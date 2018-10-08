import React from 'react';
import {connect} from 'react-redux';

import {OPEN_MODAL} from '../../../redux/modal.reducer';
import ContextMenu, {ContextMenuAction} from '../../base/ContextMenu';
import {
  updateList,
  removeList,
  getListByIdSelector,
  CUSTOM_LIST
} from '../../../redux/list.reducer';
import {HISTORY_REPLACE} from '../../../redux/middleware';
const getListById = getListByIdSelector();

const ListContextMenu = ({
  editListInfo,
  editSettings,
  reorderList,
  isOwner,
  isCustomList,
  title,
  confirmDelete,
  className,
  style
}) => {
  if (!isOwner || !isCustomList) {
    return null;
  }
  //reorderList();
  return (
    <ContextMenu title={title} className={className} style={style}>
      <ContextMenuAction
        title="Redigér tekst og billede"
        icon="edit"
        onClick={editListInfo}
      />
      <ContextMenuAction
        title="Skift rækkefølge"
        icon="swap_vert"
        onClick={reorderList}
      />
      <ContextMenuAction
        title="Redigér indstillinger"
        icon="settings"
        onClick={editSettings}
      />
      <ContextMenuAction
        title="Slet liste"
        icon="clear"
        onClick={confirmDelete}
      />
    </ContextMenu>
  );
};

const mapStateToProps = (state, ownProps) => {
  const list = getListById(state, {_id: ownProps._id});
  return {
    isOwner: ownProps._id && list._owner === state.userReducer.openplatformId,
    isCustomList: list.type === CUSTOM_LIST
  };
};
export const mapDispatchToProps = (dispatch, ownProps) => ({
  editListInfo: () => {
    dispatch(updateList({_id: ownProps._id, editing: true}));
    if (ownProps.onEdit) {
      ownProps.onEdit();
    }
  },
  reorderList: () => {
    dispatch({
      type: OPEN_MODAL,
      modal: 'reorderList',
      context: {_id: ownProps._id}
    });
  },
  editSettings: () => {
    dispatch({
      type: OPEN_MODAL,
      modal: 'listSettings',
      context: {_id: ownProps._id}
    });
  },
  confirmDelete: () => {
    dispatch({
      type: 'OPEN_MODAL',
      modal: 'confirm',
      context: {
        title: 'Skal denne liste slettes?',
        reason: 'Er du sikker på du vil slette den valgte liste.',
        confirmText: 'Slet liste',
        onConfirm: () => {
          dispatch(
            removeList(ownProps._id),
            dispatch({
              type: 'CLOSE_MODAL',
              modal: 'confirm'
            })
          );
          dispatch({type: HISTORY_REPLACE, path: '/profile'});
        },
        onCancel: () => {
          dispatch({
            type: 'CLOSE_MODAL',
            modal: 'confirm'
          });
        }
      }
    });
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListContextMenu);
