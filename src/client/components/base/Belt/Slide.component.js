import React from 'react';

class Slide extends React.Component {
  // shouldComponentUpdate(nextProps) {
  //   return nextProps.style.width !== this.props.style.width;
  // }
  render() {
    return (
      <div
        className="slide-wrapper"
        style={{
          padding: 20,
          display: 'inline-block',
          verticalAlign: 'top',
          ...this.props.style
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Slide;
