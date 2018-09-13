import React from 'react';
import {connect} from 'react-redux';
import Heading from '../base/Heading';
import Button from '../base/Button';
import Paragraph from '../base/Paragraph';
import Icon from '../base/Icon';
import BookmarkButton from '../general/BookmarkButton';
import AddToListButton from '../general/AddToListButton.component';
import SkeletonText from '../base/Skeleton/Text';
import SkeletonUser from '../base/Skeleton/User';
import BooksBelt from '../belt/BooksBelt.component';
import BookCover from '../general/BookCover.component';
import OrderButton from '../order/OrderButton.component';
import Link from '../general/Link.component';
import scroll from '../../utils/scroll';
import SocialShareButton from '../general/SocialShareButton.component';
import {BOOKS_REQUEST} from '../../redux/books.reducer';
import {ADD_BELT} from '../../redux/belts.reducer';
import {get} from 'lodash';
import {
  filterCollection,
  filterReviews,
  sortTags,
  buildSimilarBooksBelt
} from './workFunctions';

import './WorkPage.css';

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

  componentDidUpdate(nextProps) {
    if (this.props.pid !== nextProps.pid) {
      this.fetchWork(this.props.pid);
    }
  }

  addNewBelt(belt) {
    this.props.addBelt(belt);
  }

  render() {
    const work = get(this.props, 'work');
    const book = get(this.props, 'work.book');

    if (!book) {
      return null;
    }

    // get collections including ereolen
    const collection = filterCollection(work);
    // get reviews from litteratursiden
    const reviews = filterReviews(work);
    // sort tags by group
    const tags = sortTags(work);
    // build belt for "mere som denne" button
    const belts = this.props.beltsState;
    const belt = belts['Minder om ' + book.title];

    if (book.title && !belts['Minder om ' + book.title]) {
      this.addNewBelt(buildSimilarBooksBelt(work));
    }

    // tags collapsable variables
    const tagsDomNode = document.getElementById('collapsable-tags');
    const height = tagsDomNode ? tagsDomNode.scrollHeight : 0;

    return (
      <div className="container">
        <div className="row WorkPage__container">
          <div className="col-md-12 col-lg-8 WorkPage__work">
            <div className="WorkPage__image">
              <BookCover book={book} />
              <BookmarkButton
                className="mr1"
                origin={'Fra egen værkside'}
                work={work}
                layout="circle"
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: 0,
                  borderRadius: '50%'
                }}
              />
            </div>
            <div className="WorkPage__info">
              <SocialShareButton
                className={'ssb-fb'}
                facebook={true}
                href={'https://content-first.demo.dbc.dk/værk/' + book.pid}
                hex={'#3b5998'}
                size={40}
                shape="round"
                hoverTitle="Del på facebook"
              />

              <Heading Tag="h1" type="lead" className="mt0">
                {book.title}
              </Heading>

              <Heading Tag="h2" type="heading" className="mt1">
                {book.creator}
              </Heading>

              <Paragraph className="mt1">
                <strong>{book.taxonomy_description || book.description}</strong>
              </Paragraph>

              <Paragraph className="mt1">{book.description}</Paragraph>

              <div className="WorkPage__details .WorkPage__detailsDesktop">
                <span>Sideantal: {book.pages}</span>
                <span>Sprog: {book.language}</span>
                <span>Udgivet: {book.first_edition_year}</span>
              </div>

              <div className="row">
                <div className="col-12 pt1">
                  <Heading
                    Tag="h4"
                    type="subtitle"
                    className="mt1 mb0 kobber-txt"
                  >
                    Lån som:
                  </Heading>
                </div>
              </div>

              <div className="WorkPage__media">
                {work.collectionHasLoaded && (
                  <OrderButton
                    book={book}
                    size="medium"
                    type="quaternary"
                    label="Bog"
                    icon="book"
                    className="mr1 mt1"
                  />
                )}
                {work.collectionHasLoaded &&
                  collection.map(col => {
                    if (col.count === 1) {
                      return (
                        <a key={col.url} href={col.url} target="_blank">
                          <Button
                            type="quaternary"
                            size="medium"
                            className="mr1 mt1"
                          >
                            <Icon name={col.icon} />
                            {col.type}
                          </Button>
                        </a>
                      );
                    }
                  })}
                {!work.collectionHasLoaded && (
                  <React.Fragment>
                    <a>
                      <Button
                        type="tertiary"
                        size="medium"
                        className="WorkPage__media__skeleton Skeleton__Pulse mr1 mt1"
                      >
                        <Icon name={'book'} />
                        Bog
                      </Button>
                    </a>
                    <a>
                      <Button
                        type="tertiary"
                        size="medium"
                        className="WorkPage__media__skeleton Skeleton__Pulse mr1 mt1"
                      >
                        <Icon name={'alternate_email'} />
                        Ebog
                      </Button>
                    </a>
                    <a>
                      <Button
                        type="tertiary"
                        size="medium"
                        className="WorkPage__media__skeleton Skeleton__Pulse mr1 mt1"
                      >
                        <Icon name={'voicemail'} />
                        Lydbog
                      </Button>
                    </a>
                  </React.Fragment>
                )}
              </div>
              <div className="row">
                <div className="col-12 pt1">
                  <BookmarkButton
                    className="mr1"
                    origin={'Fra egen værkside'}
                    work={work}
                  />
                  <AddToListButton className="mr1" work={work} />
                </div>
              </div>
              <div className="row">
                <div className="col-12 pt2">
                  <Button
                    type="tertiary"
                    size="medium"
                    className="underline"
                    onClick={() => {
                      const pos = this.booksBeltPosition
                        ? this.booksBeltPosition.offsetTop - 50
                        : 0;
                      scroll(pos);
                    }}
                  >
                    Mere som denne
                  </Button>
                </div>
              </div>

              <div className="row WorkPage__tagHeading__Mobile">
                <div className="col-md-12">
                  <Heading Tag="h3" type="title" className="mt3 mb0">
                    Tags:
                  </Heading>
                </div>
              </div>

              <div
                id="collapsable-tags"
                style={{
                  transition: this.state.transition ? null : 'none',
                  height: this.state.tagsCollapsed ? '65px' : height + 'px',
                  overflowY: 'hidden'
                }}
                className="row col-12 mt1 WorkPage__tagContainer text-left"
              >
                {tags.map(group => {
                  return (
                    <React.Fragment>
                      <Heading
                        Tag="h4"
                        key={group.title}
                        type="subtitle"
                        className="WorkPage__tagHeading mb0 mt0"
                      >
                        {group.title + ':'}
                      </Heading>
                      {group.data.map(t => {
                        return (
                          <Link key={t.id} href="/find" params={{tag: t.id}}>
                            <Button
                              key={t.title}
                              type="tertiary"
                              size="small"
                              className="WorkPage__tag mr1"
                            >
                              {t.title}
                            </Button>
                          </Link>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
              <div className="row">
                <div className="mt1 col-12">
                  <Button
                    size="medium"
                    type="tertiary"
                    className="underline"
                    onClick={() => {
                      this.setState({
                        tagsCollapsed: !this.state.tagsCollapsed,
                        transition: true
                      });
                    }}
                  >
                    {this.state.tagsCollapsed
                      ? 'Se alle tags'
                      : 'Se færre tags'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 WorkPage__reviews pt1 pb1">
            <div className="row">
              <div className="col-md-12">
                <Heading Tag="h3" type="title" className="mt0 mb2">
                  Anmeldelser:
                </Heading>
              </div>
            </div>

            {work.reviewsHasLoaded &&
              reviews.map(rev => {
                return (
                  <a
                    href={rev.url}
                    target="_blank"
                    className="WorkPage__review mb1"
                  >
                    <Icon name="face" />
                    <span className="WorkPage__review__details ml2">
                      <Heading Tag="h5" type="subtitle">
                        <strong>{rev.creator}</strong>
                        <br />
                        {rev.date}
                      </Heading>
                    </span>
                  </a>
                );
              })}
            {!work.reviewsHasLoaded && (
              <React.Fragment>
                <a className="WorkPage__review mb1">
                  <SkeletonUser pulse={true} className="mr1" />
                  <SkeletonText
                    lines={2}
                    color="#e9eaeb"
                    className="Skeleton__Pulse"
                  />
                </a>
                <a className="WorkPage__review mb1">
                  <SkeletonUser pulse={true} className="mr1" />
                  <SkeletonText
                    lines={2}
                    color="#e9eaeb"
                    className="Skeleton__Pulse"
                  />
                </a>
                <a className="WorkPage__review">
                  <SkeletonUser pulse={true} className="mr1" />
                  <SkeletonText
                    lines={2}
                    color="#e9eaeb"
                    className="Skeleton__Pulse"
                  />
                </a>
              </React.Fragment>
            )}
          </div>

          {work.detailsHasLoaded &&
            work.tagsHasLoaded && (
              <div
                className="WorkPage__beltContainer col-12 mt4"
                ref={e => (this.booksBeltPosition = e)}
              >
                <BooksBelt belt={belt} />
              </div>
            )}

          <div className="row col-12 mb2 WorkPage__detailsMobile">
            <div className="col-12">
              <Heading Tag="h4" type="subtitle" className="mt1">
                Mere info:
              </Heading>
            </div>
            <div className="col-12">
              <div className="WorkPage__details">
                <span>Sideantal: {book.pages}</span>
                <span>Sprog: {book.language}</span>
                <span>Udgivet: {book.first_edition_year}</span>
              </div>
            </div>
            <div className="col-12">
              <div className="WorkPage__formats mt1">
                <span>Formater: </span>
                <div className="row col-12">
                  {work.collectionHasLoaded &&
                    collection.map(col => {
                      if (col.count === 1) {
                        return (
                          <span>
                            <Icon name={col.icon} />
                            {' ' + col.type}
                          </span>
                        );
                      }
                    })}
                  {!work.collectionHasLoaded && (
                    <React.Fragment>
                      <span className="WorkPage__formats__skeleton Skeleton__Pulse">
                        <Icon name={'book'} /> Bog
                      </span>
                      <span className="WorkPage__formats__skeleton Skeleton__Pulse">
                        <Icon name={'alternate_email'} /> EBog
                      </span>
                      <span className="WorkPage__formats__skeleton Skeleton__Pulse">
                        <Icon name={'voicemail'} /> Lydbog
                      </span>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    work: state.booksReducer.books[ownProps.pid],
    beltsState: state.beltsReducer.belts
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
  addBelt: belt => {
    dispatch({
      type: ADD_BELT,
      belt
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkPage);
