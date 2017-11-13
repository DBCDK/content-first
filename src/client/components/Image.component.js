import React from 'react';

class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {current: 0};
  }

  render() {
    return (
      <img
        alt=""
        src={this.props.urls[this.state.current]}
        onError={() => {
          this.setState({current: Math.min(this.state.current+1, this.props.urls.length-1)});
        }}/>
    );
  }
}

export default Image;
