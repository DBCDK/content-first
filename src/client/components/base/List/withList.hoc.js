import React from 'react';
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import ToastMessage from '../ToastMessage';
import T from '../T';
import Link from '../../general/Link.component';

import {
  addList,
  updateList,
  storeList,
  removeList,
  getListByIdSelector,
  toggleElementInList,
  CUSTOM_LIST
} from '../../../redux/list.reducer';
import {saveList} from '../../../utils/requestLists';

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

    createList = async openplatformId => {
      const list = await saveList(
        {
          type: CUSTOM_LIST,
          public: false,
          title: T({component: 'list', name: 'noTitleValue'}),
          description: '',
          dotColor: 'petroleum',
          // "Pre-add" works to the created list
          list: this.props.works || null
        },
        this.props.openplatformId
      );

      this.setState({id: list._id});
      this.props.createList(list);
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
      createList: async list => {
        await dispatch(addList(list));
      }
    };
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapper);
};

export const withList = WrappedComponent => {
  const Wrapper = class extends React.Component {
    componentWillUnmount() {
      if (this.props.justCreated && !this.stored) {
        this.props.deleteList();
      }
    }

    storeList = list => {
      this.stored = true;
      this.props.storeList(list);
    };

    render() {
      return <WrappedComponent {...this.props} storeList={this.storeList} />;
    }
  };

  const mapStateToProps = (state, ownProps) => {
    const list = getListById(state, {_id: ownProps.id || ownProps._id});

    return {
      list,
      isListOwner:
        (list && state.userReducer.openplatformId === list._owner) || null
    };
  };

  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      storeList: list => {
        dispatch(storeList(list._id));
        // show created list toast, if just created (not on edit list)
        if (ownProps.justCreated) {
          createdToast(list);
        }
      },
      toggleWorkInList: async (work, list) => {
        // Toggle work in list
        await dispatch(toggleElementInList(work, list._id));
        // Store changes
        dispatch(storeList(list._id));
      },
      updateListData: data => dispatch(updateList({_id: ownProps.id, ...data})),
      deleteList: () => dispatch(removeList(ownProps.id))
    };
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapper);
};
