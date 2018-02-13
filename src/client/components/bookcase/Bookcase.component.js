import React from 'react';
import {connect} from 'react-redux';

export default class Bookcase extends React.Component {
  render() {
    return (
      <section className="row">
        <img src="img/bookcase/BS-bogreol.png" />
        <div className="row">
          <div className="col-xs-4 celeb">
            <div className="col-xs-12 celeb-img">
              <img src="img/bookcase/BS2.png" />
            </div>
            <div className="col-xs-12 celeb-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, Ut
              volutpat vitae elit ut, pulvinar Praesent vehicula porttitor magna
              vitae dictum, nunc imperdiet urna sed rutrum vestibulum
            </div>
          </div>
          <div className="col-xs-8">Books</div>
        </div>
      </section>
    );
  }
}
