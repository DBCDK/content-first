import React from 'react';
import {connect} from 'react-redux';
import {LIST_LOAD_REQUEST} from '../../redux/list.reducer';
import SimpleList from './templates/SimpleList.component';
import Link from '../general/Link.component';

class ListPage extends React.Component {
  componentDidMount() {
    this.props.dispatch({type: LIST_LOAD_REQUEST, id: this.props.id});
  }
  getTemplate(list) {
    switch (list.template) {
      case 'simplelist':
        return SimpleList;
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
        <h1 className="t-title h-underline mb4">{list.title}</h1>
        <div className="row">
          <div className="list tl col-xs-8">
            <Template list={list} profile={profile} />;
          </div>
          <div className="col-xs-4">
            <Link href={`/lister/${list.id}/rediger`}>Rediger liste</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state, ownProps) => {
  return {
    list: state.listReducer.lists.filter(list => list.id === ownProps.id)[0]
  };
})(ListPage);
