import React from 'react';
import {connect} from 'react-redux';
import Pulse from '../pulse/Pulse.component';
import CarouselItem from './CarouselItem.component';

import Slider from './CarouselSlider.component';

import {BOOKS_REQUEST, getBooks} from '../../redux/books.reducer';

/*
  <BookcaseItem />
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

  componentDidMount() {
    let pids = this.props.celeb.books.map(p => p.pid);

    if (this.props.booksRequest) {
      this.props.booksRequest(pids);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.books.length !== nextProps.books.length ||
      this.state !== nextState
    );
  }

  hideCarousel() {
    this.setState({carousel: false, pulse: ''});
  }

  nextBook = pos => {
    if (this.state.carousel) {
      this.setState({
        pid: this.props.celeb.books[pos].pid,
        slideIndex: pos,
        pulse: this.props.celeb.books[pos].pid
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
          src={this.props.celeb.bookcase}
          alt={this.props.name + ' bogreol'}
        />
        <div className="row">
          <div className="col-xs-4 celeb">
            <img
              className="carousel-close"
              src="/static/media/Kryds.e69a54ef.svg"
              alt="luk"
              onClick={() => {
                this.hideCarousel();
              }}
            />
            <div className="col-xs-12 celeb-top">
              <div className="col-xs-12 celeb-img">
                <img src={this.props.celeb.img} alt={this.props.celeb.name} />
              </div>
              <div className="col-xs-12 celeb-title">
                <h1>{this.props.celeb.name}</h1>
              </div>
              <div className="col-xs-12 celeb-description">
                <p>{this.props.celeb.description}</p>
                <button
                  type="button"
                  className="celeb-books-btn btn btn-info"
                  onClick={() => {
                    this.carouselTrigger(this.props.books[0].book.pid, 0);
                  }}
                >
                  Se bøger
                </button>
              </div>
            </div>
            <div className="col-xs-12 celeb-bottom">
              <Slider
                slideIndex={this.state.slideIndex}
                onNextBook={this.nextBook}
              >
                {this.props.books.map(b => {
                  return (
                    <CarouselItem
                      active={this.state.carousel}
                      key={'carousel-' + b.book.pid}
                      description={b.book.description}
                      book={b.book}
                    />
                  );
                })}
              </Slider>
            </div>
          </div>

          <div className="col-xs-8 bookswrap">
            {this.props.celeb.books.map((p, i) => (
              <Pulse
                active={this.state.pulse}
                pid={p.pid}
                key={'pulse-' + p.pid}
                onClick={() => {
                  this.carouselTrigger(p.pid, i);
                }}
                position={p.position}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    // bookcase: state.bookcaseReducer.celebs,
    books: getBooks(
      state.booksReducer,
      ownProps.celeb.books.map(b => b.pid)
    ).filter(entry => entry.book)
  };
};

const mapDispatchToProps = dispatch => ({
  booksRequest: pids => dispatch({type: BOOKS_REQUEST, pids: pids})
});

export default connect(mapStateToProps, mapDispatchToProps)(BookcaseItem);
