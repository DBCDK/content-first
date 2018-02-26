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
      book = this.props.book[0].book;
    }

    return (
      <div
        className={`rollover-container ${
          this.props.active ? ' rollover-display' : ''
        }`}
      >
        <div className="rollover">
          <img
            className="rollover-close"
            src="/static/media/Kryds.e69a54ef.svg"
            alt="luk"
            onClick={() => {
              this.props.onCloseClick();
            }}
          />
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

          <div className="col-xs-12 rollover-bottom">
            <span
              className="glyphicon glyphicon-chevron-left"
              aria-hidden="true"
              onClick={() => {
                this.props.onDirectionClick('prev');
              }}
            />
            <span
              className="glyphicon glyphicon-chevron-right"
              aria-hidden="true"
              onClick={() => {
                this.props.onDirectionClick('next');
              }}
            />
          </div>
          <div className="clear" />
        </div>
      </div>
    );
  }
}
