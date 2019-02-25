import React from 'react';
import {connect} from 'react-redux';

import {
  addList,
  updateList,
  storeList,
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
      if (!this.props.id) {
        this.createList();
      }
    }

    createList = async () => {
      const list = await saveList(
        {type: CUSTOM_LIST, isNew: true},
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
        />
      );
    }
  };

  const mapStateToProps = (state, ownProps) => {
    return {
      openplatformId: state.userReducer.openplatformId
    };
  };

  const mapDispatchToProps = (dispatch, ownProps) => ({
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
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  const mapStateToProps = (state, ownProps) => {
    return {
      list: getListById(state, {_id: ownProps.id})
    };
  };

  const mapDispatchToProps = (dispatch, ownProps) => ({
    saveList: list => dispatch(storeList(list._id)),
    updateListData: data => dispatch(updateList({_id: ownProps.id, ...data}))
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapper);
};

// export withListCreator(withList);
