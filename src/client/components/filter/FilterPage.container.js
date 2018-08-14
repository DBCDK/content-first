import React from 'react';
import {connect} from 'react-redux';
import {isMobile} from 'react-device-detect';
import SelectedFilters from './SelectedFilters.component';
import Filters from './Filters.component';
import WorkCard from '../work/WorkCard.container';
import Heading from '../base/Heading';
import Spinner from '../general/Spinner.component';
import {
  ON_EDIT_FILTER_TOGGLE,
  ON_EXPAND_FILTERS_TOGGLE
} from '../../redux/filter.reducer';
import {HISTORY_REPLACE, HISTORY_PUSH} from '../../redux/middleware';
import {RECOMMEND_REQUEST, getRecommendedPids} from '../../redux/recommend';
import {filtersMapAll} from '../../redux/filter.reducer';
import {isEqual} from 'lodash';
import SearchBar from './SearchBar.component';

class FilterPage extends React.Component {
  constructor() {
    super();
    this.state = {query: '', expanded: false};
  }

  toggleFilter(filterId) {
    const {selectedTagIds} = this.props;
    const tags = selectedTagIds.includes(filterId)
      ? selectedTagIds.filter(id => filterId !== id)
      : [...selectedTagIds, filterId];

    this.props.history(HISTORY_REPLACE, '/find', {tag: tags});
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps) {
    this.fetch(prevProps);
  }

  fetch(prevProps) {
    if (
      !prevProps ||
      !isEqual(prevProps.selectedTagIds, this.props.selectedTagIds)
    ) {
      this.props.fetchRecommendations(this.props.plainSelectedTagIds);
    }
  }

  render() {
    let warningMessage = null;
    const resultCount = this.props.recommendedPids.pids.length;
    const resultCountPrefixText =
      resultCount === 100 ? 'Mere end ' + resultCount : resultCount;

    if (
      this.props.recommendedPids.pids.length === 0 &&
      !this.props.recommendedPids.isLoading
    ) {
      warningMessage = 'De valgte filtre giver tomt resultat';
    }
    return (
      <div className="filter-page">
        <div className="filters row">
          {isMobile && (
            <div className="filter-page-top col-xs-12">
              <div className="filter-page-searchbar">
                <SearchBar />
              </div>
            </div>
          )}
        </div>

        <Filters
          filters={this.props.filters}
          cards={this.props.filterCards}
          selectedFilters={this.props.selectedTags}
          onFilterToggle={filter => {
            this.toggleFilter(filter.id || filter);
          }}
        />

        {warningMessage && (
          <div className="warning row text-center">{warningMessage}</div>
        )}

        <div className="filter-page-resultCount text-left pt4">
          <Heading Tag="h4" type="lead">
            {resultCountPrefixText} bøger
          </Heading>
        </div>

        <div className="filter-page-works">
          {this.props.recommendedPids.pids.length > 0 &&
            this.props.recommendedPids.pids.map(pid => (
              <WorkCard
                className="ml1 mr1"
                pid={pid}
                key={pid}
                enableHover={true}
                allowFetch={true}
                onWorkPreviewClick={work =>
                  this.props.history(HISTORY_PUSH, '/værk/' + work.book.pid)
                }
                origin={`Fra din søgning på ${this.props.selectedTags
                  .map(t => t.title)
                  .join(', ')}`}
              />
            ))}
        </div>
        {this.props.recommendedPids.isLoading && (
          <Spinner style={{width: 50, height: 50}} />
        )}
      </div>
    );
  }
}
const mapStateToProps = state => {
  const filterCards = state.filtercardReducer;
  const selectedTagIds = state.routerReducer.params.tag
    ? state.routerReducer.params.tag
        .map(id => {
          if (id instanceof Array) {
            return id.map(id => parseInt(id, 10));
          }
          return parseInt(id, 10);
        })
        .filter(id => {
          if (id instanceof Array) {
            return id.map(id => filtersMapAll[id]);
          }
          return filtersMapAll[id];
        })
    : [];

  let plainSelectedTagIds = [];
  selectedTagIds.forEach(id => {
    if (id instanceof Array) {
      const parent = filtersMapAll[id[0]].parents[0];
      const range = filterCards[parent].range;

      const min = range.indexOf(id[0]);
      const max = range.indexOf(id[1]);

      range.forEach((id, idx) => {
        if (idx >= min && idx <= max) {
          plainSelectedTagIds.push(id);
        }
      });
    } else {
      plainSelectedTagIds.push(id);
    }
  });

  return {
    recommendedPids: getRecommendedPids(state.recommendReducer, {
      tags: plainSelectedTagIds
    }),
    filterCards,
    selectedTagIds,
    plainSelectedTagIds,
    selectedTags: selectedTagIds.map(tag => {
      if (tag instanceof Array) {
        return tag.map(tag => filtersMapAll[tag]);
      }
      return filtersMapAll[tag.id || tag];
    }),
    filters: state.filterReducer.filters,
    editFilters: state.filterReducer.editFilters,
    expandedFilters: state.filterReducer.expandedFilters
  };
};
export const mapDispatchToProps = dispatch => ({
  editFilterToggle: () => dispatch({type: ON_EDIT_FILTER_TOGGLE}),
  expandFiltersToggle: id => dispatch({type: ON_EXPAND_FILTERS_TOGGLE, id}),

  history: (type, path, params = {}) => {
    dispatch({type, path, params});
  },
  fetchRecommendations: tags =>
    dispatch({
      type: RECOMMEND_REQUEST,
      tags,
      max: 100 // we ask for many recommendations, since client side filtering may reduce the actual result significantly
    })
});
export default connect(mapStateToProps, mapDispatchToProps)(FilterPage);
