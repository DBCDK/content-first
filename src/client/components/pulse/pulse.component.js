import React from 'react';

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
