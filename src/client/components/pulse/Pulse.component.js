import React from 'react';
import Draggable from 'react-draggable';
import TruncateMarkup from 'react-truncate-markup';

export default class Pulse extends React.Component {
  randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min) + '00';
  }

  render() {
    let label = this.props.label || false;

    if (label && label.length > 15) {
      label = this.props.label.substring(0, 15) + '...';
    }

    return (
      <Draggable
        pid={this.props.pid}
        bounds={this.props.dragContainer || false}
        disabled={!this.props.draggable}
        position={this.props.position}
        handle=".pulse-toucharea"
        onStart={this.props.onStart}
        onStop={this.props.onStop}
      >
        <div
          className={`pulse-toucharea pulse-expand ${
            this.props.active === this.props.pid ? 'pulse-active' : ''
          }`}
          onClick={this.props.onClick}
        >
          {this.props.label && <span className="pulse-label">{label}</span>}
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
