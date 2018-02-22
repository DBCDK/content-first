import React from 'react';
import {connect} from 'react-redux';
import {getListById} from '../../redux/list.reducer';
import SimpleList from './templates/SimpleList.component';
import CircleTemplate from './templates/CircleTemplate.container';
import Link from '../general/Link.component';

class ListPage extends React.Component {
  getTemplate(list) {
    switch (list.data.template) {
      case 'simple':
        return SimpleList;
      case 'circle':
        return CircleTemplate;
      default:
        return SimpleList;
    }
  }
  render() {
    const {
      list,
      profile = {
        name: 'Profile Name',
        src: 'http://p-hold.com/200/200',
        description: 'This is a dummy profile. Profiles needs to be implemented'
      }
    } = this.props;
    if (!list) {
      return <div>Listen findes ikke</div>;
    }
    const Template = this.getTemplate(list);
    return (
      <div className="list-wrapper tl">
        <div className="mb4 mt5 col-xs-offset-0 col-md-offset-1">
          <h1 className="t-title h-tight h-underline inline-block align-middle">
            {list.data.title}
          </h1>
          <Link
            className="small link-subtle align-middle ml2"
            href={`/lister/${list.data.id}/rediger`}
          >
            Redigér liste
          </Link>
        </div>
        <Template list={list} profile={profile} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    list: getListById(state.listReducer, ownProps.id)
  };
};

export default connect(mapStateToProps)(ListPage);
