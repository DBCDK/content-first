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

  fetchBooks() {
    this.props.dispatch({type: ON_BOOK_REQUEST_TEST});
  }

  fetchWork(pidd) {
    this.props.dispatch({type: ON_WORK_REQUEST, pid: pidd});
  }

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
