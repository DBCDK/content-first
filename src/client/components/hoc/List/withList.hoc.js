import React from 'react';
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import ToastMessage from '../../base/ToastMessage';
import T from '../../base/T';
import Link from '../../general/Link.component';
import * as listThunks from '../../../redux/list.thunk';

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
      const {id, listLoaded} = this.props;
      if (!listLoaded && id) {
        this.props.fetchList(id);
      }
    };

    /**
     * StoreList
     **/
    storeList = () => {
      // Flag stored - prevent auto-deleting list on componentWillUnmount()
      this.stored = true;
      this.props.storeList(this.props.openplatformId);
    };

    /**
     * DeleteList
     **/
    deleteList = async () => {
      this.props.deleteList();
    };

    /**
     * Add multiple elements to list
     **/
    addElementsToList = works => {
      works.forEach(work =>
        this.addElementToList(
          {book: work.book, description: work.origin || '...'},
          false
        )
      );
      this.storeList();
    };

    /**
     * Add single element to list
     **/
    addElementToList = async (work, store = true) => {
      this.props.addElementToList(work);
      if (store) {
        this.storeList();
      }
    };

    /**
     * Toggle element in list
     **/
    toggleWorkInList = work => {
      const {onToggleWorkInList} = this.props;
      onToggleWorkInList(work);
      this.storeList();
    };

    /**
     * Updata List data
     **/
    updateListData = data => {
      const {list, onUpdateListData} = this.props;
      const newData = {_id: list._id, ...data};
      onUpdateListData(newData);
    };

    render() {
      // if child component dosen't provide an id/_id, the hoc will not block for rendering
      if (!this.props.id && !this.props._id) {
        return <WrappedComponent {...this.props} />;
      }
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
    const list = state.listReducer.lists[_id];

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
      addElementToList: work => {
        dispatch(listThunks.addElementToList(work, _id));
      },
      deleteList: () => {
        dispatch(listThunks.deleteList(_id));
      },
      storeList: openplatformId => {
        dispatch(
          listThunks.storeList(
            _id,
            openplatformId,
            ownProps.justCreated && createdToast
          )
        );
      },
      fetchList: () => {
        dispatch(listThunks.fetchList(_id));
      },
      onToggleWorkInList: work => dispatch(listThunks.toggleElement(work, _id)),
      onUpdateListData: data => dispatch(listThunks.updateListData(data))
    };
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapper);
};
