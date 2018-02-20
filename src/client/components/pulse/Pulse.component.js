import React from 'react';

/*
  <Pulse
    onClick={() => {
      this.rollOverTrigger('pid', 'description...', {x:-,y:-}, index);
    }}
    position={{x:-,y:-}}
  />
*/

export default class Pulse extends React.Component {
  render() {
    let styles = {
      left: this.props.position.x + '%',
      top: this.props.position.y + '%'
    };

    return (
      <div
        className="pulse-toucharea"
        style={styles}
        onClick={this.props.onClick}
      >
        <div className="pulse" />
      </div>
    );
  }
}
