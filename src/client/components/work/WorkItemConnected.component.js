import React from 'react';
import {connect} from 'react-redux';
import WorkItem from './WorkItem.component';
import {HISTORY_PUSH} from '../../redux/middleware';
import {ON_SHORTLIST_TOGGLE_ELEMENT} from '../../redux/shortlist.reducer';
import {storeList, getLists, toggleElementInList, SYSTEM_LIST} from '../../redux/list.reducer';
import {OPEN_MODAL} from '../../redux/modal.reducer';

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
        changeMap={this.props.changeMap}
        isLoggedIn={this.props.profileState.user.isLoggedIn}
        work={this.props.work}
        systemLists={this.props.systemLists}
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
          this.props.dispatch(toggleElementInList(this.props.work, list.data.id));
          this.props.dispatch(storeList(list.data.id));
        }}
        onAddToListOpenModal={() => {
          this.props.dispatch({
            type: OPEN_MODAL,
            modal: 'addToList',
            context: this.props.work
          });
        }}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    shortListState: state.shortListReducer,
    systemLists: getLists(state.listReducer, {type: SYSTEM_LIST, owner: state.profileReducer.user.openplatformId, sort: true}),
    changeMap: state.listReducer.changeMap,
    profileState: state.profileReducer
  };
};

export default connect(mapStateToProps)(WorkItemConnected);
