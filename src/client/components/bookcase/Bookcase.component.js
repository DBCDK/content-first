import React from 'react';
import {connect} from 'react-redux';
import Pulse from '../pulse/Pulse.component';
import Carousel from './Carousel.component';

import Slider from './CarouselSlider.component';

import {BOOKS_REQUEST, getBooks} from '../../redux/books.reducer';

/*
  <Bookcase />
*/

export class Bookcase extends React.Component {
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
    let pids = [];
    this.props.bookcaseState.books.map(p => {
      pids.push(p.pid);
    });

    if (this.props.dispatch) {
      this.props.dispatch({type: BOOKS_REQUEST, pids: pids});
    }
  }

  fetchBooks(pids) {
    getBooks(this.props.booksState, [pids]);
    this.setState({carousel: true});
  }

  hideCarousel() {
    this.setState({carousel: false, pulse: ''});
  }

  nextBook = pos => {
    if (this.state.carousel) {
      this.setState({
        pid: this.props.bookcaseState.books[pos].pid,
        slideIndex: pos,
        pulse: this.props.bookcaseState.books[pos].pid
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
    let aBooks = [];
    if (this.state.pid && this.props.booksState.isLoading === false) {
      aBooks = getBooks(this.props.booksState, this.props.booksState.pids);
    }

    const bookpos = this.props.bookcaseState.books;

    return (
      <section
        className={`row ${this.state.carousel ? ' section-active' : ''}`}
        onClick={this.test}
      >
        <img src="img/bookcase/BS-bogreol.png" alt="bogreol" />
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
                <img src="img/bookcase/BS3.png" alt="bs" />
              </div>
              <div className="col-xs-12 celeb-title">
                <h1>Bjarne Slot Christiansen</h1>
              </div>
              <div className="col-xs-12 celeb-description">
                <p>
                  er en dansk forhenværende elitesoldat i Jægerkorpset og
                  fordragsholder. Han er især kendt for programserien{' '}
                  <span className="highlight"> På afveje </span>
                  med forskellige kendte personer, og har også deltaget i flere
                  selvhjælpsserier. Skrev i 2005 bogen
                  <span className="highlight"> Et liv på kanten </span>
                </p>
              </div>
            </div>
            <div className="col-xs-12 celeb-bottom">
              <Slider
                slideIndex={this.state.slideIndex}
                onNextBook={this.nextBook}
              >
                {aBooks.map(b => {
                  return (
                    <Carousel
                      active={this.state.carousel}
                      key={'carousel-' + b.book.pid}
                      loading={
                        this.state.pid !== '' &&
                        typeof this.props.booksState[b.book.pid] === 'undefined'
                      }
                      description={b.book.description}
                      book={b.book}
                      onDirectionClick={direction => {
                        this.nextBook(direction);
                      }}
                      onCloseClick={() => {
                        this.hideCarousel();
                      }}
                    />
                  );
                })}
              </Slider>
            </div>
          </div>

          <div className="col-xs-8 bookswrap">
            {bookpos.map((p, i) => (
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

export default connect(
  // Map redux state to props
  state => {
    return {
      bookcaseState: state.bookcaseReducer,
      booksState: state.booksReducer
    };
  }
)(Bookcase);
