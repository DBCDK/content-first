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

const withList = WrappedComponent => {
  let createdId;

  const Wrapper = class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {id: null};
    }

    // createList = () => {
    //   console.log('createList');
    //   this.props.createList(list => this.setState({id: list._id}));
    // };

    createList = () => {
      console.log('saveList', this.props.userId);
      // this.props.saveList(this.props.userId);
    };

    render() {
      console.log('ddd', this.props.userId);

      return <WrappedComponent {...this.props} createList={this.createList} />;
    }
  };

  const mapStateToProps = (state, ownProps) => {
    return {
      list: getListById(state, {_id: ownProps._id}),
      userId: state.userReducer.openplatformId
    };
  };

  const mapDispatchToProps = (dispatch, ownProps) => ({
    createList: async callback => {
      await dispatch(addList({type: CUSTOM_LIST, isNew: true}));
    },
    saveList: async userId => {
      await dispatch(saveList({}, userId));
    },
    storeList: list => dispatch(storeList(list._id)),
    updateListData: data => dispatch(updateList(data)),
    onTitleChange: e =>
      dispatch(updateList({_id: ownProps._id, title: e.target.value}))
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapper);
};

export default withList;
