import React from 'react';
import {connect} from 'react-redux';

import {ON_WORK_REQUEST} from '../../redux/work.reducer';

export class Pulse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tagsCollapsed: true, transition: true, addToList: null};
  }

  fetchWork(pid) {
    this.props.dispatch({type: ON_WORK_REQUEST, pid: pid});
    // this.setState({tagsCollapsed: true, transition: false});
  }

  rollOverTrigger = (pid, desc, pos) => {
    this.fetchWork(pid);

    let e = document.getElementById('rollover');

    if (!e.classList.contains('rollover-display')) {
      e.classList.add('rollover-display');
    }

    document.getElementById('rollover-desc').innerHTML = desc;
    document.getElementById('rollover-title').innerHTML = 'Im a title';

    e.setAttribute('style', 'left:' + pos.x + '%; top:' + pos.y + '%;');
  };

  render() {
    const work = this.props.workState.work;

    let styles = {
      left: this.props.position.x + '%',
      top: this.props.position.y + '%'
    };

    return (
      <div
        className="pulse-toucharea"
        style={styles}
        onClick={() => {
          this.rollOverTrigger(
            this.props.pid,
            this.props.description,
            this.props.position
          );
        }}
      >
        <div className="pulse" />
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  state => {
    return {
      workState: state.workReducer,
      filterState: state.filterReducer,
      shortListState: state.shortListReducer
    };
  }
)(Pulse);
