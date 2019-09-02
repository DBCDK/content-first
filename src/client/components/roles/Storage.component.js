import React from 'react';
import {connect} from 'react-redux';

export class Storage extends React.Component {
  getId() {
    if (Array.isArray(this.props.roles)) {
      const owner = this.props.roles.find(
        element =>
          typeof element.machineName === 'string' &&
          element.machineName === this.props.role
      );
      return typeof owner === 'undefined' ? owner : owner._id; // If owner is undefined then return undefined
    }
    return; // If this.props.roles is undefined then return undefined
  }

  noop() {}

  create = parameters => {
    console.log(
      '$$$ Create is now called with owner:',
      this.getId(),
      'and parameters: ',
      parameters
    );
  };

  update = parameters => {
    console.log(
      '$$$ Update is now called with owner:',
      this.getId(),
      'and parameters: ',
      parameters
    );
  };

  remove = parameters => {
    console.log(
      '$$$ Remove is now called with owner:',
      this.getId(),
      'and parameters: ',
      parameters
    );
  };

  render() {
    const {role, render} = this.props;
    if (
      typeof render === 'function' &&
      (role === 'contentFirstEditor' || role === 'contentFirstAdmin')
    ) {
      return render({
        create: this.create,
        update: this.update,
        remove: this.remove
      });
    }
    return render({create: this.noop, update: this.noop, remove: this.noop});
  }
}

const mapStateToProps = state => {
  return {roles: state.userReducer.roles};
};

export const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Storage);
