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
        // Hent rollerne ud fra redux state'd og oversæt tekst til id - ellers gør ikke noget - for query.owner

        const objects = (await this.storageClient.find(this.props.query)).data;
        if (!isEqual(objects, this.state.objects.objects)) {
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
      objects: state.objects
    };
  };

  return connect(mapStateToProps)(Wrapper);
};
