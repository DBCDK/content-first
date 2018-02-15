import React from 'react';
import {connect} from 'react-redux';
import Pulse from '../pulse/pulse.component';
import RollOver from '../rollover/rollOver.component';

export default class Bookcase extends React.Component {
  render() {
    // Temp. book pulse obj
    const aPulse = [
      {
        pid: '870970-basis:52530423',
        position: {x: 13.5, y: 40},
        description: 'lorem ipsum 1 . . .'
      },
      {
        pid: '870970-basis:53079202',
        position: {x: 21.8, y: 44},
        description: 'lorem ipsum 2 . . .'
      },
      {
        pid: '870970-basis:52038014',
        position: {x: 26, y: 46},
        description: 'lorem ipsum 3 . . .'
      },
      {
        pid: '870970-basis:23211629',
        position: {x: 36.5, y: 46},
        description: 'lorem ipsum 4 . . .'
      }
    ];

    return (
      <section id="bookcase" className="row">
        <img src="img/bookcase/BS-bogreol.png" />
        <div className="row">
          <div className="col-xs-4 celeb">
            <div className="col-xs-12 celeb-img">
              <img src="img/bookcase/BS3.png" alt="bs" />
            </div>
            <div className="col-xs-12 celeb-description">
              <h1>Bjarne Slot (BS) Christiansen</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, Ut
                volutpat vitae elit ut, pulvinar Praesent vehicula porttitor
                magna vitae dictum, nunc imperdiet urna sed rutrum vestibulum
              </p>
            </div>
          </div>
          <div className="col-xs-8 bookswrap">
            {aPulse.map(p => (
              <Pulse
                position={p.position}
                pid={p.pid}
                description={p.description}
              />
            ))}
            <RollOver />
          </div>
        </div>
      </section>
    );
  }
}
