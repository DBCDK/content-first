import React from 'react';
import {connect} from 'react-redux';
import {getListByIdSelector} from '../../redux/list.reducer';
import {getUser} from '../../redux/users';
import SimpleList from './templates/SimpleList.component';
import {LIST_LOAD_REQUEST} from '../../redux/list.reducer';
// import CircleTemplate from './templates/CircleTemplate.container';
// import BookcaseTemplate from './templates/BookcaseTemplate.component';
import Link from '../general/Link.component';

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
    const {list, isOwner} = this.props;

    if (!list) {
      return <div>Listen findes ikke</div>;
    }

    const Template = this.getTemplate(list);

    let editButton = '';
    if (list.type === 'CUSTOM_LIST' && isOwner) {
      editButton = (
        <Link
          className="small link-subtle align-middle ml2"
          href={`/lister/${list._id}/rediger`}
        >
          Redigér liste
        </Link>
      );
    }

    return (
      <Template
        list={list}
        profile={this.props.profile}
        editButton={editButton}
        profiles={this.props.profiles}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const list = getListById(state, {_id: ownProps.id});
  return {
    list,
    isOwner: list && list._owner === state.userReducer.openplatformId,
    profile: getUser(state, {id: list && list._owner})
  };
};

export const mapDispatchToProps = dispatch => ({
  loadList: id => dispatch({type: LIST_LOAD_REQUEST, id})
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListPage);
