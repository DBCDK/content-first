import React from 'react';
import {connect} from 'react-redux';
import BookCover from '../general/BookCover.component';
import TaxDescription from './TaxDescription.component';
import Heading from '../base/Heading';
import Button from '../base/Button';
import Paragraph from '../base/Paragraph';
import Icon from '../base/Icon';
import SkeletonText from '../base/Skeleton/Text';
import SkeletonUser from '../base/Skeleton/User';
import Link from '../general/Link.component';
import SocialShareButton from '../general/SocialShareButton.component';
import BookmarkButton from '../general/BookmarkButton';
import AddToListButton from '../general/AddToListButton.component';
import OrderButton from '../order/OrderButton.component';
import {BOOKS_REQUEST} from '../../redux/books.reducer';

import {filterCollection, filterReviews} from './workFunctions';

import './WorkPreview.css';

class WorkPreview extends React.Component {
  componentDidMount() {
    this.fetchWork(this.props.pid);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.pid !== nextProps.pid) {
      this.fetchWork(nextProps.pid);
    }
  }

  fetchWork(pid) {
    this.props.fetchWork(pid);
  }

  render() {
    const {work} = this.props;
    const {book} = work;

    const tax_description =
      this.props.work.book.taxonomy_description ||
      this.props.work.book.description;

    // get collections including ereolen
    const collection = filterCollection(work);
    // get reviews from litteratursiden
    const reviews = filterReviews(work);

    return (
      <div className="row WorkPreview__container">
        <div className="col-md-12 col-lg-7 workPreview__work">
          <div className="workPreview__image">
            <Link href={'/værk/' + book.pid}>
              <BookCover book={book} />
            </Link>
          </div>
          <div className="workPreview__info">
            <SocialShareButton
              className={'ssb-fb'}
              styles={{fontWeight: 'bold'}}
              facebook={true}
              href={'https://content-first.demo.dbc.dk/værk/' + book.pid}
              hex={'#3b5998'}
              size={30}
              shape="round"
              hoverTitle="Del på facebook"
            />

            <Heading Tag="h1" type="lead" className="mt0">
              <Link href={'/værk/' + book.pid}>{book.title}</Link>
            </Heading>

            <Heading Tag="h2" type="heading" className="mt1">
              {book.creator}
            </Heading>

            <Paragraph className="mt1">
              <strong>{<TaxDescription text={tax_description} />}</strong>
            </Paragraph>

            <Paragraph className="mt1">{book.description}</Paragraph>

            <div className="workPreview__details">
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

            <div className="workPreview__media">
              {work.collectionHasLoaded && (
                <OrderButton
                  book={book}
                  size="medium"
                  type="quaternary"
                  label="Bog"
                  icon="local_library"
                  className="mr1 mt1"
                />
              )}
              {work.collectionHasLoaded &&
                collection.map(col => {
                  if (col.count === 1) {
                    return (
                      <a href={col.url} target="_blank" key={col.url}>
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
                      className="workPreview__media__skeleton Skeleton__Pulse mr1 mt1"
                    >
                      <Icon name={'local_library'} />
                      Bog
                    </Button>
                  </a>
                  <a>
                    <Button
                      type="tertiary"
                      size="medium"
                      className="workPreview__media__skeleton Skeleton__Pulse mr1 mt1"
                    >
                      <Icon name={'alternate_email'} />
                      Ebog
                    </Button>
                  </a>
                  <a>
                    <Button
                      type="tertiary"
                      size="medium"
                      className="workPreview__media__skeleton Skeleton__Pulse mr1 mt1"
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
                  onClick={event => {
                    event.stopPropagation();
                    event.preventDefault();
                    this.props.onMoreLikeThisClick(this.props.work);
                    this.props.scrollToChildBelt();
                  }}
                >
                  Mere som denne
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-0 col-lg-5 workPreview__reviews pt1 pb1">
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
                  className="workPreview__review mb1"
                >
                  <Icon name="face" />
                  <span className="workPreview__review__details ml2">
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
              <a className="workPreview__review mb1">
                <SkeletonUser pulse={true} className="mr1" />
                <SkeletonText
                  lines={2}
                  color="#e9eaeb"
                  className="Skeleton__Pulse"
                />
              </a>
              <a className="workPreview__review mb1">
                <SkeletonUser pulse={true} className="mr1" />
                <SkeletonText
                  lines={2}
                  color="#e9eaeb"
                  className="Skeleton__Pulse"
                />
              </a>
              <a className="workPreview__review">
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
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    work: state.booksReducer.books[ownProps.pid]
  };
};
export const mapDispatchToProps = dispatch => ({
  fetchWork: pid =>
    dispatch({
      type: BOOKS_REQUEST,
      pids: [pid],
      includeReviews: true,
      includeCollection: true
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkPreview);
