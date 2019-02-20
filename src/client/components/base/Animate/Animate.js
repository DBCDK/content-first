import React from 'react';
import {connect} from 'react-redux';
import Animation from './Animation';

export class Animate extends React.Component {
  render() {
    const {animate} = this.props;

    // Array of animation names from reducer
    const aAnimations = Object.values(animate);

    if (aAnimations.length === 0) {
      return null;
    }

    return aAnimations.map(obj => {
      if (!obj.animated) {
        return <Animation animation={obj} />;
      }
    });
  }
}

const mapStateToProps = state => {
  return {
    animate: state.animateReducer
  };
};

export default connect(mapStateToProps)(Animate);
