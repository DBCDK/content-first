import React from 'react';
import {connect} from 'react-redux';
import WorkItem from './WorkItem.component';
import {HISTORY_PUSH} from '../../redux/middleware';
import {ON_SHORTLIST_TOGGLE_ELEMENT} from '../../redux/shortlist.reducer';
import {LIST_TOGGLE_ELEMENT} from '../../redux/list.reducer';
import {OPEN_MODAL} from '../../redux/modal.reducer';
import {ORDER} from '../../redux/order.reducer';

class WorkItemConnected extends React.PureComponent {
  static defaultProps = {
    showTaxonomy: true,
    workClass: 'work'
  };
  render() {
    const remembered = {};
    this.props.shortListState.elements.forEach(e => {
      remembered[e.book.pid] = true;
    });
    return (
      <WorkItem
        workClass={this.props.workClass}
        showTaxonomy={this.props.showTaxonomy}
        changeMap={this.props.listState.changeMap}
        isLoggedIn={this.props.profileState.user.isLoggedIn}
        work={this.props.work}
        lists={this.props.listState.lists}
        onCoverClick={pid => {
          this.props.dispatch({type: HISTORY_PUSH, path: `/værk/${pid}`});
        }}
        onRememberClick={element => {
          this.props.dispatch({
            type: ON_SHORTLIST_TOGGLE_ELEMENT,
            element,
            origin: this.props.origin || ''
          });
        }}
        marked={remembered[this.props.work.book.pid]}
        onAddToList={list => {
          this.props.dispatch({
            type: LIST_TOGGLE_ELEMENT,
            id: list.id,
            element: this.props.work
          });
        }}
        onAddToListOpenModal={() => {
          this.props.dispatch({
            type: OPEN_MODAL,
            modal: 'addToList',
            context: this.props.work
          });
        }}
        onOrder={() => {
          this.props.dispatch({
            type: ORDER,
            book: this.props.work.book
          });
        }}
      />
    );
  }
}

export default connect(state => {
  return {
    shortListState: state.shortListReducer,
    listState: state.listReducer,
    profileState: state.profileReducer
  };
})(WorkItemConnected);
