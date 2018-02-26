import React from 'react';
import {connect} from 'react-redux';
import Pulse from '../pulse/Pulse.component';
import Carousel from './Carousel.component';
import Slider from '../belt/Slider.component';

import {BOOKS_REQUEST, getBooks} from '../../redux/books.reducer';

/*
  <Bookcase />
*/

export class Bookcase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pid: '',
      position: {x: 0, y: 0},
      description: '',
      title: '',
      cover: '',
      curindex: 0,
      carousel: false
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
    this.setState({carousel: false, pid: ''});
  }

  nextBook = direction => {
    let max = this.props.bookcaseState.books.length - 1;
    const curpos = this.state.curindex;

    let newpos = direction === 'next' ? curpos + 1 : curpos - 1;

    if (newpos > max) {
      newpos = 0;
    }
    if (newpos < 0) {
      newpos = max;
    }

    this.fetchBooks(this.props.bookcaseState.books[newpos].pid);
    this.carouselTrigger(
      this.props.bookcaseState.books[newpos].pid,
      this.props.bookcaseState.books[newpos].description,
      this.props.bookcaseState.books[newpos].position
    );
    this.setState({
      curindex: newpos
    });
  };

  carouselTrigger = (pid, desc, pos, i) => {
    this.fetchBooks(pid);

    this.setState({
      pid: pid,
      position: pos,
      description: desc,
      curindex: i
    });
  };

  render() {
    let aBooks = [];
    if (this.state.pid && this.props.booksState.isLoading === false) {
      aBooks = getBooks(this.props.booksState, [this.state.pid]);
    }

    const books = this.props.bookcaseState.books;

    return (
      <section
        className={`row ${this.state.carousel ? ' section-active' : ''}`}
        onClick={this.test}
      >
        <img src="img/bookcase/BS-bogreol.png" alt="bogreol" />
        <div className="row">
          <div className="col-xs-4 celeb">
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
            <Carousel
              active={this.state.carousel}
              loading={
                this.state.pid !== '' &&
                typeof this.props.booksState[this.state.pid] === 'undefined'
              }
              description={this.state.description}
              book={aBooks}
              onDirectionClick={direction => {
                this.nextBook(direction);
              }}
              onCloseClick={() => {
                this.hideCarousel();
              }}
            />
          </div>

          <div className="col-xs-8 bookswrap">
            {books.map((p, i) => (
              <Pulse
                active={this.state.pid}
                pid={p.pid}
                key={'pulse-' + p.pid}
                onClick={() => {
                  this.carouselTrigger(p.pid, p.description, p.position, i);
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
