import React from 'react';
import {connect} from 'react-redux';
import Pulse from '../pulse/Pulse.component';
import CarouselItem from './CarouselItem.component';

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
    let pids = this.props.bookcase.map(p => p.pid);

    if (this.props.booksRequest) {
      this.props.booksRequest(pids);
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
        pid: this.props.bookcase[pos].pid,
        slideIndex: pos,
        pulse: this.props.bookcase[pos].pid
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
            {this.props.bookcase.map((p, i) => (
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

const mapStateToProps = state => {
  return {
    bookcase: state.bookcaseReducer.books,
    books: getBooks(
      state.booksReducer,
      state.bookcaseReducer.books.map(b => b.pid)
    )
  };
};

const mapDispatchToProps = dispatch => ({
  booksRequest: pids => dispatch({type: BOOKS_REQUEST, pids: pids})
});

export default connect(mapStateToProps, mapDispatchToProps)(Bookcase);
