import React from 'react';
import {connect} from 'react-redux';
import SelectedFilters from './SelectedFilters.component';
import EditFilters from './EditFilters.component';
import WorkItem from '../work/WorkItemConnected.component';
import Spinner from '../general/Spinner.component';
import BootstrapDropDown from './BootstrapDropdown.component';
import {
  ON_EDIT_FILTER_TOGGLE,
  ON_FILTER_TOGGLE,
  ON_RESET_FILTERS,
  ON_EXPAND_FILTERS_TOGGLE
} from '../../redux/filter.reducer';
import {HISTORY_PUSH, HISTORY_REPLACE} from '../../redux/middleware';
import {beltNameToPath} from '../../utils/belt';
import {RECOMMEND_REQUEST} from '../../redux/recommend';
import {getRecommendedBooks} from '../../redux/selectors';
import {filtersMap, filterIds} from '../../redux/filter.reducer';

class FilterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addToList: null
    };
  }

  toggleFilter(filterId) {
    const {filterIdList, selectedTagIds, queryFilters} = this.props;

    // if this is not part of the allowed filters, we will not continue
    // otherwise hell is upon us (we'll end up in an endless loop)
    if (filterIdList.indexOf(filterId) < 0) {
      return;
    }

    const isRemoving = selectedTagIds && selectedTagIds.indexOf(filterId) >= 0;
    const isQueryParam = queryFilters.indexOf(filterId) >= 0;

    // we might need to remove filter from query parameters
    if (isRemoving && isQueryParam) {
      this.props.historyReplace(
        beltNameToPath(this.props.belt.name),
        queryFilters.filter(id => id !== filterId)
      );
    }
    this.props.filterToggle(filterId);
  }

  handleTagsFromQueryParams() {
    const {selectedTagIds, queryFilters} = this.props;
    let didChange = false;

    if (queryFilters) {
      queryFilters.forEach(id => {
        if (selectedTagIds.indexOf(id) < 0) {
          this.toggleFilter(id);
          didChange = true;
        }
      });
    }
    return didChange;
  }

  componentDidMount() {
    // if query params changes the state, we will not
    // make belt request, since it will be done at the next componentDidUpdate
    if (!this.handleTagsFromQueryParams()) {
      this.props.fetchRecommendations(this.props.selectedTagIds);
    }
  }

  componentDidUpdate(prevProps) {
    this.handleTagsFromQueryParams();

    // Check if we need to fetch works
    if (prevProps.selectedTagIds !== this.props.selectedTagIds) {
      this.props.fetchRecommendations(this.props.selectedTagIds);
    }
  }

  render() {
    let warningMessage = null;
    if (
      this.props.recommendations.books.length === 0 &&
      !this.props.recommendations.isLoading
    ) {
      warningMessage = 'De valgte filtre giver tomt resultat';
    }
    return (
      <div className="filter-page">
        <div className="filters row">
          <div className="filter-page-top col-xs-12">
            <div className="filter-page-title text-left col-xs-12">
              <span>Vis mig</span>
              <BootstrapDropDown
                id="belt-select"
                selected={this.props.belt.name}
                options={this.props.belts.map(b => b.name)}
                onChange={this.props.beltChange}
              />
              <span className="reset-filters" onClick={this.props.resetFilters}>
                Nulstil filtre
              </span>
            </div>
            <SelectedFilters
              selectedFilters={this.props.selectedTags}
              filters={this.props.filters}
              edit={this.props.editFilters}
              onEditFilterToggle={this.props.editFilterToggle}
              onFilterToggle={filter => {
                this.toggleFilter(filter.id);
              }}
            />
          </div>
          <EditFilters
            edit={this.props.editFilters}
            filters={this.props.filters}
            selectedFilters={this.props.selectedTags}
            expandedFilters={this.props.expandedFilters}
            onFilterToggle={filter => {
              this.toggleFilter(filter.id);
            }}
            onEditFilterToggle={this.props.editFilterToggle}
            onExpandFiltersToggle={this.props.expandFiltersToggle}
          />
        </div>
        {warningMessage && (
          <div className="warning row text-center">{warningMessage}</div>
        )}
        <div className="filter-page-works row text-left">
          {this.props.recommendations.books &&
            this.props.recommendations.books.map(work => (
              <WorkItem
                work={work}
                key={work.book.pid}
                origin={`Fra ${this.props.belt.name}`}
              />
            ))}
        </div>
        {this.props.recommendations.isLoading && (
          <Spinner style={{width: 50, height: 50}} />
        )}
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const selectedTagIds = state.filterReducer.beltFilters[ownProps.belt.name];
  return {
    filterState: state.filterReducer,
    belts: state.beltsReducer.belts,
    queryFilters:
      state.routerReducer.params && state.routerReducer.params.filter
        ? state.routerReducer.params.filter.map(f => parseInt(f, 10))
        : [],
    recommendations: getRecommendedBooks(state, selectedTagIds, 40),
    selectedTagIds,
    selectedTags: selectedTagIds.map(id => filtersMap[id]),
    filtersMap,
    filterIdList: filterIds,
    filters: state.filterReducer.filters,
    editFilters: state.filterReducer.editFilters,
    expandedFilters: state.filterReducer.expandedFilters
  };
};
export const mapDispatchToProps = (dispatch, ownProps) => ({
  editFilterToggle: () => dispatch({type: ON_EDIT_FILTER_TOGGLE}),
  expandFiltersToggle: id => dispatch({type: ON_EXPAND_FILTERS_TOGGLE, id}),
  filterToggle: filterId =>
    dispatch({
      type: ON_FILTER_TOGGLE,
      filterId,
      beltName: ownProps.belt.name
    }),
  beltChange: value =>
    dispatch({
      type: HISTORY_PUSH,
      path: beltNameToPath(value)
    }),
  historyReplace: (path, params) => {
    dispatch({
      type: HISTORY_REPLACE,
      path,
      params
    });
  },
  resetFilters: () =>
    dispatch({
      type: ON_RESET_FILTERS,
      beltName: ownProps.belt.name
    }),
  fetchRecommendations: tags =>
    dispatch({
      type: RECOMMEND_REQUEST,
      tags,
      max: 100 // we ask for many recommendations, since client side filtering may reduce the actual result significantly
    })
});
export default connect(mapStateToProps, mapDispatchToProps)(FilterPage);
