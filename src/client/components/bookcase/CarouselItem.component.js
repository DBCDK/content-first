import React from 'react';
import CheckmarkConnected from '../general/CheckmarkConnected.component';
import BookCover from '../general/BookCover.component';
import TruncateMarkup from 'react-truncate-markup';

/*
  <Carousel
    description={'lorem ipsum...'}
    active={this.state.carousel}
    key={'carousel-' + b.book.pid}
    book={book}
  />
*/

export default class CarouselItem extends React.Component {
  render() {
    const book = this.props.book;

    return (
      <div
        className={`carousel-container ${
          this.props.active ? ' carousel-display' : ''
        }`}
      >
        <div className="carousel">
          <div className="col-xs-4 carousel-img">
            <BookCover book={book} />
          </div>

          <div className="col-xs-8 text-left carousel-text">
            <div className="col-xs-12 carousel-title">
              <h1>{book.title}</h1>
            </div>
            <div className="col-xs-12 carousel-creator">
              <h2>{book.creator}</h2>
            </div>
            <div className="col-xs-12 carousel-description">
              <TruncateMarkup lines={6}>
                <p>{this.props.description}</p>
              </TruncateMarkup>
            </div>
            <div className="col-xs-12">
              <CheckmarkConnected
                book={{book: {pid: book.pid}}}
                origin="Fra bogreol"
              />
            </div>
          </div>
          <div className="clear" />
        </div>
      </div>
    );
  }
}
