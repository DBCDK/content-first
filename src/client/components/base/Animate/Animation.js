import React from 'react';
import {connect} from 'react-redux';
import './Animate.css';
import {stopAnimate} from '../../../redux/animate.reducer';

// Set animation-duration time
const timer = 500;

export class Animation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {init: false};
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({init: true});
    }, 10);

    console.log('this.props', this.props);

    setTimeout(() => {
      this.props.animation.onEnd();
      this.props.stopAnimation(this.props.animation.name);
      this.setState({init: false});
    }, timer);
  }

  render() {
    const {animation} = this.props;

    return (
      <div key={animation.component} className="animate__container">
        <span style={!this.state.init ? animation.from : animation.to}>
          {animation.component}
        </span>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  stopAnimation: name => dispatch(stopAnimate(name))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Animation);
