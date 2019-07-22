import React from 'react';
import {connect} from 'react-redux';

import {loadListAggragation} from '../../../utils/requester';

/**
 *
 * withListAggregationHoc
 *
 * @param {string} sort 'num_items' (default) | 'num_follows' | 'num_comments' | '_created' | '_modified'
 * @param {string} pid
 * @return {Array} - returns array of data aggregated lists.
 **/

export const withListAggregation = WrappedComponent => {
  const Wrapper = class extends React.Component {
    constructor() {
      super();
      this.state = {lists: []};
    }

    componentDidMount() {
      this.loadLists();
    }

    /**
     * LoadLists
     **/

    loadLists = async () => {
      const {type, sort, pid} = this.props;

      try {
        const lists = await loadListAggragation(type, sort, pid);
        this.setState({lists});
      } catch (e) {
        // error handle
      }
    };

    render() {
      const {lists} = this.state;
      if (!lists) {
        return null;
      }
      return <WrappedComponent {...this.props} lists={this.state.lists} />;
    }
  };

  const mapStateToProps = (state, ownProps) => {
    const type = 'list';
    const sort = ownProps.sort;
    const pid = ownProps.pid;

    return {
      type,
      sort,
      pid
    };
  };

  const mapDispatchToProps = () => {
    return {};
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapper);
};
