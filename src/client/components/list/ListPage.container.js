import React from 'react';
import {connect} from 'react-redux';
import {getListById} from '../../redux/list.reducer';
import SimpleList from './templates/SimpleList.component';
import CircleTemplate from './templates/CircleTemplate.container';
import Link from '../general/Link.component';

class ListPage extends React.Component {
  getTemplate(list) {
    switch (list.template) {
      case 'simple':
        return SimpleList;
      case 'circle':
        return CircleTemplate;
      default:
        return SimpleList;
    }
  }
  render() {
    const {list} = this.props;

    if (!list) {
      return <div>Listen findes ikke</div>;
    }

    const profile = this.props.profiles[this.props.list.owner];

    const Template = this.getTemplate(list);

    let editButton = '';
    if (list.type === 'CUSTOM_LIST') {
      editButton = (
        <Link
          className="small link-subtle align-middle ml2"
          href={`/lister/${list.id}/rediger`}
        >
          Redigér liste
        </Link>
      );
    }

    return (
      <div className="list-wrapper tl">
        <div className="mb4 mt5 col-xs-offset-0 col-md-offset-1">
          <h1 className="t-title h-tight h-underline inline-block align-middle">
            {list.title}
          </h1>
          {editButton}
        </div>
        <Template
          list={list}
          profile={profile}
          isOwner={this.props.isOwner}
          loggedInUserId={this.props.loggedInUserId}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const list = getListById(state.listReducer, ownProps.id);
  return {
    list: getListById(state.listReducer, ownProps.id),
    profiles: state.users.toJS(),
    loggedInUserId: state.userReducer.openplatformId,
    isOwner: list && list.owner === state.userReducer.openplatformId
  };
};

export default connect(mapStateToProps)(ListPage);
