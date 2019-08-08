import React from 'react';
import {connect} from 'react-redux';

import T from '../../base/T';

import {withList} from '../../hoc/List';

import {OPEN_MODAL} from '../../../redux/modal.reducer';
import ContextMenu, {ContextMenuAction} from '../../base/ContextMenu';
import {HISTORY_REPLACE} from '../../../redux/middleware';

const ListContextMenu = ({
  list,
  editListInfo,
  reorderList,
  isListOwner,
  isCustomList = list.type === 'CUSTOM_LIST',
  title,
  confirmDelete,
  className,
  style
}) => {
  if (!isListOwner || !isCustomList) {
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

const mapStateToProps = () => ({});
export const mapDispatchToProps = (dispatch, ownProps) => {
  return {
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
            ownProps.deleteList();
            dispatch({
              type: 'CLOSE_MODAL',
              modal: 'confirm'
            });
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
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withList(ListContextMenu));
