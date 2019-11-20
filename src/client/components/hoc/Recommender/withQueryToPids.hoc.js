import React from 'react';
import request from 'superagent';
import {difference} from 'lodash';

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
 * export default withQueryToPids(GreatBooks)
 *
 * // use the enhanced component like this
 * <GreatBooks query="hest"/>
 *
 * // the search result may be lazy-loaded using the isVisible prop.
 * // if isVisible=false, search request is not sent until isVisible=true
 * <GreatBooks query="hest" isVisible={false}/>
 *
 * // One may filter on a specific branch
 * <GreatBooks query="hest" branch="Hovedbiblioteket" agencyId="710100" />
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
    fetch = async () => {
      if (
        (this.props.isVisible || typeof this.props.isVisible === 'undefined') &&
        !this.state.isFetching &&
        (this.fetched !== this.props.query ||
          this.fetchedBranch !== this.props.branch ||
          this.fetchedAgencyId !== this.props.agencyId)
      ) {
        try {
          this.fetched = this.props.query;
          this.fetchedBranch = this.props.branch;
          this.fetchedAgencyId = this.props.agencyId;
          this.setState({isFetching: true, pids: []});
          const resultAll = (await request.get('/v1/searcher').query({
            query: `"${this.props.query}"`,
            rows: 200,
            field: 'author',
            exact: true,
            merge_workid: true
          })).body.map(entry => entry.pid);

          if (this.fetchedBranch && this.fetchedAgencyId) {
            // Fetch books available at specific branch
            // and make sure they occur first in the list
            const holdings = (await request.get('/v1/holdings').query({
              pid: resultAll,
              branch: this.fetchedBranch,
              agencyId: this.fetchedAgencyId
            })).body;

            const resultInBranch = resultAll.filter(
              pid =>
                holdings[pid].filter(
                  holding => holding.onShelf && holding.type.includes('Bog')
                ).length > 0
            );

            const resultNotInBranch = difference(resultAll, resultInBranch);
            const result = [...resultInBranch, ...resultNotInBranch];
            this.setState({
              isFetching: false,
              pids: result
            });
          } else {
            this.setState({
              isFetching: false,
              pids: resultAll
            });
          }
        } catch (e) {
          this.setState({
            isFetching: false,
            pids: [],
            error: 'Something went wrong'
          });
        }
      }
    };

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  };

  return Wrapped;
};

export default withQueryToPids;
