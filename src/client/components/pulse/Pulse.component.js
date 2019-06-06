import React from 'react';
import Draggable from 'react-draggable';
import Text from '../base/Text';
import {withWork} from '../hoc/Work';

import './pulse.css';

export class Pulse extends React.Component {
  randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min) + '00';
  }

  render() {
    if (!this.props.work || !this.props.work.book) {
      return null;
    }
    let label = this.props.work.book.title || false;

    if (label && label.length > 15) {
      label = this.props.label.substring(0, 15) + '...';
    }

    const activeClass = this.props.active ? 'pulse-active' : '';
    const noAnimationClass = this.props.noAnimation ? 'pulse-noAnimation' : '';
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
            .className || ''} ${activeClass} ${noAnimationClass}`}
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
              variant="color-petroleum"
            >
              {label}
            </Text>
          )}
        </div>
      </Draggable>
    );
  }
}

export default withWork(Pulse);
