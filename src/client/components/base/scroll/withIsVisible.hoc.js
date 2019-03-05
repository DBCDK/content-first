import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

const withIsVisible = WrappedComponent => {
  return class extends React.Component {
    constructor() {
      super();
      this.state = {isVisible: false};
    }
    onChange = isVisible => {
      if (!this.state.isVisible && isVisible) {
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
};

export default withIsVisible;
