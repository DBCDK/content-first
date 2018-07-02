import React from 'react';
import {connect} from 'react-redux';
import WorkItem from './WorkItem.component';
import {HISTORY_PUSH} from '../../redux/middleware';
import {getListsForOwner, SYSTEM_LIST} from '../../redux/list.reducer';

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
        origin={this.props.origin}
        showTaxonomy={this.props.showTaxonomy}
        changeMap={this.props.changeMap}
        isLoggedIn={this.props.user.isLoggedIn}
        work={this.props.work}
        systemLists={this.props.systemLists}
        onCoverClick={pid => {
          this.props.dispatch({type: HISTORY_PUSH, path: `/værk/${pid}`});
        }}
        marked={remembered[this.props.work.book.pid]}
        visibleInSlider={this.props.visibleInSlider}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    shortListState: state.shortListReducer,
    systemLists: getListsForOwner(state, {
      type: SYSTEM_LIST,
      owner: state.userReducer.openplatformId,
      sort: true
    }),
    changeMap: state.listReducer.changeMap,
    user: state.userReducer
  };
};

export default connect(mapStateToProps)(WorkItemConnected);
