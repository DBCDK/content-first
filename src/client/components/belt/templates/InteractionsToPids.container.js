import React from 'react';
import {connect} from 'react-redux';
import PidsToPids from './PidsToPids.container';

export class InteractionsToPids extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.belt !== this.props.belt ||
      nextProps.interactions !== this.props.interactions
    );
  }

  getRecoPids() {
    return this.props.interactions.map(o => {
      return o.pid;
    });
  }

  render() {
    if (!this.props.isLoggedIn) {
      return null;
    }

    const recoPids = this.getRecoPids();
    const name = this.props.username;
    const fullName = name ? 'Bedste forslag til ' + name : '';

    return <PidsToPids {...this.props} likes={recoPids} name={fullName} />;
  }
}

const mapStateToProps = state => {
  return {
    interactions: state.interactionReducer.interactions,
    username: state.userReducer.name,
    isLoggedIn: state.userReducer.isLoggedIn
  };
};

export default connect(mapStateToProps)(InteractionsToPids);
