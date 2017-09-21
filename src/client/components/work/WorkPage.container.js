import React from 'react';
import {connect} from 'react-redux';
import {ON_WORK_REQUEST} from '../../redux/work.reducer';
import ScrollableBelt from '../frontpage/ScrollableBelt.component';
import {HISTORY_PUSH} from '../../redux/middleware';

class WorkPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tagsCollapsed: true, transition: true};
  }

  fetchWork() {
    // only fetch work if pid has changed to avoid endless loop
    if (this.props.pid !== this.props.workState.pid) {
      this.props.dispatch({type: ON_WORK_REQUEST, pid: this.props.pid});
      this.setState({tagsCollapsed: true, transition: false});
    }
  }

  componentDidMount() {
    this.fetchWork();
  }

  componentDidUpdate() {
    this.fetchWork();
  }

  render() {
    const work = this.props.workState.work;

    if (!work || !work.data) {
      return null;
    }

    const tagsDomNode = document.getElementById('collapsable-tags');
    const height = tagsDomNode ? tagsDomNode.scrollHeight : 0;

    return (
      <div className='work-page'>
        <div className='row work-details'>
          <div className='col-xs-9 col-centered text-left'>
            <div className='cover col-xs-3'><img alt='' src={work.links.cover}/></div>
            <div className='col-xs-9'>
              <div className='title'>{work.data.title}</div>
              <div className='creator'>{work.data.creator}</div>
              <div className='description'>{work.data.description.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}</div>
            </div>
            <div
              id='collapsable-tags'
              style={{transition: this.state.transition ? null : 'none', height: this.state.tagsCollapsed ? '90px' : height+'px', overflowY: 'hidden'}}
              className='tags col-xs-12 text-left'>
              {work.tags.map(t => {
                return <span key={t.id} className='tag'>{t.title}</span>;
              })}
            </div>
            <div className='col-xs-12 text-center'>
              <button className={this.state.tagsCollapsed ? 'expand-btn btn btn-primary' : 'expand-btn btn btn-success'} onClick={() => {
                this.setState({tagsCollapsed: !this.state.tagsCollapsed, transition: true});
              }}>
                {this.state.tagsCollapsed ? 'Flere' : 'Færre'}
              </button>
            </div>
          </div>
        </div>
        {work.similar && <div className='row belt text-left'>
          <div className='col-xs-11 col-centered'>
            <div className='col-xs-12 header'>
              <span className='belt-title'>Lignende titler</span>
            </div>
            <ScrollableBelt
              works={work.similar}
              scrollInterval={3}
              onCoverClick={(pid) => {
                this.props.dispatch({type: HISTORY_PUSH, path: `/værk/${pid}`});
              }}
            />
          </div>
        </div>}
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  (state) => {
    return {workState: state.workReducer};
  }
)(WorkPage);
