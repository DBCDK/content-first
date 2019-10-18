import React from 'react';
import {connect} from 'react-redux';
import StorageClient from '../../../shared/client-side-storage.client';

class Storage extends React.Component {
  storageClient = new StorageClient();

  getRole() {
    if (typeof this.props.role === 'undefined') {
      return;
    }
    if (Array.isArray(this.props.roles)) {
      const role = this.props.roles.find(
        element =>
          typeof element.machineName === 'string' &&
          element.machineName === this.props.role
      );
      if (typeof role !== 'undefined') {
        return role._id;
      }
    }
    throw new Error('User is not authorized');
  }

  create = object => {
    return this.storageClient.put(
      {...object, createdBy: this.props.openplatformId},
      this.getRole()
    );
  };

  update = object => {
    if (typeof object._id !== 'string') {
      throw new Error('ID must be given, when updating a Storage Object');
    }
    return this.storageClient.put(
      {...object, createdBy: this.props.openplatformId},
      this.getRole()
    );
  };

  remove = params => {
    return this.storageClient.delete({id: params._id}, this.getRole());
  };

  render() {
    const {render} = this.props;
    return render({
      create: this.create,
      update: this.update,
      remove: this.remove
    });
  }
}

const mapStateToProps = state => {
  return {
    roles: state.userReducer.roles,
    openplatformId: state.userReducer.openplatformId
  };
};

export default connect(mapStateToProps)(Storage);
