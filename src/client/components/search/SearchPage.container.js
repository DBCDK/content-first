import React from 'react';
import {connect} from 'react-redux';

import SearchField from './SearchField.component';

export const SearchPage = props => (
  <div className="col-xs-11 col-centered text-left">
    <SearchField
      style={{marginTop: 40, marginBottom: 30}}
      searching={props.searching}
      onSearch={props.onSearch}
    />
    {!props.results ? (
      <div>Intet søgeresultat endnu.</div>
    ) : (
      <div>
        <p>
          Søgning efter "{props.query}" returnerede {props.results.length}{' '}
          resultater.
        </p>
        <ul>
          {props.results.map(o => (
            <li key={o.pid}>
              <a href={'/værk/' + o.pid}>
                {o.title} - {o.creator}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export const mapStateToProps = state => ({
  query: state.searchReducer.query,
  searching: state.searchReducer.loading,
  results: state.searchReducer.results
});
export const mapDispatchToProps = dispatch => ({
  onSearch: query => dispatch({type: 'SEARCH_QUERY', query})
});
export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
