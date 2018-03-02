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
        className={`rollover-container ${
          this.props.active ? ' rollover-display' : ''
        }`}
      >
        <div className="rollover">
          <div className="col-xs-4 rollover-img">
            <BookCover book={book} />
          </div>

          <div className="col-xs-8 text-left rollover-text">
            <div className="col-xs-12 rollover-title">
              <h1>{book.title}</h1>
            </div>
            <div className="col-xs-12 rollover-creator">
              <h2>{book.creator}</h2>
            </div>
            <div className="col-xs-12 rollover-description">
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
