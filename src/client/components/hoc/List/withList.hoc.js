import React from 'react';
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import ToastMessage from '../../base/ToastMessage';
import T from '../../base/T';
import Link from '../../general/Link.component';

import {
  ADD_LIST,
  UPDATE_LIST_DATA,
  STORE_LIST,
  REMOVE_LIST,
  REMOVE_LIST_SUCCESS,
  REMOVE_LIST_ERROR,
  getListByIdSelector,
  LIST_TOGGLE_ELEMENT,
  CUSTOM_LIST,
  ADD_ELEMENT_TO_LIST
} from '../../../redux/list.reducer';

import {deleteObject} from '../../../utils/requester';
import {saveList, loadList, loadLists} from '../../../utils/requestLists';

const getListById = getListByIdSelector();

const createdToast = list => {
  toast(
    <ToastMessage
      type="success"
      icon="check_circle"
      lines={[
        <T component="list" name="newListCreatedToast" vars={[list.title]} />,
        <Link key="href" href={`/lister/${list._id}`}>
          <T component="list" name="watchNewListAction" />
        </Link>
      ]}
    />,
    {pauseOnHover: true}
  );
};

/**
 *
 * withListCreator
 *
 **/

export const withListCreator = WrappedComponent => {
  const Wrapper = class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {id: null, owner: null};
    }

    componentDidMount() {
      if (!this.props.id && this.props.openplatformId) {
        this.createList();
      }
    }

    componentDidUpdate(prevProps) {
      if (!this.props.id) {
        if (prevProps.openplatformId !== this.props.openplatformId) {
          this.createList();
        }
      }
    }

    /**
     * CreateList
     **/
    createList = async () => {
      const {openplatformId, works, onCreateList} = this.props;

      try {
        const list = await saveList(
          {
            type: CUSTOM_LIST,
            public: false,
            title: T({component: 'list', name: 'noTitleValue'}),
            description: '',
            dotColor: 'petroleum',
            // "Pre-add" works to the created list
            list: works || [],
            _created: Date.now()
          },
          openplatformId
        );

        this.setState({id: list._id});
        // saveList(list, openplatformId);
        onCreateList(list);
      } catch (e) {
        // ignored for now
        // ....
        return;
      }
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          id={this.props.id ? this.props.id : this.state.id}
          justCreated={!!this.state.id}
        />
      );
    }
  };

  const mapStateToProps = state => {
    return {
      openplatformId: state.userReducer.openplatformId
    };
  };

  const mapDispatchToProps = dispatch => {
    return {
      onCreateList: async list => {
        await dispatch({type: ADD_LIST, list});
      }
    };
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapper);
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
        this.props.deleteList();
      }
    }

    /**
     * LoadList
     **/
    loadList = async () => {
      const {id, listLoaded, onLoadList} = this.props;

      if (!listLoaded) {
        try {
          await loadList(id);
          onLoadList();
        } catch (e) {}
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
      const {list, addElementToList} = this.props;
      works.forEach(work =>
        addElementToList(
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
    const list = getListById(state, {_id: ownProps.id || ownProps._id});

    return {
      list,
      listLoaded: !!state.listReducer.lists[ownProps.id],
      isListOwner:
        (list && state.userReducer.openplatformId === list._owner) || null,
      openplatformId: state.userReducer.openplatformId,
      isLoggedIn: state.userReducer.isLoggedIn
    };
  };

  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      onLoadList: () => {},
      // Save list handle
      onStoreList: list => {
        dispatch({type: STORE_LIST, _id: list._id});
        // show created list toast, if just created (not on edit list)
        if (ownProps.justCreated) {
          createdToast(list);
        }
      },
      // Delete list handle
      onDeleteList: () => dispatch({type: REMOVE_LIST, _id: ownProps.id}),
      onDeleteListSuccess: () =>
        dispatch({type: REMOVE_LIST_SUCCESS, _id: ownProps.id}),
      onDeleteListError: () =>
        dispatch({type: REMOVE_LIST_ERROR, _id: ownProps.id}),
      // Work in list handle
      onToggleWorkInList: work =>
        dispatch({
          type: LIST_TOGGLE_ELEMENT,
          element: work,
          _id: ownProps.id
        }),
      onUpdateListData: data => dispatch({type: UPDATE_LIST_DATA, data}),
      onAddElementToList: work =>
        dispatch({type: ADD_ELEMENT_TO_LIST, element: work, _id: ownProps.id})
    };
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapper);
};
