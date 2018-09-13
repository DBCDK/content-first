import React from 'react';
import {connect} from 'react-redux';
import {isMobile} from 'react-device-detect';
import Filters from './Filters.component';
import WorkCard from '../work/WorkCard.container';
import Heading from '../base/Heading';
import Spinner from '../general/Spinner.component';
import {
  ON_EDIT_FILTER_TOGGLE,
  ON_EXPAND_FILTERS_TOGGLE
} from '../../redux/filter.reducer';
import {HISTORY_REPLACE, HISTORY_PUSH} from '../../redux/middleware';
import {RECOMMEND_REQUEST} from '../../redux/recommend';
import {
  getRecommendedBooks,
  getTagsFromUrl,
  getCreatorsFromUrl,
  getTitlesFromUrl,
  getIdsFromRange,
  getTagsbyIds
} from '../../redux/selectors';
import {isEqual} from 'lodash';
import SearchBar from './SearchBar.component';

class FilterPage extends React.Component {
  constructor() {
    super();
    this.state = {query: '', expanded: false};
  }

  componentDidMount() {
    this.fetch();
    this.initFilterPosition();
  }

  componentDidUpdate(prevProps) {
    this.fetch(prevProps);
  }

  toggleFilter(filterId) {
    let {selectedTagIds} = this.props;

    /* remove title/creator if any*/
    selectedTagIds = selectedTagIds.filter(tag => {
      return !(typeof tag === 'string' || tag instanceof String);
    });

    const tags = selectedTagIds.includes(filterId)
      ? selectedTagIds.filter(id => filterId !== id)
      : [...selectedTagIds, filterId];

    this.props.history(HISTORY_REPLACE, '/find', {tag: tags});
    this.initFilterPosition();
  }

  initFilterPosition() {
    document.getElementById('selected-filters-wrap').scrollLeft = 99999999;
  }

  fetch(prevProps) {
    if (
      !prevProps ||
      !isEqual(prevProps.selectedTagIds, this.props.selectedTagIds)
    ) {
      this.props.fetchRecommendations(this.props.plainSelectedTagIds);
      this.props.onSearch(
        this.props.selectedCreators[0] || this.props.selectedTitles[0] || ''
      );
    }
  }

  render() {
    const resultCount = this.props.recommendedPids.pids.length;
    const resultCountPrefixText =
      resultCount === 300 ? 'Mere end ' + resultCount : resultCount;
    const resultCountPostFix = resultCount === 1 ? 'bog' : 'bøger';
    const noResultsMessage =
      'Vi fandt desværre ingen bøger som matchede din søgning';

    return (
      <div className="filter-page">
        <div className="filters row">
          {isMobile && (
            <div className="filter-page-top col-12">
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

        <div className="container">
          <div className="filter-page-resultCount text-left">
            <Heading Tag="h4" type="lead">
              {resultCount === 0
                ? noResultsMessage
                : resultCountPrefixText + ' ' + resultCountPostFix}
            </Heading>
          </div>

          <div className="filter-page-works">
            {this.props.recommendedPids.pids.length > 0 &&
              this.props.recommendedPids.pids.map(pid => (
                <WorkCard
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  const filterCards = state.filtercardReducer;
  const selectedTagIds = getTagsFromUrl(state);
  const selectedCreators = getCreatorsFromUrl(state);
  const selectedTitles = getTitlesFromUrl(state);
  const plainSelectedTagIds = getIdsFromRange(state, selectedTagIds);
  const selectedTags = getTagsbyIds(state, selectedTagIds);
  const mergedSelectedTags = [].concat(
    selectedTagIds,
    selectedCreators,
    selectedTitles
  );

  const results =
    state.searchReducer.results && state.searchReducer.results.length > 0
      ? {pids: state.searchReducer.results.map(work => work.pid)}
      : null;

  const recommendedPids = getRecommendedBooks(state, plainSelectedTagIds, 300);

  return {
    recommendedPids: results || recommendedPids,
    filterCards,
    selectedCreators,
    selectedTitles,
    selectedTagIds: mergedSelectedTags,
    plainSelectedTagIds,
    selectedTags: selectedTags.length > 0 ? selectedTags : mergedSelectedTags,
    results: results || [],
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
  onSearch: query =>
    dispatch({type: 'SEARCH_QUERY', query: query.toLowerCase()}),
  fetchRecommendations: tags =>
    dispatch({
      type: RECOMMEND_REQUEST,
      tags,
      max: 100 // we ask for many recommendations, since client side filtering may reduce the actual result significantly
    })
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterPage);
