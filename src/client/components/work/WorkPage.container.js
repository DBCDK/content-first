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
    this.props.dispatch({type: ON_WORK_REQUEST, pid: this.props.pid});
    this.setState({tagsCollapsed: true, transition: false});
  }

  componentDidMount() {
    this.fetchWork();
  }

  componentDidUpdate() {
    // only fetch work if pid has changed to avoid endless loop
    if (this.props.pid !== this.props.workState.pid) {
      this.fetchWork();
    }
  }

  render() {
    const work = this.props.workState.work;

    if (!work || !work.data) {
      return null;
    }

    // we need to massage the data
    // stemnings tags, we use the taxonomy first level title
    // for all other teags we use the second level title
    let tagGroups = {};
    work.tags.forEach(t => {
      let groupName = t.parents[0] === 'Stemning' ? t.parents[0] : t.parents[1];
      if (!tagGroups[groupName]) {
        tagGroups[groupName] = [];
      }
      tagGroups[groupName].push(t);
    });
    tagGroups = Object.keys(tagGroups).map(key => {
      return {title: key, data: tagGroups[key]};
    });
    tagGroups.sort((group1, group2) => group1.title < group2.title ? -1 : 1);

    const tagsDomNode = document.getElementById('collapsable-tags');
    const height = tagsDomNode ? tagsDomNode.scrollHeight : 0;

    return (
      <div className='work-page'>
        <div className='row work-details'>
          <div className='col-xs-11 col-centered text-left'>
            <div className='cover-image-wrapper'>
              <img style={{height: '100%'}} alt='' src={work.links.cover}/>
            </div>
            <div className='info'>
              <div className='title'>{work.data.title}</div>
              <div className='creator'>{work.data.creator}</div>
              <div className='meta-description'>{work.data.taxonomy_description && work.data.taxonomy_description.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}</div>
              <div className='line'></div>
              <div className='description'>{work.data.bibliographic_description}</div>
              <div className='extra'>
                <div className='subjects'>{work.data.subject}</div>
                {work.data.pages && <div className='page-count'>{`${work.data.pages} sider`}</div>}
                <div className='year'>
                  {work.data.literary_form}
                  {work.data.literary_form && work.data.first_edition_year ? ', ' : ''}
                  {work.data.first_edition_year ? work.data.first_edition_year : ''}
                </div>
                {work.data.genre && <div className='genre'>{work.data.genre}</div>}
              </div>
            </div>
            <div
              id='collapsable-tags'
              style={{transition: this.state.transition ? null : 'none', height: this.state.tagsCollapsed ? '120px' : height+'px', overflowY: 'hidden'}}
              className='tags col-xs-12 text-left'>
              {tagGroups.map(group => {
                return (
                  <div key={group.title} className='tag-group'>
                    <div className='tag-group-title col-xs-2'>{group.title}</div>
                    <div className='col-xs-10'>
                      {group.data.map(t => {
                        return <span key={t.id} className='tag'>{t.title}</span>;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='col-xs-10 col-xs-offset-2'>
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
              <span className='belt-title'>Bøger der giver lignende oplevelser</span>
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
