import React from 'react';
import {connect} from 'react-redux';
import SelectedFilters from './SelectedFilters.component';
import EditFilters from './EditFilters.component';
import WorkItem from '../work/WorkItemConnected.component';
import Spinner from '../general/Spinner.component';
import {
  ON_EDIT_FILTER_TOGGLE,
  ON_EXPAND_FILTERS_TOGGLE
} from '../../redux/filter.reducer';
import {HISTORY_REPLACE} from '../../redux/middleware';
import {RECOMMEND_REQUEST} from '../../redux/recommend';
import {getRecommendedBooks} from '../../redux/selectors';
import {filtersMapAll} from '../../redux/filter.reducer';
import {isEqual} from 'lodash';

class FilterPage extends React.Component {
  toggleFilter(filterId) {
    const {selectedTagIds} = this.props;
    const tags = selectedTagIds.includes(filterId)
      ? selectedTagIds.filter(id => filterId !== id)
      : [...selectedTagIds, filterId];
    this.props.historyReplace('/find', {tag: tags});
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
      this.props.fetchRecommendations(this.props.selectedTagIds);
      // console.log('fetching');
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
                origin={`Fra din søgning på ${this.props.selectedTags
                  .map(t => t.title)
                  .join(', ')}`}
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
const mapStateToProps = state => {
  const selectedTagIds = state.routerReducer.params.tag
    ? state.routerReducer.params.tag
        .map(id => parseInt(id, 10))
        .filter(id => filtersMapAll[id])
    : [];
  return {
    recommendations: getRecommendedBooks(state, selectedTagIds, 40),
    selectedTagIds,
    selectedTags: selectedTagIds.map(tag => filtersMapAll[tag.id || tag]),
    filters: state.filterReducer.filters,
    editFilters: state.filterReducer.editFilters,
    expandedFilters: state.filterReducer.expandedFilters
  };
};
export const mapDispatchToProps = dispatch => ({
  editFilterToggle: () => dispatch({type: ON_EDIT_FILTER_TOGGLE}),
  expandFiltersToggle: id => dispatch({type: ON_EXPAND_FILTERS_TOGGLE, id}),
  historyReplace: (path, params) => {
    dispatch({
      type: HISTORY_REPLACE,
      path,
      params
    });
  },
  fetchRecommendations: tags =>
    dispatch({
      type: RECOMMEND_REQUEST,
      tags,
      max: 100 // we ask for many recommendations, since client side filtering may reduce the actual result significantly
    })
});
export default connect(mapStateToProps, mapDispatchToProps)(FilterPage);
