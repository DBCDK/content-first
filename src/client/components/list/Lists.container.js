import React from 'react';
import {connect} from 'react-redux';
import {getLists, CUSTOM_LIST} from '../../redux/list.reducer';
import {HISTORY_PUSH} from '../../redux/middleware';

class Lists extends React.Component {
  render() {
    return (
      <div className="lists-page">
        <h1>Mine Lister</h1>
        {this.props.customLists.map(list => (
          <a
            key={list.data.id}
            href={`/lister/${list.data.id}`}
            className="list"
            onClick={e => {
              this.props.dispatch({
                type: HISTORY_PUSH,
                path: `/lister/${list.data.id}`
              });
              e.preventDefault();
            }}
          >
            <h2>{list.data.title}</h2>
            <p>{list.data.description}</p>
          </a>
        ))}
        <div>
          <a
            href="/lister/opret"
            className="btn btn-primary"
            onClick={e => {
              this.props.dispatch({type: HISTORY_PUSH, path: '/lister/opret'});
              e.preventDefault();
            }}
          >
            Opret ny liste
          </a>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    customLists: getLists(state.listReducer, {type: CUSTOM_LIST, owner: state.profileReducer.user.openplatformId, sort: true})
  };
};
export default connect(mapStateToProps)(Lists);
