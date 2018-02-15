import React from 'react';

export default class RollOver extends React.Component {
  hideRollOver() {
    let e = document.getElementById('rollover');
    e.classList.remove('rollover-display');
    //e.setAttribute('style', 'left:' + -5 + '%; top:' + 38 + '%;');
  }

  render() {
    return (
      <div id="rollover" className="rollover">
        <div className="rollover-caret" />
        <img
          className="rollover-close"
          src="/static/media/Kryds.e69a54ef.svg"
          onClick={this.hideRollOver}
        />
        <div className="col-xs-4 rollover-img">
          <img id="rollover-img" src="img/bookcase/BS3.png" alt="bs" />
        </div>
        <div className="col-xs-8 text-left rollover-text">
          <div className="col-xs-12 rollover-title">
            <h1 id="rollover-title">Title</h1>
          </div>
          <div className="col-xs-12 rollover-description">
            <p id="rollover-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, Ut
              volutpat vitae elit ut, pulvinar Praesent vehicula porttitor magna
              vitae dictum, nunc imperdiet urna sed rutrum vestibulum
            </p>
          </div>
        </div>
      </div>
    );
  }
}
