import React from 'react';
import {connect} from 'react-redux';
import WorkItem from './WorkItemConnected.component';
import Spinner from '../general/Spinner.component';
import CheckmarkConnected from '../general/CheckmarkConnected.component';
import BookCover from '../general/BookCover.component';
import OrderButton from '../order/OrderButton.component';
import Slider from '../belt/Slider.component';
import Link from '../general/Link.component';
import SocialShareButton from '../general/SocialShareButton.component';
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

    if (
      nextTags &&
      get(this.props, 'work.book.tags.length') !== nextTags.length
    ) {
      selectedTagIds = nextTags.map(t => t.id);
      this.props.fetchRecommendations(selectedTagIds);
    }
  }

  render() {
    const work = get(this.props, 'work');
    const book = get(this.props, 'work.book');

    console.log('wwwork', this.props.work);

    if (!book) {
      return null;
    }

    // we need to massage the data
    // stemnings tags, we use the taxonomy first level title
    // for all other teags we use the second level title
    let tagGroups = {};
    if (book.tags) {
      book.tags.forEach(t => {
        let groupName =
          t.parents[0] === 'stemning' ? t.parents[0] : t.parents[1];
        if (!tagGroups[groupName]) {
          tagGroups[groupName] = [];
        }
        tagGroups[groupName].push(t);
      });
    }
    tagGroups = Object.keys(tagGroups).map(key => {
      return {title: key, data: tagGroups[key]};
    });
    tagGroups.sort((group1, group2) => (group1.title < group2.title ? -1 : 1));

    const tagsDomNode = document.getElementById('collapsable-tags');
    const height = tagsDomNode ? tagsDomNode.scrollHeight : 0;
    const tax_description = book.taxonomy_description || book.description;

    // check if reviews contain one or more external urls and they point to litteratursiden
    let reviewHasContent = false;
    if (work.reviewsHasLoaded) {
      book.reviews.data.filter(review => {
        if (
          review.identifierURI &&
          review.identifierURI[0].includes('litteratursiden.dk')
        ) {
          reviewHasContent = true;
        }
      });
    }

    return (
      <div className="work-page">
        <div className="row work-details">
          <div className="col-xs-11 col-centered text-left">
            <div className="col-xs-4 col-lg-3 cover-image-wrapper">
              <BookCover book={book} />
            </div>
            <div className="col-xs-8 col-lg-9 info">
              <div className="title">{book.title}</div>
              <div className="creator">{book.creator}</div>
              <div className="meta-description">
                {tax_description &&
                  tax_description
                    .split('\n')
                    .map((line, idx) => <p key={idx}>{line}</p>)}
              </div>
              <div className="line" />
              <div className="row">
                <div className="col-xs-8">
                  <div className="description">{book.description}</div>
                  <div className="extra">
                    <div className="subjects">{book.subject}</div>
                    {book.pages && (
                      <div className="page-count">{`${book.pages} sider`}</div>
                    )}
                    <div className="year">
                      {book.literary_form}
                      {book.literary_form && book.first_edition_year
                        ? ', '
                        : ''}
                      {book.first_edition_year ? book.first_edition_year : ''}
                    </div>
                    {book.genre && <div className="genre">{book.genre}</div>}
                  </div>
                  <div className="bibliotek-dk-link">
                    <a
                      target="_blank"
                      href={`https://bibliotek.dk/linkme.php?rec.id=${encodeURIComponent(
                        book.pid
                      )}`}
                    >
                      Se mere på bibliotek.dk
                    </a>
                  </div>

                  <CheckmarkConnected
                    book={{book}}
                    origin="Fra egen værkside"
                  />

                  <OrderButton
                    book={book}
                    style={{marginLeft: 10, border: 'none'}}
                  />
                  {(work && work.refsIsLoading) ||
                  (work && work.collectionIsLoading) ? (
                    <Spinner
                      style={{
                        width: 20,
                        height: 20,
                        margin: '10px 30px 0px 30px'
                      }}
                    />
                  ) : work.collectionHasLoaded &&
                  book.collection.data.length > 0 ? (
                    book.collection.data.map(r => {
                      if (
                        r.identifierURI &&
                        r.identifierURI[0].includes('ereolen.dk') &&
                        r.type[0] === 'Ebog'
                      ) {
                        return (
                          <SocialShareButton
                            className={'ssb-ereolen'}
                            styles={{
                              display: 'inlineBlock',
                              marginLeft: '10px'
                            }}
                            href={r.identifierURI}
                            icon={null}
                            hex={'#337ab7'}
                            size={32}
                            shape="square"
                            txt="Bestil på eReolen"
                          />
                        );
                      }
                    })
                  ) : (
                    ''
                  )}
                </div>

                <div className="col-xs-4 reviews">
                  <div className="col-xs-12 reviews-heading">
                    Anmeldelser fra litteratursiden:
                  </div>
                  {(work && work.refsIsLoading) ||
                  (work && work.reviewsIsLoading) ? (
                    <Spinner style={{width: 50, height: 50}} />
                  ) : work.reviewsHasLoaded &&
                  book.reviews.data.length > 0 &&
                  reviewHasContent ? (
                    book.reviews.data.map((r, i) => {
                      // Select only obj in reviews
                      if (
                        r.identifierURI &&
                        r.identifierURI[0].includes('litteratursiden.dk')
                      ) {
                        // Dont show reviews without a creator and ref
                        if (r.creatorOth !== '' && r.isPartOf !== '') {
                          return (
                            <a
                              className="tag tags tag-medium review"
                              key={r.pid}
                              target={'blank'}
                              href={r.identifierURI ? r.identifierURI : ''}
                            >
                              <div className="review-creator">
                                {r.creatorOth}
                              </div>
                              <div className="review-partOf">{r.isPartOf}</div>
                            </a>
                          );
                        }
                      }
                    })
                  ) : (
                    <p>Der er endnu ingen anmeldelser til dette værk.</p>
                  )}
                </div>
              </div>

              <SocialShareButton
                className={'ssb-fb'}
                styles={{fontWeight: 'bold'}}
                facebook={true}
                href={'https://content-first.demo.dbc.dk/værk/' + book.pid}
                icon={'fb-icon'}
                hex={'#3b5998'}
                size={30}
                shape="square"
                txt="Del"
                hoverTitle="Del på facebook"
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
                          origin={`Minder om "${book.title}"`}
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
      includeReviews: true,
      includeCollection: true
    }),
  fetchRecommendations: tags =>
    dispatch({
      type: RECOMMEND_REQUEST,
      tags,
      max: 21
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkPage);
