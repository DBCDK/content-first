import React from 'react';
import {connect} from 'react-redux';
import Pulse from '../pulse/Pulse.component';
import Carousel from './Carousel.component';

import {ON_WORK_REQUEST} from '../../redux/work.reducer';

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

  hideCarousel() {
    this.setState({carousel: false});
  }

  fetchWork(pid) {
    this.props.dispatch({type: ON_WORK_REQUEST, pid: pid});
    this.setState({carousel: true});
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

    this.fetchWork(this.props.bookcaseState.books[newpos].pid);
    this.rollOverTrigger(
      this.props.bookcaseState.books[newpos].pid,
      this.props.bookcaseState.books[newpos].description,
      this.props.bookcaseState.books[newpos].position
    );
    this.setState({
      curindex: newpos
    });
  };

  rollOverTrigger = (pid, desc, pos, i) => {
    this.fetchWork(pid);
    // const work = this.props.workState.work;

    this.setState({
      pid: pid,
      position: pos,
      description: desc,
      curindex: i
    });
  };

  render() {
    let book = '';
    if (this.state.pid && this.props.workState.isLoading === false) {
      book = this.props.workState.work.data;
    }

    const books = this.props.bookcaseState.books;

    return (
      <section
        className={`row ${this.state.carousel ? ' section-active' : ''}`}
        onClick={this.test}
      >
        <img src="img/bookcase/BS-bogreol.png" />
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
                this.state.pid === '' &&
                typeof this.props.workState[this.state.pid] === 'undefined'
              }
              description={this.state.description}
              book={book}
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
                key={'pulse-' + p.pid}
                onClick={() => {
                  this.rollOverTrigger(p.pid, p.description, p.position, i);
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
      workState: state.workReducer
    };
  }
)(Bookcase);
