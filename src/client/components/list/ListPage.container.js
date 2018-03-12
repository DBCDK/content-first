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
    let {
      list,
      profile = {
        name: 'Profile Name',
        src: 'http://p-hold.com/200/200'
      }
    } = this.props;

    if (!list) {
      return <div>Listen findes ikke</div>;
    }
    if (this.props.list) {
      profile = this.props.profile[this.props.list.owner];
    }

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
        <CircleTemplate list={list} profile={profile} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    list: getListById(state.listReducer, ownProps.id),
    profile: state.users.toJS()
  };
};

export default connect(mapStateToProps)(ListPage);
