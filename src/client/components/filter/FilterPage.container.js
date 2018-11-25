import React from 'react';
import {connect} from 'react-redux';
import {isMobileOnly} from 'react-device-detect';
import scrollToComponent from 'react-scroll-to-component';
import Filters from './Filters.component';
import WorkCard from '../work/WorkCard.container';
import Heading from '../base/Heading';
import SearchBar from './SearchBar.component';
import Spinner from '../general/Spinner.component';
import BeltWrapper from '../belt/BooksBelt.component';
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
import {
  ADD_BELT,
  REMOVE_BELT,
  REORGANIZE_FILTERPAGE_BELTS
} from '../../redux/belts.reducer';
import {isEqual} from 'lodash';

const Results = ({rows, pids, ...props}) => {
  if (!rows || !pids || !props.origin) {
    return null;
  }

  return pids.map((row, idx) => {
    let belt = false;
    return (
      <React.Fragment key={idx}>
        <div
          className="w-100 d-flex justify-content-around justify-content-md-between"
          ref={e => props.rowRef(e, idx)}
        >
          {pids[idx].map((pid, cardIndex) => {
            const work = props.works[pid];
            if (work && work.detailsHasLoaded) {
              const beltExist = props.belts[`filterpage: ${idx}`]
                ? props.belts[`filterpage: ${idx}`]
                : false;
              if (beltExist) {
                belt = beltExist;
              }

              return (
                <WorkCard
                  cardIndex={cardIndex}
                  key={'wc-' + pid}
                  className="p-0 pb-3 pr-sm-3"
                  rowId={idx}
                  pid={pid}
                  highlight={belt.pid === pid}
                  {...props}
                />
              );
            }
            if (pid === 'ghost') {
              return <WorkCard className="ghost" />;
            }
          })}
        </div>
        {belt && (
          <div className="belts col-12 mb-5">
            <BeltWrapper belt={belt} dataCy={'workpreviewCard'} />
          </div>
        )}
      </React.Fragment>
    );
  });
};

class FilterPage extends React.Component {
  constructor() {
    super();
    this.state = {query: '', expanded: false, resultsPerRow: null};
  }

  componentDidMount() {
    this.fetch();
    this.handleResize();
    this.initFilterPosition();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    const searchBar = document.getElementById('Searchbar__inputfield');
    if (searchBar) {
      searchBar.focus();
    }
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
      this.props.onSearch(
        this.props.selectedCreators[0] || this.props.selectedTitles[0] || ''
      );
    }
  }

  calcResultsPerRow() {
    const workCard = this.workCard;
    const container = this.container;
    const result = Math.floor(container / workCard);

    if (isNaN(result)) {
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
      this.props.reorganizeBelts();
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

  structuredPids(pids, resultsPerRow, rows) {
    let results = [];
    for (let r = 1; r <= rows; r++) {
      let row = [];
      for (let i = 0; i < resultsPerRow; i++) {
        const pos = r * resultsPerRow - (resultsPerRow - i);
        if (pids[pos]) {
          row.push(pids[pos]);
        } else {
          row.push('ghost');
        }
      }
      results.push(row);
    }
    return results;
  }

  handleBelts(work, row, type, newBelt) {
    let samePidClicked = false;
    let sameTypeClicked = false;

    const book = work.book;
    const belt = this.props.belts[`filterpage: ${row}`];

    if (isMobileOnly) {
      this.props.history(HISTORY_PUSH, '/værk/' + book.pid);
      return;
    }

    if (belt) {
      this.props.removeBelt(belt);
      samePidClicked = belt.pid === book.pid;
      sameTypeClicked = belt.type === type;
    }

    if (!belt || !samePidClicked || !sameTypeClicked) {
      this.props.addBelt(newBelt);
      this.scrollToBelt(this.refs[`row-${row}`], 220);
    }
  }

  onMoreLikeThisClick(work, row) {
    const type = 'belt';
    const book = work.book;

    const newBelt = {
      row,
      type,
      pid: book.pid,
      name: 'Minder om ' + book.title,
      key: `filterpage: ${row}`,
      onFrontPage: false,
      child: false
    };

    this.handleBelts(work, row, type, newBelt);
  }

  onWorkClick(work, row) {
    const type = 'preview';
    const book = work.book;

    const newBelt = {
      row,
      type,
      pid: book.pid,
      key: `filterpage: ${row}`,
      name: `filterpage: ${row}`,
      child: false
    };

    this.handleBelts(work, row, type, newBelt);
  }

  scrollToBelt(element, offset) {
    scrollToComponent(element, {offset});
  }

  render() {
    const resultsPerRow = this.state.resultsPerRow;
    const recommendedPids = this.props.recommendedPids;
    const resultCount = recommendedPids.pids.length;
    const rows = resultsPerRow ? Math.ceil(resultCount / resultsPerRow) : 0;

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
            {resultCount > 0 && rows > 0 ? (
              <Results
                rows={rows}
                pids={structuredPids}
                enableHover={true}
                allowFetch={true}
                hideMoreLikeThis={false}
                onMoreLikeThisClick={(work, rowId) =>
                  this.onMoreLikeThisClick(work, rowId)
                }
                onWorkClick={(work, rowId) => this.onWorkClick(work, rowId)}
                works={this.props.works}
                belts={this.props.belts}
                cardRef={workCard => (this.refs = {...this.refs, workCard})}
                rowRef={(e, idx) => (this.refs[`row-${idx}`] = e)}
                origin={`Fra din søgning på ${this.props.selectedTags
                  .map(t => t.title)
                  .join(', ')}`}
              />
            ) : (
              Array.from(new Array(100), (v, i) => i + 1).map(skeleton => (
                <WorkCard
                  key={skeleton}
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
  addBelt: (belt, allowReplace) => {
    dispatch({
      type: ADD_BELT,
      belt,
      allowReplace
    });
  },
  removeBelt: belt => {
    dispatch({
      type: REMOVE_BELT,
      belt
    });
  },
  reorganizeBelts: () => {
    dispatch({type: REORGANIZE_FILTERPAGE_BELTS});
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterPage);
