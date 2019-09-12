import React from 'react';
import {connect} from 'react-redux';
import StorageClient from '../../../shared/client-side-storage.client';

export class Storage extends React.Component {
  storageClient = new StorageClient();

  getRole() {
    if (Array.isArray(this.props.roles)) {
      const role = this.props.roles.find(
        element =>
          typeof element.machineName === 'string' &&
          element.machineName === this.props.role
      );
      return typeof role === 'undefined' ? role : role._id; // If owner is undefined then return undefined
    }
    return; // If this.props.roles is undefined then return undefined
  }

  noop() {}

  create = object => {
    return this.storageClient.put(object, this.getRole());
  };

  update = object => {
    if (typeof object._id !== 'string') {
      throw new Error('ID must be given, when updating a Storage Object');
    }
    return this.storageClient.put(object, this.getRole());
  };

  remove = params => {
    return this.storageClient.delete(params, this.getRole());
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
