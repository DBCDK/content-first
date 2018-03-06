import React from 'react';

/*
  <Pulse
    onClick={() => {
      this.carouselTrigger('pid', 'description...', {x:-,y:-}, index);
    }}
    position={{x:-,y:-}}
  />
*/

export default class Pulse extends React.Component {
  randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min) + '00';
  }

  render() {
    let styles = {
      left: this.props.position.x + '%',
      top: this.props.position.y + '%'
    };

    return (
      <div
        className={`pulse-toucharea ${
          this.props.active === this.props.pid ? ' pulse-active' : ''
        }`}
        style={styles}
        onClick={this.props.onClick}
      >
        <div
          className="pulse delay"
          style={{
            animationDelay:
              (this.props.delay || this.randomDelay(10, 50)) + 'ms'
          }}
        />
      </div>
    );
  }
}
