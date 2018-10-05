import React from 'react';
import Draggable from 'react-draggable';
import Text from '../base/Text';

export default class Pulse extends React.Component {
  randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min) + '00';
  }

  render() {
    let label = this.props.label || false;

    if (label && label.length > 15) {
      label = this.props.label.substring(0, 15) + '...';
    }

    const activeClass = this.props.active ? 'pulse-active' : '';
    const colorClass = this.props.color ? this.props.color : '';

    return (
      <Draggable
        bounds={this.props.dragContainer || false}
        disabled={!this.props.draggable}
        position={this.props.position}
        handle=".pulse-toucharea"
        onStart={this.props.onStart}
        onStop={this.props.onStop}
      >
        <div
          className={`pulse-toucharea text-center pulse-expand ${this.props
            .className || ''} ${activeClass} `}
          onClick={this.props.onClick}
        >
          <div
            className={`pulse delay ${colorClass}`}
            style={{
              animationDelay:
                (this.props.delay || this.randomDelay(10, 50)) + 'ms'
            }}
          />
          {this.props.label && (
            <Text
              className="pulse-label mb-0 p-1 d-inline-block"
              type="micro"
              variant="color-petrolium"
            >
              {label}
            </Text>
          )}
        </div>
      </Draggable>
    );
  }
}
