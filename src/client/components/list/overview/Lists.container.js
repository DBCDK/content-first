import React from 'react';
import {connect} from 'react-redux';
import T from '../../base/T';
import ListItem from '../../list/overview/ListItem.component.js';
import {
  CUSTOM_LIST,
  SYSTEM_LIST,
  OWNED_LISTS_REQUEST,
  createGetLists
} from '../../../redux/list.reducer';
import {OPEN_MODAL} from '../../../redux/modal.reducer';

export class Lists extends React.Component {
  componentDidMount() {
    this.fetch();
  }
  componentDidUpdate() {
    this.fetch();
  }
  fetch = () => {
    if (this.props.openplatformId && !this.fetched) {
      this.props.loadLists();
      this.fetched = true;
    }
  };
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
            href="!#"
            className="btn btn-primary d-inline-flex align-items-center"
            onClick={e => {
              e.preventDefault();
              this.props.createNewList();
            }}
          >
            <T component="list" name="createNew" />
            <span className="material-icons ml4">add</span>
          </a>
        </div>
      </div>
    );
  }
}
const customListSelector = createGetLists();
const systemListsSelector = createGetLists();
const mapStateToProps = state => {
  return {
    lists: customListSelector(state, {
      type: CUSTOM_LIST,
      _owner: state.userReducer.openplatformId,
      sort: true
    }),
    systemLists: systemListsSelector(state, {
      type: SYSTEM_LIST,
      _owner: state.userReducer.openplatformId,
      sort: true
    }),
    openplatformId: state.userReducer.openplatformId
  };
};
export const mapDispatchToProps = dispatch => ({
  loadLists: () => dispatch({type: OWNED_LISTS_REQUEST}),
  createNewList: () => dispatch({type: OPEN_MODAL, modal: 'list'})
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lists);
