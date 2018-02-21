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
            onClick={() => {
              this.props.onCloseClick();
            }}
          />
          <div className="col-xs-4 rollover-img">
            <BookCover book={this.props.book} />
          </div>

          <div className="col-xs-8 text-left rollover-text">
            <div className="col-xs-12 rollover-title">
              <h1>{this.props.book.title}</h1>
            </div>
            <div className="col-xs-12 rollover-creator">
              <h2>{this.props.book.creator}</h2>
            </div>
            <div className="col-xs-12 rollover-description">
              <p>{this.props.description}</p>
            </div>
            <div className="col-xs-12">
              <CheckmarkConnected
                book={{book: {pid: this.props.book.pid}}}
                origin="Fra bogreol"
              />
            </div>
          </div>

          <div className="col-xs-12 rollover-bottom">
            <span
              class="glyphicon glyphicon-chevron-left"
              aria-hidden="true"
              onClick={() => {
                this.props.onDirectionClick('prev');
              }}
            />
            <span
              class="glyphicon glyphicon-chevron-right"
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
