import React from 'react';
import {connect} from 'react-redux';
import {isMobileOnly} from 'react-device-detect';
import {toast} from 'react-toastify';
import ToastMessage from '../base/ToastMessage';
import Filters from './Filters.component';
import WorkCard from '../work/WorkCard.container';
import Heading from '../base/Heading';
import Pin from '../base/Pin';
import T from '../base/T';
import SearchBar from './SearchBar.component';
import Spinner from '../general/Spinner.component';
import BeltFacade from '../belt/BeltFacade.component';
import {
  ON_EDIT_FILTER_TOGGLE,
  ON_EXPAND_FILTERS_TOGGLE
} from '../../redux/filter.reducer';
import {HISTORY_PUSH} from '../../redux/middleware';
import {TAGS_RECOMMEND_REQUEST} from '../../redux/recommend';
import {TOGGLE_FILTER} from '../../redux/filter.reducer';
import {
  getRecommendedBooks,
  getTagsFromUrl,
  getCreatorsFromUrl,
  getTitlesFromUrl,
  getIdsFromRange,
  getTagsbyIds
} from '../../redux/selectors';
import {
  storeBelt,
  removeBelt,
  ADD_BELT,
  REMOVE_BELT,
  REORGANIZE_FILTERPAGE_BELTS
} from '../../redux/belts.reducer';
import {filtersMapAll} from '../../redux/filter.reducer';
import {SCROLL_TO_COMPONENT} from '../../redux/scrollToComponent';
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
          {pids[idx].map(pid => {
            const beltExist = props.belts[`filterpage: ${idx}`]
              ? props.belts[`filterpage: ${idx}`]
              : false;
            if (beltExist) {
              belt = beltExist;
            }

            if (pid === 'ghost') {
              return <WorkCard className="ghost" />;
            }

            return (
              <WorkCard
                key={'wc-' + pid}
                className="p-0 pb-3 pr-sm-3"
                isVisible={true}
                rowId={idx}
                pid={pid}
                rid={props.rid}
                highlight={belt.pid === pid}
                {...props}
              />
            );
          })}
        </div>
        {belt && (
          <div className="belts col-12 mb-5" data-cy="filterpage-book-belt">
            <BeltFacade id={belt.key} belt={belt} />
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
    this.props.toggleFilter(filterId);
    this.props.reorganizeBelts();
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
      this.props.addBelt(newBelt, this.props.rid);
      this.props.scrollToComponent(newBelt.key);
    }
  }

  onMoreLikeThisClick(work, row) {
    const type = 'belt';
    const book = work.book;

    const newBelt = {
      row,
      type,
      pid: book.pid,
      name: T({component: 'belts', name: 'remindsOf'}) + ' ' + book.title,
      key: `filterpage: ${row}`,
      onFrontPage: false,
      child: false,
      scrollIntoView: true
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
      child: false,
      scrollIntoView: true
    };

    this.handleBelts(work, row, type, newBelt);
  }

  onPinClick = () => {
    const type = 'belt';
    const tagIds = this.props.plainSelectedTagIds;
    const tags = this.props.selectedTagIds;
    const key = `pin: ${tagIds.join(', ')}`;

    if (this.props.belts[key]) {
      this.props.removePin(this.props.belts[key]);
      return;
    }

    if (tagIds.length === 0) {
      return;
    }

    const name = tagIds
      .map(tag => filtersMapAll[tag].title)
      .slice(0, 3)
      .join(', ');

    const newBelt = {
      type,
      key,
      name,
      tags,
      onFrontPage: true,
      child: false,
      editing: false
    };

    toast(
      <ToastMessage
        type="success"
        icon="check_circle"
        lines={[
          <T component="filter" name="pinnedToFrontpageToast" />,
          <a
            onClick={() =>
              this.props.history(HISTORY_PUSH, `/#temp_${tagIds.join('')}`)
            }
          >
            <T component="filter" name="watchToastAction" />
          </a>
        ]}
      />,
      {pauseOnHover: true}
    );

    this.props.addPin(newBelt);
  };

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

    const noResultsMessage = <T component="filter" name="noSearchMatch" />;

    const pinStatus = this.props.belts[
      `pin: ${this.props.plainSelectedTagIds.join(', ')}`
    ];

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
          <div className="filter-page-resultCount text-left d-flex justify-content-between">
            <Heading Tag="h4" type="lead">
              {resultCount === 0 ? (
                noResultsMessage
              ) : (
                <T component="filter" name="suggestions" />
              )}
            </Heading>
            {!this.props.loadingBelts &&
              this.props.plainSelectedTagIds.length > 0 && (
                <Pin
                  active={pinStatus}
                  text={T({
                    component: 'filter',
                    name: pinStatus ? 'pinAdded' : 'pinAdd'
                  })}
                  notLoggedIncontext={{
                    title: <T component="filter" name="pinLoginModalTitle" />,
                    reason: (
                      <T component="filter" name="pinLoginModalDescription" />
                    )
                  }}
                  onClick={this.onPinClick}
                />
              )}
          </div>

          <div
            className="filter-page-works"
            ref={container => (this.refs = {...this.refs, container})}
          >
            {resultCount > 0 && rows > 0 ? (
              <Results
                rows={rows}
                pids={structuredPids}
                rid={this.props.rid}
                enableHover={true}
                allowFetch={true}
                hideMoreLikeThis={false}
                onMoreLikeThisClick={(work, rowId) =>
                  this.onMoreLikeThisClick(work, rowId)
                }
                onWorkClick={(work, rowId) => this.onWorkClick(work, rowId)}
                belts={this.props.belts}
                cardRef={workCard => (this.refs = {...this.refs, workCard})}
                rowRef={(e, idx) => (this.refs[`row-${idx}`] = e)}
                origin={T({
                  component: 'filter',
                  name: 'filterOrigin',
                  vars: [this.props.selectedTags.map(t => t.title).join(', ')]
                })}
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
    rid: recommendedPids.rid,
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
    belts: state.beltsReducer.belts,
    loadingBelts: state.beltsReducer.loadingBelts,
    isLoggedIn: state.userReducer.isLoggedIn
  };
};
export const mapDispatchToProps = dispatch => ({
  scrollToComponent: id =>
    dispatch({
      type: SCROLL_TO_COMPONENT,
      id
    }),
  toggleFilter: id => dispatch({type: TOGGLE_FILTER, id}),
  editFilterToggle: () => dispatch({type: ON_EDIT_FILTER_TOGGLE}),
  expandFiltersToggle: id => dispatch({type: ON_EXPAND_FILTERS_TOGGLE, id}),
  history: (type, path, params = {}) => {
    dispatch({type, path, params});
  },
  onSearch: query =>
    dispatch({type: 'SEARCH_QUERY', query: query.toLowerCase()}),
  fetchRecommendations: tags =>
    dispatch({
      type: TAGS_RECOMMEND_REQUEST,
      tags,
      max: 100 // we ask for many recommendations, since client side filtering may reduce the actual result significantly
    }),
  addPin: belt => dispatch(storeBelt(belt)),
  removePin: belt => dispatch(removeBelt(belt)),
  addBelt: (belt, rid) => {
    dispatch({
      type: ADD_BELT,
      belt,
      rid
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
