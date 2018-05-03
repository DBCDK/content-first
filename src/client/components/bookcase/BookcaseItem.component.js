import React from 'react';
import {connect} from 'react-redux';
import Pulse from '../pulse/Pulse.component';
import CarouselItem from './CarouselItem.component';

import TruncateMarkup from 'react-truncate-markup';

import CarouselSlider from './CarouselSlider.component';

import {BOOKS_REQUEST, getBooks} from '../../redux/books.reducer';

/*
  <BookcaseItem list={obj} profile={obj}/>
*/

export class BookcaseItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pid: '',
      slideIndex: null,
      carousel: false,
      pulse: ''
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.list.list.length !== nextProps.list.list.length ||
      this.state !== nextState
    );
  }

  hideCarousel() {
    this.setState({carousel: false, pulse: ''});
  }

  nextBook = pos => {
    if (this.state.carousel) {
      this.setState({
        pid: this.props.list.list[pos].book.pid,
        slideIndex: pos,
        pulse: this.props.list.list[pos].book.pid
      });
    }
  };

  carouselTrigger = (pid, i) => {
    this.setState({
      pid: pid,
      slideIndex: i,
      carousel: true,
      pulse: pid
    });
  };

  render() {
    return (
      <section
        className={`${this.state.carousel ? ' section-active' : ''}`}
        onClick={this.test}
      >
        <img
          src={
            this.props.list.image
              ? '/v1/image/' + this.props.list.image + '/1200/600'
              : this.props.list.bookcase
          }
          alt={this.props.name + '´s bogreol'}
        />
        <div className="row">
          <div
            className={`col-xs-4 celeb ${
              this.props.list.descriptionImage ? '' : 'no-description-img'
            }`}
          >
            <img
              className="carousel-close"
              src="/static/media/Kryds.e69a54ef.svg"
              alt="luk"
              onClick={() => {
                this.hideCarousel();
              }}
            />
            <div className="col-xs-12 celeb-top">
              {this.props.list.descriptionImage ? (
                <div className="col-xs-12 celeb-img">
                  <img
                    src={'/v1/image/' + this.props.profile.image + '/150/150'}
                    alt={this.props.profile.name}
                  />
                </div>
              ) : (
                <div className="celeb-img-placeholder" />
              )}
              <div className="col-xs-12 celeb-title">
                <h1>{this.props.profile.name}</h1>
              </div>
              <div className="col-xs-12 celeb-description">
                <TruncateMarkup lines={8}>
                  <p>{this.props.list.description}</p>
                </TruncateMarkup>
                {this.props.list.list.length !== 0 ? (
                  <button
                    type="button"
                    className="celeb-books-btn btn"
                    onClick={() => {
                      this.carouselTrigger(this.props.list.list[0].book.pid, 0);
                    }}
                  >
                    Se bøger
                  </button>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="col-xs-12 celeb-bottom">
              <CarouselSlider
                slideIndex={this.state.slideIndex}
                onNextBook={this.nextBook}
              >
                {this.props.list.list.map((b, i) => {
                  return (
                    <CarouselItem
                      active={this.state.carousel}
                      key={'carousel-' + b.book.pid}
                      description={b.description || b.book.description}
                      book={b.book}
                    />
                  );
                })}
              </CarouselSlider>
            </div>
          </div>

          <div className="col-xs-8 bookswrap">
            {this.props.list.list.map((p, i) => {
              return (
                <Pulse
                  active={this.state.pulse}
                  pid={p.book.pid}
                  key={'pulse-' + p.book.pid}
                  onClick={() => {
                    this.carouselTrigger(p.book.pid, i);
                  }}
                  position={p.position}
                />
              );
            })}
          </div>
        </div>
      </section>
    );
  }
}

export default BookcaseItem;
