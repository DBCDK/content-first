import React from 'react';
import {connect} from 'react-redux';
import VisibilitySensor from 'react-visibility-sensor';

import isBot from '../../../utils/isBot';

const withIsVisible = WrappedComponent => {
  const wrapped = class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {isVisible: isBot() || props.isKiosk};
    }
    onChange = isVisible => {
      if (!this.state.isVisible && !isBot() && isVisible) {
        this.setState({isVisible: true});
      }
    };

    render() {
      return (
        <VisibilitySensor
          onChange={this.onChange}
          partialVisibility={true}
          offset={{top: -1000, bottom: -1000}}
        >
          <WrappedComponent {...this.props} {...this.state} />
        </VisibilitySensor>
      );
    }
  };

  const mapStateToProps = state => {
    return {
      isKiosk: state.kiosk.enabled
    };
  };

  return connect(mapStateToProps)(wrapped);
};

export default withIsVisible;
