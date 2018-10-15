import React from 'react';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import Filters from './Filters.component';
import WorkCard from '../work/WorkCard.container';
import Heading from '../base/Heading';
import SearchBar from './SearchBar.component';
import Spinner from '../general/Spinner.component';
import BooksBelt from '../belt/BooksBelt.component';
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
import {ADD_BELT} from '../../redux/belts.reducer';

import {buildSimilarBooksBelt} from '../work/workFunctions';

const Results = ({rows, pids, belts, addBelt}) => {
  if (!rows || !pids) {
    return null;
  }

  return pids.map((pidsInRow, idx) => {
    let name = '';
    pidsInRow.forEach(str => (name += str + ' '));

    const belt = {
      name,
      onFrontPage: false,
      pidPreview: false,
      links: [],
      tags: []
    };

    if (!belts[name]) {
      addBelt(belt);
    }

    return <BooksBelt belt={belt} recommendedPids={pidsInRow} />;
  });
};

class FilterPage extends React.Component {
  constructor() {
    super();
    this.state = {query: '', expanded: false, resultsPerRow: null};
  }

  componentDidMount() {
    this.workCard = 0;
    this.container = 0;

    this.fetch();
    this.initFilterPosition();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  componentDidUpdate(prevProps) {
    this.fetch(prevProps);
    this.handleResize();
  }

  calcResultsPerRow() {
    const workCard = this.workCard;
    const container = this.container;

    const result = Math.floor(container / workCard);

    if (result === Infinity) {
      return 0;
    }

    return result;
  }

  handleResize = () => {
    if (this.refs.workCard) {
      if (this.workCard !== this.refs.workCard.clientWidth) {
        this.workCard = this.refs.workCard.clientWidth || 0;
      }
    }
    if (this.refs.container) {
      if (this.container !== this.refs.container.clientWidth) {
        this.container = this.refs.container.clientWidth || window.innerWidth;
      }
    }

    const resultsPerRow = this.calcResultsPerRow();

    if (this.state.resultsPerRow !== resultsPerRow) {
      this.setState({resultsPerRow});
    }
  };

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

  structuredPids(pids, resultsPerRow, rows) {
    let results = [];
    for (let r = 1; r <= rows; r++) {
      let row = [];
      for (let i = 1; i <= resultsPerRow; i++) {
        const pos = r * resultsPerRow - (resultsPerRow - i);
        if (pids[pos]) {
          row.push(pids[pos]);
        }
      }
      results.push(row);
    }
    return results;
  }

  render() {
    const resultsPerRow = this.state.resultsPerRow;
    const recommendedPids = this.props.recommendedPids;
    const resultCount = recommendedPids.pids.length;
    const rows = resultsPerRow ? resultCount / resultsPerRow : 0;

    const structuredPids = this.structuredPids(
      recommendedPids.pids,
      resultsPerRow,
      rows
    );

    const resultCountPrefixText =
      resultCount === 300 ? 'Mere end ' + resultCount : resultCount;
    const resultCountPostFix = resultCount === 1 ? 'bog' : 'bøger';
    const noResultsMessage =
      'Vi fandt desværre ingen bøger som matchede din søgning';

    return (
      <div className="filter-page">
        <div className="filters row">
          <div className="filter-page-top col-12">
            <div className="filter-page-searchbar">
              <SearchBar />
            </div>
          </div>
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
          <div
            className="filter-page-works"
            ref={container => (this.refs = {...this.refs, container})}
          >
            {this.workCard && resultCount > 0 ? (
              <Results
                rows={rows}
                pids={structuredPids}
                belts={this.props.belts}
                addBelt={this.props.addBelt}
              />
            ) : (
              Array.from(new Array(100), (v, i) => i + 1).map((skeleton, i) => (
                <WorkCard
                  key={i}
                  cardRef={workCard => (this.refs = {...this.refs, workCard})}
                />
              ))
            )}
          </div>
          {recommendedPids.isLoading && (
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
    expandedFilters: state.filterReducer.expandedFilters,
    works: state.booksReducer.books,
    belts: state.beltsReducer.belts
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
    }),
  addBelt: belt => {
    dispatch({
      type: ADD_BELT,
      belt
    });
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterPage);
