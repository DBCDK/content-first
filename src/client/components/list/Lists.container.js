import React from 'react';
import {connect} from 'react-redux';
import {LIST_LOAD_REQUEST, SYSTEM_LIST} from '../../redux/list.reducer';
import {HISTORY_PUSH} from '../../redux/middleware';

class Lists extends React.Component {
  componentDidMount() {
    this.props.dispatch({type: LIST_LOAD_REQUEST});
  }
  render() {
    const {lists} = this.props.listState;
    return (
      <div className="lists-page">
        <h1>Mine Lister</h1>
        {lists.filter(list => list.type !== SYSTEM_LIST).map(list => (
          <a
            href={`/lister/${list.id}`}
            className="list"
            onClick={e => {
              this.props.dispatch({
                type: HISTORY_PUSH,
                path: `/lister/${list.id}`
              });
              e.preventDefault();
            }}
          >
            <h2>{list.title}</h2>
            <p>{list.description}</p>
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

export default connect(
  // Map redux state to props
  state => {
    return {listState: state.listReducer};
  }
)(Lists);
