import React from 'react';
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import ToastMessage from '../../base/ToastMessage';
import T from '../../base/T';
import Link from '../../general/Link.component';

import {
  LIST_LOAD_REQUEST,
  LIST_LOAD_RESPONSE,
  UPDATE_LIST_DATA,
  STORE_LIST,
  REMOVE_LIST,
  REMOVE_LIST_SUCCESS,
  REMOVE_LIST_ERROR,
  getListByIdSelector,
  LIST_TOGGLE_ELEMENT,
  ADD_ELEMENT_TO_LIST
} from '../../../redux/list.reducer';

import {deleteObject} from '../../../utils/requester';
import {saveList, loadList} from '../../../utils/requestLists';

const getListById = getListByIdSelector();

const createdToast = list => {
  toast(
    <ToastMessage
      type="success"
      icon="check_circle"
      lines={[
        <T component="list" name="newListCreatedToast" vars={[list.title]} />,
        <Link
          key="href"
          href={`/lister/${list._id}`}
          data-cy="watch-new-list-link"
        >
          <T component="list" name="watchNewListAction" />
        </Link>
      ]}
    />,
    {pauseOnHover: true}
  );
};

/**
 *
 * WithListHoc
 *
 **/

export const withList = WrappedComponent => {
  const Wrapper = class extends React.Component {
    componentDidMount() {
      this.loadList();
    }

    componentWillUnmount() {
      if (this.props.justCreated && !this.stored) {
        this.deleteList();
      }
    }

    /**
     * LoadList
     **/
    loadList = async () => {
      const {id, listLoaded, onLoadList, onLoadListError} = this.props;

      if (!listLoaded && id) {
        try {
          await loadList(id);
          // TODO onLoadList should not be handled by middleware
          onLoadList();
        } catch (e) {
          onLoadListError(id, e);
        }
      }
    };

    /**
     * StoreList
     **/
    storeList = async list => {
      // Props
      const {openplatformId, onStoreList} = this.props;
      try {
        await saveList(list, openplatformId);
        // Flag stored - prevent auto-deleting list on componentWillUnmount()
        this.stored = true;
        // Dispatch reducer action
        onStoreList(list);
      } catch (e) {
        // ignored for now
        // ....
        return;
      }
    };

    /**
     * DeleteList
     **/
    deleteList = async () => {
      // Props
      const {
        list,
        onDeleteList,
        onDeleteListSuccess,
        onDeleteListError
      } = this.props;

      // Dispatch reducer action
      onDeleteList();

      try {
        await deleteObject({_id: list._id});
        // Dispatch reducer action
        onDeleteListSuccess();
      } catch (e) {
        // Dispatch reducer action
        onDeleteListError();
        return;
      }
    };

    /**
     * Add multiple elements to list
     **/
    addElementsToList = works => {
      // Props
      const {list} = this.props;
      works.forEach(work =>
        this.addElementToList(
          {book: work.book, description: work.origin || '...'},
          list._id
        )
      );
    };

    /**
     * Add single element to list
     **/
    addElementToList = async work => {
      // Props
      const {list, onAddElementToList} = this.props;

      try {
        // Dispatch reducer action
        onAddElementToList(work);
        // Save List
        this.storeList(list);
      } catch (e) {
        // ignored for now
        // ....
        return;
      }
    };

    /**
     * Toggle element in list
     **/
    toggleWorkInList = work => {
      // Props
      const {list, onToggleWorkInList} = this.props;

      try {
        // Dispatch reducer action
        onToggleWorkInList(work);
        // Save List
        this.storeList(list);
      } catch (e) {
        // ignored for now
        // ....
        return;
      }
    };

    /**
     * Updata List data
     **/
    updateListData = data => {
      // Props
      const {list, onUpdateListData} = this.props;

      try {
        const newData = {_id: list._id, ...data};
        onUpdateListData(newData);
      } catch (e) {
        // ignored for now
        // ....
        return;
      }
    };

    render() {
      if (!this.props.list) {
        return null;
      }
      return (
        <WrappedComponent
          {...this.props}
          storeList={this.storeList}
          deleteList={this.deleteList}
          addElementsToList={this.addElementsToList}
          addElementToList={this.addElementToList}
          toggleWorkInList={this.toggleWorkInList}
          updateListData={this.updateListData}
        />
      );
    }
  };

  const mapStateToProps = (state, ownProps) => {
    const _id = ownProps.id || ownProps._id;
    const openplatformId = state.userReducer.openplatformId;
    const list = getListById(state, {_id});

    return {
      list,
      isLoading: list && list.isLoading,
      listLoaded: !!state.listReducer.lists[_id],
      isListOwner: list ? openplatformId === list._owner : null,
      openplatformId
    };
  };

  const mapDispatchToProps = (dispatch, ownProps) => {
    const _id = ownProps.id || ownProps._id;

    return {
      onLoadList: () => {
        dispatch({type: LIST_LOAD_REQUEST, _id});
      },
      onLoadListError: (id, e) =>
        dispatch({
          type: LIST_LOAD_RESPONSE,
          list: {_id: id, error: e}
        }),

      // Save list handle
      onStoreList: list => {
        dispatch({
          type: STORE_LIST,
          _id: list._id,
          createList: ownProps.justCreated
        });
        // show created list toast, if just created (not on edit list)
        if (ownProps.justCreated) {
          createdToast(list);
        }
      },
      // Delete list handle
      onDeleteList: () => dispatch({type: REMOVE_LIST, _id}),
      onDeleteListSuccess: () => dispatch({type: REMOVE_LIST_SUCCESS, _id}),
      onDeleteListError: () => dispatch({type: REMOVE_LIST_ERROR, _id}),
      // Work in list handle
      onToggleWorkInList: work =>
        dispatch({
          type: LIST_TOGGLE_ELEMENT,
          element: work,
          _id
        }),
      onUpdateListData: data => dispatch({type: UPDATE_LIST_DATA, data}),
      onAddElementToList: work =>
        dispatch({type: ADD_ELEMENT_TO_LIST, element: work, _id})
    };
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapper);
};
