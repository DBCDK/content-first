import React from 'react';
import {connect} from 'react-redux';
import {getListByIdSelector} from '../../redux/list.reducer';
import SimpleList from './templates/SimpleList.component';
import {LIST_LOAD_REQUEST} from '../../redux/list.reducer';
import Spinner from '../general/Spinner.component';

const getListById = getListByIdSelector();

export class ListPage extends React.Component {
  componentDidMount() {
    this.props.loadList(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.props.loadList(this.props.id);
    }
  }

  // eslint-disable-next-line no-unused-vars
  getTemplate(list) {
    // currently support simplelist only
    // BookcaseTemplate and CircleTemplate
    // are not ready for production
    return SimpleList;

    // switch (list.template) {
    //   case 'simple':
    //     return SimpleList;
    //   case 'circle':
    //     return CircleTemplate;
    //   case 'bookcase':
    //     return BookcaseTemplate;
    //   default:
    //     return SimpleList;
    // }
  }
  render() {
    const {list} = this.props;
    if (!list || list.isLoading) {
      // TODO make a skeleton view of list
      return (
        <div className="d-flex justify-content-center">
          <Spinner size="30px" className="mt-5" />
        </div>
      );
    }

    if (list.error) {
      return <div>Listen kunne ikke hentes</div>;
    }

    const Template = this.getTemplate(list);

    return <Template _id={list._id} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    list: getListById(state, {_id: ownProps.id})
  };
};

export const mapDispatchToProps = dispatch => ({
  loadList: _id => dispatch({type: LIST_LOAD_REQUEST, _id})
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListPage);
