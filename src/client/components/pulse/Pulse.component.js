import React from 'react';
import Draggable from 'react-draggable';

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
    let styles = {};

    if (!this.props.draggable && this.props.position) {
      styles.left = this.props.position.x + '%';
      styles.top = this.props.position.y + '%';
      styles.position = 'absolute';
    }

    return (
      <Draggable
        pid={this.props.pid}
        bounds={this.props.dragContainer || false}
        disabled={!this.props.draggable}
        position={this.props.draggable ? this.props.position : null}
        handle=".pulse-toucharea"
        onStart={this.props.onStart}
        onStop={this.props.onStop}
      >
        <div
          className={`pulse-toucharea pulse-expand ${
            this.props.active === this.props.pid ? 'pulse-active' : ''
          }`}
          style={styles}
          onClick={this.props.onClick}
        >
          {this.props.label ? (
            <span className="pulse-label">{this.props.label}</span>
          ) : (
            ''
          )}
          <div
            className="pulse delay"
            style={{
              animationDelay:
                (this.props.delay || this.randomDelay(10, 50)) + 'ms'
            }}
          />
        </div>
      </Draggable>
    );
  }
}
