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
      this.state = {objects: {fetching: true, objects: []}};
    }

    componentDidMount() {
      this.loadObjects();
    }

    componentDidUpdate() {
      this.loadObjects();
    }

    /**
     * loadObjects
     **/

    loadObjects = async () => {
      try {
        const objects = (await this.storageClient.find(this.props.query)).data;
        if (!isEqual(objects, this.state.objects.objects)) {
          this.setState({objects: {fetching: false, objects}});
        }
      } catch (e) {
        // error handle ??????? Hvad hvis jeg udelader try/catch - hvordan håndteres exceptions i async?
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
      objects: state.objects
    };
  };

  return connect(mapStateToProps)(Wrapper);
};
