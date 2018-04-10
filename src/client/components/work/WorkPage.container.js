import React from 'react';
import {connect} from 'react-redux';
import WorkItem from './WorkItemConnected.component';
import CheckmarkConnected from '../general/CheckmarkConnected.component';
import BookCover from '../general/BookCover.component';
import OrderButton from '../order/OrderButton.component';
import Slider from '../belt/Slider.component';
import Link from '../general/Link.component';
import {getListsForOwner, SYSTEM_LIST} from '../../redux/list.reducer';
import {RECOMMEND_REQUEST} from '../../redux/recommend';
import {BOOKS_REQUEST} from '../../redux/books.reducer';
import {getRecommendedBooks} from '../../redux/selectors';
import {get} from 'lodash';

let selectedTagIds = [];

class WorkPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tagsCollapsed: true, transition: true, addToList: null};
  }

  fetchWork(pid) {
    this.props.fetchWork(pid);
    this.setState({tagsCollapsed: true, transition: false});
  }

  componentDidMount() {
    this.fetchWork(this.props.pid);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.pid !== nextProps.pid) {
      this.fetchWork(nextProps.pid);
    }
    const nextTags = get(nextProps, 'work.book.tags');
    const prevTags = get(this.props, 'work.book.tags');
    if (nextTags && prevTags !== nextTags) {
      selectedTagIds = nextTags.map(t => t.id);
      this.props.fetchRecommendations(selectedTagIds);
    }
  }

  render() {
    const work = this.props.work;

    if (!work || !work.book) {
      return null;
    }

    // we need to massage the data
    // stemnings tags, we use the taxonomy first level title
    // for all other teags we use the second level title
    let tagGroups = {};
    work.book.tags &&
      work.book.tags.forEach(t => {
        let groupName =
          t.parents[0] === 'stemning' ? t.parents[0] : t.parents[1];
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
      work.book.taxonomy_description || work.book.description;

    return (
      <div className="work-page">
        <div className="row work-details">
          <div className="col-xs-11 col-centered text-left">
            <div className="col-xs-4 col-lg-3 cover-image-wrapper">
              <BookCover book={work.book} />
            </div>
            <div className="col-xs-8 col-lg-9 info">
              <div className="title">{work.book.title}</div>
              <div className="creator">{work.book.creator}</div>
              <div className="meta-description">
                {tax_description &&
                  tax_description
                    .split('\n')
                    .map((line, idx) => <p key={idx}>{line}</p>)}
              </div>
              <div className="line" />
              <div className="description">{work.book.description}</div>
              <div className="extra">
                <div className="subjects">{work.book.subject}</div>
                {work.book.pages && (
                  <div className="page-count">{`${work.book.pages} sider`}</div>
                )}
                <div className="year">
                  {work.book.literary_form}
                  {work.book.literary_form && work.book.first_edition_year
                    ? ', '
                    : ''}
                  {work.book.first_edition_year
                    ? work.book.first_edition_year
                    : ''}
                </div>
                {work.book.genre && (
                  <div className="genre">{work.book.genre}</div>
                )}
              </div>
              <div className="bibliotek-dk-link">
                <a
                  target="_blank"
                  href={`https://bibliotek.dk/linkme.php?rec.id=${encodeURIComponent(
                    work.book.pid
                  )}`}
                >
                  Se mere på bibliotek.dk
                </a>
              </div>
              <OrderButton
                book={work.book}
                style={{marginTop: 10, float: 'right'}}
              />

              <CheckmarkConnected
                book={{book: work.book}}
                origin="Fra egen værkside"
              />
            </div>
            <div
              id="collapsable-tags"
              style={{
                transition: this.state.transition ? null : 'none',
                height: this.state.tagsCollapsed ? '100px' : height + 'px',
                overflowY: 'hidden'
              }}
              className="tags-container text-left"
            >
              {tagGroups.map(group => {
                return (
                  <div key={group.title} className="tag-group">
                    <div className="tag-group-title col-xs-3 col-lg-2">
                      {group.title}
                    </div>
                    <div className="col-xs-9 col-lg-10">
                      {group.data.map(t => {
                        return (
                          <Link
                            className="tag tags tag-medium"
                            key={t.id}
                            href="/find"
                            params={{tag: t.id}}
                          >
                            {t.title}
                          </Link>
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
        {this.props.recommendations.books && (
          <div className="row belt text-left">
            <div className="col-xs-11 col-centered">
              <div className="col-xs-12 header">
                <span className="belt-title">
                  Bøger der giver lignende oplevelser
                </span>
              </div>
              <div className="row mb4">
                <div className="col-xs-12">
                  <Slider>
                    {this.props.recommendations.books.map(w => {
                      return (
                        <WorkItem
                          work={w}
                          key={w.book.pid}
                          origin={`Minder om "${work.book.title}"`}
                        />
                      );
                    })}
                  </Slider>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const recommendations = getRecommendedBooks(state, selectedTagIds, 21);

  recommendations.books = recommendations.books.filter(
    r => r.book.pid !== ownProps.pid
  );

  return {
    work: state.booksReducer.books[ownProps.pid],
    filterState: state.filterReducer,
    shortListState: state.shortListReducer,
    systemLists: getListsForOwner(state.listReducer, {
      type: SYSTEM_LIST,
      owner: state.userReducer.openplatformId,
      sort: true
    }),
    recommendations: recommendations,
    isLoggedIn: state.userReducer.isLoggedIn
  };
};

export const mapDispatchToProps = dispatch => ({
  fetchWork: pid =>
    dispatch({
      type: BOOKS_REQUEST,
      pids: [pid],
      includeTags: true,
      force: true
    }),
  fetchRecommendations: tags =>
    dispatch({
      type: RECOMMEND_REQUEST,
      tags,
      max: 21
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkPage);
