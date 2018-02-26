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

    console.log(this.props.active + ' - ' + this.props.pid);

    if (this.props.active === this.props.pid) {
      console.log('yes');
    }
    {
      console.log('no');
    }

    return (
      <div
        className={`pulse-toucharea ${
          this.props.active === this.props.pid ? ' pulse-active' : ''
        }`}
        style={styles}
        onClick={this.props.onClick}
      >
        <div className="pulse" />
      </div>
    );
  }
}
