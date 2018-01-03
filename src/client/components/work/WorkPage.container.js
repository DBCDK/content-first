import React from 'react';
import {connect} from 'react-redux';
import ScrollableBelt from '../general/ScrollableBelt.component';
import WorkItem from './WorkItemConnected.component';
import CheckmarkButton from '../general/CheckmarkButton.component';
import BookCover from '../general/BookCover.component';
import {ON_WORK_REQUEST} from '../../redux/work.reducer';
import {HISTORY_PUSH} from '../../redux/middleware';
import {ON_RESET_FILTERS} from '../../redux/filter.reducer';
import {ON_SHORTLIST_TOGGLE_ELEMENT} from '../../redux/shortlist.reducer';
import {getLeaves} from '../../utils/filters';

class WorkPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tagsCollapsed: true, transition: true, addToList: null};
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
    tagGroups.sort((group1, group2) => (group1.title < group2.title ? -1 : 1));

    const tagsDomNode = document.getElementById('collapsable-tags');
    const height = tagsDomNode ? tagsDomNode.scrollHeight : 0;
    const tax_description =
      work.data.taxonomy_description || work.data.description;

    const allowedFilterIds = getLeaves(this.props.filterState.filters).map(
      f => f.id
    );

    const remembered = this.props.shortListState.elements.reduce((map, e) => {
      map[e.book.pid] = e;
      return map;
    }, {});

    return (
      <div className="work-page">
        <div className="row work-details">
          <div className="col-xs-11 col-centered text-left">
            <div className="col-xs-4 col-lg-3 cover-image-wrapper">
              <BookCover book={work.data} />
            </div>
            <div className="col-xs-8 col-lg-9 info">
              <div className="title">{work.data.title}</div>
              <div className="creator">{work.data.creator}</div>
              <div className="meta-description">
                {tax_description &&
                  tax_description
                    .split('\n')
                    .map((line, idx) => <p key={idx}>{line}</p>)}
              </div>
              <div className="line" />
              <div className="description">{work.data.description}</div>
              <div className="extra">
                <div className="subjects">{work.data.subject}</div>
                {work.data.pages && (
                  <div className="page-count">{`${work.data.pages} sider`}</div>
                )}
                <div className="year">
                  {work.data.literary_form}
                  {work.data.literary_form && work.data.first_edition_year
                    ? ', '
                    : ''}
                  {work.data.first_edition_year
                    ? work.data.first_edition_year
                    : ''}
                </div>
                {work.data.genre && (
                  <div className="genre">{work.data.genre}</div>
                )}
              </div>
              <div className="bibliotek-dk-link">
                <a
                  target="_blank"
                  href={`https://bibliotek.dk/linkme.php?rec.id=${encodeURIComponent(
                    work.data.pid
                  )}`}
                >
                  Se mere på bibliotek.dk
                </a>
              </div>
              <CheckmarkButton
                label="Husk"
                marked={remembered[work.data.pid]}
                onClick={() => {
                  this.props.dispatch({
                    type: ON_SHORTLIST_TOGGLE_ELEMENT,
                    element: {book: work.data},
                    origin: 'Fra egen værkside'
                  });
                }}
              />
            </div>
            <div
              id="collapsable-tags"
              style={{
                transition: this.state.transition ? null : 'none',
                height: this.state.tagsCollapsed ? '120px' : height + 'px',
                overflowY: 'hidden'
              }}
              className="tags text-left"
            >
              {tagGroups.map(group => {
                return (
                  <div key={group.title} className="tag-group">
                    <div className="tag-group-title col-xs-3 col-lg-2">
                      {group.title}
                    </div>
                    <div className="col-xs-9 col-lg-10">
                      {group.data.map(t => {
                        if (allowedFilterIds.indexOf(t.id + '') >= 0) {
                          return (
                            <span
                              key={t.id}
                              className="tag active"
                              onClick={() => {
                                this.props.dispatch({
                                  type: ON_RESET_FILTERS,
                                  beltName: 'Passer med min smag'
                                });
                                this.props.dispatch({
                                  type: HISTORY_PUSH,
                                  path: '/passer-med-min-smag',
                                  params: {filter: t.id}
                                });
                              }}
                            >
                              {t.title}
                            </span>
                          );
                        }
                        return (
                          <span key={t.id} className="tag">
                            {t.title}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="col-xs-9 col-xs-offset-3 col-lg-10 col-lg-offset-2">
              <button
                className={
                  this.state.tagsCollapsed
                    ? 'expand-btn btn btn-primary'
                    : 'expand-btn btn btn-success'
                }
                onClick={() => {
                  this.setState({
                    tagsCollapsed: !this.state.tagsCollapsed,
                    transition: true
                  });
                }}
              >
                {this.state.tagsCollapsed ? 'Flere' : 'Færre'}
              </button>
            </div>
          </div>
        </div>
        {work.similar && (
          <div className="row belt text-left">
            <div className="col-xs-11 col-centered">
              <div className="col-xs-12 header">
                <span className="belt-title">
                  Bøger der giver lignende oplevelser
                </span>
              </div>
              <ScrollableBelt works={work.similar} scrollInterval={3}>
                {work.similar &&
                  work.similar.map(w => (
                    <WorkItem
                      work={w}
                      key={w.book.pid}
                      origin={`Minder om "${work.data.title}"`}
                    />
                  ))}
              </ScrollableBelt>
            </div>
          </div>
        )}
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
)(WorkPage);
