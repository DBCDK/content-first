import React from 'react';

export default class TouchHover extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      touching: false,
      touches: 0
    };
  }

  render() {
    return (
      <div
        className={`${this.props.className ? this.props.className : ''}${this.state.touches > 0 ? ' touch-hover' : ''}`}
        tabIndex="1"
        onTouchEnd={() => {
          this.setState({touching: true});
        }}
        onClick={(e) => {
          let touches = this.state.touches;
          if (this.state.touching) {
            touches++;
            this.setState({touches: touches});
          }
          if (this.props.onClick) {
            this.props.onClick(touches, e);
          }
        }}
        onBlur={() => {
          this.setState({touches: 0});
        }}>
        {this.props.children}
      </div>
    );
  }
}
