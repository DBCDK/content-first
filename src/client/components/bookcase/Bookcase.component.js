import React from 'react';
import {connect} from 'react-redux';
import Pulse from '../pulse/pulse.component';
import RollOver from '../rollover/rollOver.component';

import {ON_BOOK_REQUEST_TEST} from '../../redux/bookcase.reducer';
import {ON_WORK_REQUEST} from '../../redux/work.reducer';

export class Bookcase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pid: '',
      position: {x: 0, y: 0},
      description: '',
      title: '',
      cover: ''
    };
  }

  fetchWork(pid) {
    this.props.dispatch({type: ON_WORK_REQUEST, pid: pid});
  }

  nextBook = direction => {
    let max = this.props.bookcaseState.books.length - 1;
    let newpos = 0;

    this.props.bookcaseState.books.map(
      function(b, i) {
        // Obj Match
        if (b.pid == this.props.workState.pid) {
          // Next in line command
          if (direction == 'next') {
            if (i < max) {
              // Moving 1 obj forward
              newpos = i + 1;
            } else if (i == max) {
              // Moving to first obj
              newpos = 0;
            }
            // Previous in line command
          } else if (direction == 'prev') {
            if (i > 0) {
              // Moving 1 obj back
              newpos = i - 1;
            } else if (i == 0) {
              // Moving to last obj
              newpos = max;
            }
          }
          this.fetchWork(this.props.bookcaseState.books[newpos].pid);
          this.rollOverTrigger(
            this.props.bookcaseState.books[newpos].pid,
            this.props.bookcaseState.books[newpos].description,
            this.props.bookcaseState.books[newpos].position
          );
        }
      }.bind(this)
    );
  };

  rollOverTrigger = (pid, desc, pos) => {
    this.fetchWork(pid);
    const work = this.props.workState.work;

    this.setState({
      pid: pid,
      position: pos,
      description: desc
    });
  };

  render() {
    let book = '';
    if (this.state.pid && this.props.workState.isLoading === false) {
      book = this.props.workState.work.data;
    }
    const books = this.props.bookcaseState.books;

    return (
      <section id="bookcase" className="row">
        <img src="img/bookcase/BS-bogreol.png" />
        <div className="row">
          <div className="col-xs-4 celeb">
            <div className="col-xs-12 celeb-img">
              <img src="img/bookcase/BS3.png" alt="bs" />
            </div>
            <div className="col-xs-12 celeb-description">
              <h1>B.S. Christiansen</h1>
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
          <div className="col-xs-8 bookswrap">
            {books.map(p => (
              <Pulse
                onClick={() => {
                  this.rollOverTrigger(p.pid, p.description, p.position);
                }}
                position={p.position}
              />
            ))}
            <RollOver
              loading={
                this.state.pid === '' &&
                this.props.workState[this.state.pid] === undefined
              }
              position={this.state.position}
              description={this.state.description}
              onClick={direction => {
                this.nextBook(direction);
              }}
              book={book}
            />
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
