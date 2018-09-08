import React from 'react';
//import CheckmarkConnected from '../general/CheckmarkConnected.component';
import BookCover from '../general/BookCover.component';
import TruncateMarkup from 'react-truncate-markup';
import Link from '../general/Link.component';
import {ADD_BELT} from "../../redux/belts.reducer";
import {connect} from "react-redux";
import {BOOKS_REQUEST} from "../../redux/books.reducer";
import {get} from "lodash";

import OrderButton from '../order/OrderButton.component';
import {filterCollection, filterReviews, sortTags} from "../work/workFunctions";
import Button from '../base/Button';
import Icon from '../base/Icon';


/*
  <Carousel
    description={'lorem ipsum...'}
    active={this.state.carousel}
    key={'carousel-' + b.book.pid}
    book={book}
  />
*/

export default class CarouselWork extends React.Component {
/*
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
  }*/


  render() {
    console.log("pid ", this.props.book.pid);
    const book = this.props.book;
    const url = `/værk/${book.pid}`;
/*

    const work = get(this.props, 'work');


// get collections including ereolen
    const collection = filterCollection(work);
    // get reviews from litteratursiden
    const reviews = filterReviews(work);
    // sort tags by group
    const tags = sortTags(work);
    // build belt for "mere som denne" button

*/

    return (
      <div
        className={`carousel-container ${
          this.props.active ? ' carousel-display' : ''
          }`}
      >
        <div className={"carousel-header"}>
          <div className="col-12 carousel-description">
            <TruncateMarkup lines={100}>
              <p>{this.props.description}</p>
            </TruncateMarkup>
          </div>

        </div>
        <div className="carousel">
          <div className="carousel-img">
            <Link href={url}>
              <BookCover book={book}/>
            </Link>
          </div>

          <div className="text-left carousel-info-area">

           {/* <WorkPage pid={book.pid}/>*/}
{/*
            <div className="carousel-title">
              {book.titel}
            </div>
            <div className="carousel-creator">
              <Link href={url}>
                {book.creator}
              </Link>
            </div>*/}

{/*

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
                        <Icon name={col.icon}/>
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
                      <Icon name={'book'}/>
                      Bog
                    </Button>
                  </a>
                  <a>
                    <Button
                      type="tertiary"
                      size="medium"
                      className="WorkPage__media__skeleton Skeleton__Pulse mr1 mt1"
                    >
                      <Icon name={'alternate_email'}/>
                      Ebog
                    </Button>
                  </a>
                  <a>
                    <Button
                      type="tertiary"
                      size="medium"
                      className="WorkPage__media__skeleton Skeleton__Pulse mr1 mt1"
                    >
                      <Icon name={'voicemail'}/>
                      Lydbog
                    </Button>
                  </a>
                </React.Fragment>
              )}
            </div>
*/}


            {/* <div className="col-12">
              <CheckmarkConnected book={{book}} origin="Fra bogreol" />
            </div>*/}
          </div>
          <div className="clear"/>
        </div>
      </div>
    );
  }
}
/*

const mapStateToProps = (state, ownProps) => {
  console.log("state", state.booksReducer.books[ownProps.book.pid])
  return {
    work: state.booksReducer.books[ownProps.book.pid]
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
)(CarouselWork);*/
