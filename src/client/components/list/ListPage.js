import React from 'react';
import {connect} from 'react-redux';
import Spinner from '../general/Spinner.component';
import Title from '../base/Title';
import SimpleList from './templates/simple/SimpleList';
import BookcaseList from './templates/bookcase/BookcaseList';
import {getListByIdSelector} from '../../redux/list.reducer';
import {LIST_LOAD_REQUEST} from '../../redux/list.reducer';

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
    const template = list.template;

    switch (template) {
      case 'list':
        return SimpleList;
      case 'bookcase':
        return BookcaseList;
      default:
        return SimpleList;
    }
  }
  render() {
    console.log('ListPage render');
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
      return (
        <Title Tag="h1" type="title3" className="text-center mt-5">
          Listen kunne ikke hentes
        </Title>
      );
    }
    if (!list._type) {
      return (
        <Title Tag="h1" type="title3" className="text-center mt-5">
          Listen er slettet
        </Title>
      );
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
