import React from 'react';

export default class HoverButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      src: props.src
    };
  }

  componentDidMount() {
    this.setState({src: this.props.src});
  }

  mouseEnter = () => {
    this.setState({src: this.props.mouseOver});
  };
  mouseLeave = () => {
    this.setState({src: this.props.mouseOut});
  };

  render() {
    console.log('src  state', this.state.src);
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
