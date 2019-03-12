import React from 'react';
import request from 'superagent';

/**
 * A HOC that makes the enhanced component take a search query as input prop,
 * download the corresponding search result, and then map the pids as a prop.
 *
 * @param {React.Component} WrappedComponent The component to be enhanced
 * @returns {React.Component} The enhanced component
 *
 * @example
 * // create a pure component and enhance it
 * const GreatBooks = ({pids}) =>
 *  <ul>{pids.map(pid => <li>{pid}</li>)}</ul>;
 * export default withTagsToPids(GreatBooks)
 *
 * // use the enhanced component like this
 * <GreatBooks query="hest"/>
 *
 * // the search result may be lazy-loaded using the isVisible prop.
 * // if isVisible=false, search request is not sent until isVisible=true
 * <GreatBooks query="hest" isVisible={false}/>
 */
const withQueryToPids = WrappedComponent => {
  const Wrapped = class extends React.Component {
    constructor() {
      super();
      this.state = {pids: [], isFetching: false};
    }
    componentDidMount() {
      this.fetch();
    }

    componentDidUpdate() {
      this.fetch();
    }
    async fetch() {
      if (
        (this.props.isVisible || typeof this.props.isVisible === 'undefined') &&
        this.fetched !== this.props.query
      ) {
        this.fetched = this.props.query;
        this.setState({isFetching: true, pids: []});
        const result = await request
          .get('/v1/searcher')
          .query({query: this.props.query});

        this.setState({
          isFetching: false,
          pids: result.body.map(entry => entry.pid)
        });
        console.log({result});
      }
    }

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  };

  return Wrapped;
};

export default withQueryToPids;
