import React from 'react';
import {connect} from 'react-redux';
import {LIST_LOAD_REQUEST} from '../../redux/list.reducer';
import WorkItem from '../work/WorkItemConnected.component';

const ProfileImage = ({src, name, type = 'card', className = ''}) => (
  <div className={`profile-${type} ${className}`}>
    <span className="profile-image small round">
      <img className="cover" src={src} alt={name} />
    </span>
    <p className="profile-name t-body h4">{name}</p>
  </div>
);

const ListItem = ({book, description, profile}) => (
  <div className="row simplelist-item mb4">
    <div className="meta col-xs-3 tc">
      <WorkItem
        work={{book}}
        showTaxonomy={false}
        workClass="work simplelist"
      />
    </div>
    <div className="meta col-xs-9">
      <h4 className="w-title h-tight">{book.title}</h4>
      <h5 className="w-creator h-tight mb2">{book.creator}</h5>

      {(description && (
        <div className="profile-description">
          <ProfileImage
            src={profile.src}
            name={profile.name}
            type="list"
            className="mb1"
          />
          <p className="t-body">{description}</p>
        </div>
      )) || <p className="t-body">{book.description}</p>}
    </div>
  </div>
);

class ListPage extends React.Component {
  componentDidMount() {
    this.props.dispatch({type: LIST_LOAD_REQUEST, id: this.props.id});
  }
  render() {
    const {
      list,
      profile = {name: 'Profile Name', src: 'http://p-hold.com/200/200'}
    } = this.props;
    if (!list) {
      return <div>Listen findes ikke</div>;
    }
    return (
      <div className="list tl col-xs-9">
        <h1 className="t-title h-underline mb4">{list.title}</h1>
        <div className="row mb4">
          <div className="col-xs-3 tc">
            <ProfileImage
              src={'http://p-hold.com/200/200'}
              name="Profile Name"
            />
          </div>
          <div className="col-xs-9">
            <p className="t-body">{list.description}</p>
          </div>
        </div>
        <div className="list">
          {list.list.map(({book, description}) => (
            <ListItem
              key={book.pid}
              book={book}
              description={description}
              profile={profile}
            />
          ))}
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
