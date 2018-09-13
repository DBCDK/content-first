import React from 'react';
import {connect} from 'react-redux';
import Button from '../base/Button/index';
import Icon from '../base/Icon/index';
import BookmarkButton from '../general/BookmarkButton';
import AddToListButton from '../general/AddToListButton.component';
import BookCover from '../general/BookCover.component';
import OrderButton from '../order/OrderButton.component';
import {BOOKS_REQUEST} from '../../redux/books.reducer';
import {get} from 'lodash';
import {filterCollection} from './workFunctions';
import TruncateMarkup from 'react-truncate-markup';
import Link from '../general/Link.component';
import './WorkPage.css';

class ConciseWork extends React.Component {
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
  }

  render() {
    const work = get(this.props, 'work');
    const book = get(this.props, 'work.book');

    if (!book) {
      return null;
    }

    // get collections including ereolen
    const collection = filterCollection(work);

    return (
      <div className="concise-work-container">
        <TruncateMarkup lines={6}>
          <div className="carousel-header">{this.props.description}</div>
        </TruncateMarkup>
        <div className="row">
          <div className="col-sm-4 concise-work-img">
            <Link href={'/værk/' + book.pid}>
              <BookCover book={book} />
            </Link>
          </div>
          <div className="col-sm-8 concise-work-info">
            <div className="mt0 concise-work-title">
              <Link href={'/værk/' + book.pid}>{book.title}</Link>
            </div>

            <div className="concise-work-author">{book.creator}</div>

            <div className="concise-work-details">
              <span>{book.language} </span>
              <span> {book.first_edition_year} </span>
              <span> {book.pages + ' SIDER'}</span>
              {/*  <span> | </span>*/}
            </div>

            <div className="row">
              <div className="col-12">
                <div className="mt1 work-subtitle">Lån som:</div>
              </div>
            </div>

            <div className="WorkPage__media">
              {work.collectionHasLoaded && (
                <OrderButton
                  book={book}
                  size="medium"
                  type="quaternary"
                  label="BOG"
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
                          {String(col.type).toUpperCase()}
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
                      BOG
                    </Button>
                  </a>
                  <a>
                    <Button
                      type="tertiary"
                      size="medium"
                      className="WorkPage__media__skeleton Skeleton__Pulse mr1 mt1"
                    >
                      <Icon name={'alternate_email'} />
                      E-BOG
                    </Button>
                  </a>
                  <a>
                    <Button
                      type="tertiary"
                      size="medium"
                      className="WorkPage__media__skeleton Skeleton__Pulse mr1 mt1"
                    >
                      <Icon name={'voicemail'} />
                      LYDBOG
                    </Button>
                  </a>
                </React.Fragment>
              )}
            </div>
            <div className="row">
              <div className="col-12 pt1 ">
                <BookmarkButton
                  className="mr1"
                  origin={'Fra egen værkside'}
                  work={work}
                  texttransform={'uppercase'}
                />
                <AddToListButton className="mr1 dropup" work={work} />
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
    work: state.booksReducer.books[ownProps.pid]
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
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConciseWork);
