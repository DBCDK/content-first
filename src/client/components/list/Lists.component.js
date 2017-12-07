import React from 'react';
import {connect} from 'react-redux';
import {LIST_LOAD_REQUEST} from '../../redux/list.reducer';

class Lists extends React.Component {
  componentDidMount() {
    this.props.dispatch({type: LIST_LOAD_REQUEST});
  }
  render() {
    const {lists} = this.props.listState;
    return (
      <div className="lists-page">
        <h1>Mine Lister</h1>
        {lists.map(list => (
          <a href={`/lister/${list.id}`} className="list">
            <h2>{list.title}</h2>
            <p>{list.description}</p>
          </a>
        ))}
        <div>
          <a href="/lister/opret" className="btn btn-primary">
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
