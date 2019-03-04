import React from 'react';

export default class HoverImage extends React.Component {
  mouseEnter = () => {
    this.setState({src: this.props.mouseOver});
  };
  mouseLeave = () => {
    this.setState({src: this.props.src});
  };

  constructor(props) {
    super(props);
    this.state = {
      src: props.src
    };
  }

  componentDidMount() {
    this.setState({src: this.props.src});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.src !== this.props.src) {
      this.mouseEnter();
      this.mouseLeave();
    }
  }

  render() {
    return (
      <div>
        <img
          style={{cursor: 'pointer', width: '46px', height: '46px'}}
          src={this.state.src}
          onMouseOver={this.mouseEnter}
          onMouseOut={this.mouseLeave}
        />
      </div>
    );
  }
}
