import React from 'react';
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import ToastMessage from '../base/ToastMessage';
import T from '../base/T';
import SelectedFilters from './SelectedFilters.component';
import {TOGGLE_FILTER} from '../../redux/filter.reducer';
import {HISTORY_REPLACE} from '../../redux/middleware';
import {BOOKS_REQUEST} from '../../redux/books.reducer';
import {
  getRecommendedBooks,
  getTagsFromUrl,
  getCreatorsFromUrl,
  getTitlesFromUrl,
  getIdsFromRange,
  getTagsbyIds
} from '../../redux/selectors';
import {REORGANIZE_FILTERPAGE_BELTS} from '../../redux/belts.reducer';

import './SearchBar.css';

class SearchBar extends React.Component {
  componentDidMount() {
    this.initFilterPosition();
  }

  constructor() {
    super();
    this.state = {query: '', expanded: false};
  }

  toggleFilter(filterId) {
    this.props.toggleFilter(filterId);
  }

  triggerCancelToast(historyPath, historyParams) {
    toast(
      <ToastMessage
        type="info"
        icon="history"
        lines={[
          T({component: 'filter', name: 'newSearchToast'}),
          <a
            onClick={() =>
              this.props.historyReplace(historyPath, historyParams)
            }
          >
            <T component="general" name="back" />
          </a>
        ]}
      />,
      {hideProgressBar: false, pauseOnHover: true}
    );
  }

  onFiltersMouseWheelScrool(e) {
    e.preventDefault();
    let scrollSpeed = 40;
    /* eslint-disable no-unused-expressions */
    e.deltaY > 0
      ? (this.filtersRef.scrollLeft += scrollSpeed)
      : (this.filtersRef.scrollLeft -= scrollSpeed);
    /* eslint-enable no-unused-expressions */
  }

  initFilterPosition() {
    if (this.filtersRef) {
      this.filtersRef.scrollLeft = 99999999;
    }
  }

  handleOnKeyDown(e) {
    let tags = this.props.selectedTagIds;
    /* Hvis der er tags i url */
    if (tags.length > 0) {
      /* Hvis brugeren trykker backspace */
      if (e.keyCode === 8) {
        /* Hvis brugeren ikke er igang med at skrive et ord */
        if (this.state.query === '') {
          this.props.toggleFilter(tags[tags.length - 1]);
          this.initFilterPosition();
        }
      }
    }
  }

  render() {
    return (
      <SelectedFilters
        filtersRef={r => {
          this.filtersRef = r;
        }}
        onFiltersScroll={e => this.onFiltersMouseWheelScrool(e)}
        selectedFilters={this.props.selectedTags}
        selectedTags={this.props.selectedTagIds}
        transition={this.props.transition}
        filters={this.props.filters}
        edit={this.state.expanded}
        onEditFilterToggle={this.props.editFilterToggle}
        query={this.state.query}
        onQueryChange={e => this.setState({query: e.target.value})}
        onFilterToggle={filter => {
          this.toggleFilter(filter);
        }}
        onKeyDown={e => this.handleOnKeyDown(e)}
        onFocus={() => {
          this.setState({expanded: true});
          this.initFilterPosition();
        }}
      />
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

  return {
    recommendedPids: getRecommendedBooks(state, plainSelectedTagIds, 300),
    filterCards,
    router: state.routerReducer,
    transition: state.routerReducer.params.transition || false,
    selectedTagIds: mergedSelectedTags,
    plainSelectedTagIds,
    selectedTags: selectedTags.length > 0 ? selectedTags : mergedSelectedTags,
    filters: state.filterReducer.filters,
    editFilters: state.filterReducer.editFilters,
    expandedFilters: state.filterReducer.expandedFilters
  };
};
export const mapDispatchToProps = dispatch => ({
  toggleFilter: id => dispatch({type: TOGGLE_FILTER, id}),
  historyReplace: (path, params) => {
    dispatch({
      type: HISTORY_REPLACE,
      path,
      params
    });
  },
  onSearch: query =>
    dispatch({type: 'SEARCH_QUERY', query: query.toLowerCase()}),
  fetchWorks: pids =>
    dispatch({
      type: BOOKS_REQUEST,
      pids: pids
    }),
  reorganizeBelts: () => {
    dispatch({type: REORGANIZE_FILTERPAGE_BELTS});
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBar);
