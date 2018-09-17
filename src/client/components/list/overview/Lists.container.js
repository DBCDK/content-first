import React from 'react';
import {connect} from 'react-redux';
import {
  getListsForOwner,
  CUSTOM_LIST,
  SYSTEM_LIST
} from '../../../redux/list.reducer';
import {HISTORY_PUSH} from '../../../redux/middleware';

import ListItem from '../../list/overview/ListItem.component.js';

export class Lists extends React.Component {
  render() {
    return (
      <div className="lists-page ">
        <div className="mb3">
          {this.props.systemLists.map(data => (
            <ListItem
              list={data.list}
              title={data.title}
              _id={data._id}
              key={data._id}
              type={data.type}
              image={data.image}
              hideIfEmpty={false}
            />
          ))}
        </div>
        <div className="mb3">
          {this.props.lists.map(data => (
            <ListItem
              list={data.list}
              title={data.title}
              _id={data._id}
              key={data._id}
              type={data.type}
              image={data.image ? `/v1/image/${data.image}/50/50` : null}
              hideIfEmpty={false}
            />
          ))}
        </div>
        <div>
          <a
            href="/lister/opret"
            className="btn btn-primary d-inline-flex align-items-center"
            onClick={e => {
              this.props.dispatch({type: HISTORY_PUSH, path: '/lister/opret'});
              e.preventDefault();
            }}
          >
            Ny liste
            <span className="material-icons ml4">add</span>
          </a>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    lists: getListsForOwner(state, {
      type: CUSTOM_LIST,
      _owner: state.userReducer.openplatformId,
      sort: true
    }),
    systemLists: getListsForOwner(state, {
      type: SYSTEM_LIST,
      _owner: state.userReducer.openplatformId,
      sort: true
    })
  };
};
export default connect(mapStateToProps)(Lists);
