import React from 'react';
import {connect} from 'react-redux';
import {debounce} from 'lodash';

import {loadListAggragation} from '../../../utils/requester';

/**
 *
 * withListAggregationHoc
 *
 * @param {string} sort 'num_items' (default) | 'num_follows' | 'num_comments' | '_created' | '_modified'
 * @param {int} limit - limit results
 * @param {string} pid - lists containing specific pid
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

    componentDidUpdate() {
      this.loadLists();
    }

    /**
     * LoadLists
     **/

    loadLists = debounce(
      async () => {
        const {type, sort, limit, pid} = this.props;

        try {
          const lists = await loadListAggragation(type, sort, limit, pid);
          if (lists.length !== this.state.lists.length) {
            this.setState({lists});
          }
        } catch (e) {
          // error handle
        }
      },
      500,
      {
        trailing: true,
        leading: true
      }
    );

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
      pid,
      isFetching: state.listReducer.isFetching,
      hasFetched: state.listReducer.hasFetched
    };
  };

  return connect(mapStateToProps)(Wrapper);
};
