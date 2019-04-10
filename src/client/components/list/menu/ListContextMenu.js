import React from 'react';
import {connect} from 'react-redux';

import T from '../../base/T';

import {OPEN_MODAL} from '../../../redux/modal.reducer';
import ContextMenu, {ContextMenuAction} from '../../base/ContextMenu';
import {
  removeList,
  getListByIdSelector,
  CUSTOM_LIST
} from '../../../redux/list.reducer';
import {HISTORY_REPLACE} from '../../../redux/middleware';
const getListById = getListByIdSelector();

const ListContextMenu = ({
  editListInfo,
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
  return (
    <ContextMenu
      title={title}
      className={className}
      style={style}
      dataCy="context-menu-list"
    >
      <ContextMenuAction
        title={T({component: 'list', name: 'editListInfo'})}
        icon="edit"
        onClick={editListInfo}
      />
      <ContextMenuAction
        title={T({component: 'general', name: 'reorder'})}
        icon="swap_vert"
        onClick={reorderList}
      />
      <ContextMenuAction
        title={T({component: 'list', name: 'deleteList'})}
        icon="delete"
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
    dispatch({
      type: OPEN_MODAL,
      modal: 'list',
      context: {id: ownProps._id}
    });
  },
  reorderList: () => {
    dispatch({
      type: OPEN_MODAL,
      modal: 'reorderList',
      context: {_id: ownProps._id}
    });
  },
  confirmDelete: () => {
    dispatch({
      type: 'OPEN_MODAL',
      modal: 'confirm',
      context: {
        title: <T component="list" name="deleteListModalTitle" />,
        reason: <T component="list" name="deleteListModalTitle" />,
        confirmText: <T component="list" name="deleteList" />,
        onConfirm: () => {
          dispatch(
            removeList(ownProps._id),
            dispatch({
              type: 'CLOSE_MODAL',
              modal: 'confirm'
            })
          );
          dispatch({type: HISTORY_REPLACE, path: '/'});
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
