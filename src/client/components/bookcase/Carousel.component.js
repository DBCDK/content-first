import React from 'react';
import CheckmarkConnected from '../general/CheckmarkConnected.component';
import BookCover from '../general/BookCover.component';

/*
  <Carousel
    loading={true|false}
    description={'lorem ipsum...'}
    onClick={('next' | 'prev') => {
      this.nextBook(direction);
    }}
    book={book}
  />

*/

export default class Carousel extends React.Component {
  render() {
    let book = '';
    if (this.props.book.length !== 0) {
      book = this.props.book;
    }

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
              <p>{this.props.description}</p>
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
