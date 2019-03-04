import React from 'react';
import {connect} from 'react-redux';
import T from '../T';

import {
  addList,
  updateList,
  storeList,
  removeList,
  getListByIdSelector,
  CUSTOM_LIST
} from '../../../redux/list.reducer';
import {saveList} from '../../../utils/requestLists';

const getListById = getListByIdSelector();

export const withListCreator = WrappedComponent => {
  const Wrapper = class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {id: null};
    }

    componentDidMount() {
      if (!this.props.id && this.props.openplatformId) {
        this.createList(this.props.openplatformId);
      }
    }

    componentDidUpdate(prevProps) {
      if (!this.props.id) {
        if (prevProps.openplatformId !== this.props.openplatformId) {
          this.createList(this.props.openplatformId);
        }
      }
    }

    createList = async openplatformId => {
      const list = await saveList(
        {
          type: CUSTOM_LIST,
          public: false,
          title: T({component: 'list', name: 'noTitleValue'}),
          dotColor: 'petroleum'
        },
        openplatformId
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

  const mapDispatchToProps = dispatch => ({
    createList: async list => {
      await dispatch(addList(list));
    }
  });

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
    return {
      list: getListById(state, {_id: ownProps.id})
    };
  };

  const mapDispatchToProps = (dispatch, ownProps) => ({
    storeList: list => dispatch(storeList(list._id)),
    updateListData: data => dispatch(updateList({_id: ownProps.id, ...data})),
    deleteList: () => dispatch(removeList(ownProps.id))
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapper);
};

// export withListCreator(withList);
