import React from 'react';
import {connect} from 'react-redux';
import {addList} from '../../redux/list.reducer';
import {saveList} from '../../utils/requestLists';
import {HISTORY_REPLACE} from '../../redux/middleware';
import Spinner from '../general/Spinner.component';

/*
* Will create a new list object and redirect to listpage
*/
export class ListCreator extends React.Component {
  componentDidMount() {
    this.props.createList();
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        <Spinner size="30px" className="mt-5" />
      </div>
    );
  }
}

const mapStateToProps = () => ({});
export const mapDispatchToProps = dispatch => ({
  createList: async () => {
    const list = await saveList({}, null);
    dispatch(addList(list));
    dispatch({
      type: HISTORY_REPLACE,
      path: `/lister/${list._id}`
    });
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListCreator);
