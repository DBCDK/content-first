import React from 'react';
import {connect} from 'react-redux';

import StorageClient from '../../../../shared/client-side-storage.client';
import {isEqual} from 'lodash';

/**
 *
 * withObjects
 *
 * @param {object} query - objects containing the query parameters for the objects to retrieve
 * @return {Array} - returns array of the retrieved objects
 **/

export const withObjects = WrappedComponent => {
  const Wrapper = class extends React.Component {
    storageClient = new StorageClient();

    constructor() {
      super();
      this.state = {objects: {fetching: true, error: null, objects: []}};
    }

    componentDidMount() {
      this.loadObjects();
    }

    componentDidUpdate(prevProps) {
      if (this.props.query !== prevProps.query) {
        this.loadObjects();
      }
    }

    /**
     * loadObjects
     **/

    loadObjects = async () => {
      try {
        const {roles, query} = this.props;
        const owner = roles[query.owner] ? roles[query.owner]._id : query.owner;
        const objects = (await this.storageClient.find({...query, owner})).data;
        if (
          this.state.objects.fetching ||
          !isEqual(objects, this.state.objects.objects)
        ) {
          this.setState({objects: {fetching: false, objects}});
        }
      } catch (e) {
        this.setState({
          objects: {
            error: 'Could not fetch objects from storage',
            fetching: false,
            objects: []
          }
        });
      }
    };

    render() {
      const {objects} = this.state.objects;
      if (!objects) {
        return null;
      }
      return <WrappedComponent {...this.props} objects={this.state.objects} />;
    }
  };

  const mapStateToProps = state => {
    return {
      objects: state.objects,
      roles: state.roles
    };
  };

  return connect(mapStateToProps)(Wrapper);
};
