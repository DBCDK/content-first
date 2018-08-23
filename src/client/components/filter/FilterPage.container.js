import React from 'react';
import {connect} from 'react-redux';
import SelectedFilters from './SelectedFilters.component';
import EditFilters from './EditFilters.component';
import WorkCard from '../work/WorkCard.container';
import Spinner from '../general/Spinner.component';
import {
  ON_EDIT_FILTER_TOGGLE,
  ON_EXPAND_FILTERS_TOGGLE
} from '../../redux/filter.reducer';
import {HISTORY_REPLACE} from '../../redux/middleware';
import {RECOMMEND_REQUEST, getRecommendedPids} from '../../redux/recommend';
import {filtersMapAll} from '../../redux/filter.reducer';
import {isEqual} from 'lodash';

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
      this.props.recommendedPids.pids.length === 0 &&
      !this.props.recommendedPids.isLoading
    ) {
      warningMessage = 'De valgte filtre giver tomt resultat';
    }
    return (
      <div className="filter-page">
        <div className="filters row">
          <div className="filter-page-top col-12">
            <SelectedFilters
              selectedFilters={this.props.selectedTags}
              filters={this.props.filters}
              edit={this.state.expanded}
              onEditFilterToggle={this.props.editFilterToggle}
              query={this.state.query}
              onQueryChange={e => this.setState({query: e.target.value})}
              onFilterToggle={filter => {
                this.toggleFilter(filter.id);
              }}
              onFocus={() => this.setState({expanded: true})}
            />
          </div>
          <EditFilters
            showTags={!this.state.query}
            edit={this.state.expanded}
            filters={this.props.filters}
            selectedFilters={this.props.selectedTags}
            expandedFilters={this.props.expandedFilters}
            onFilterToggle={filter => {
              this.toggleFilter(filter.id);
            }}
            onEditFilterToggle={() => this.setState({expanded: false})}
            onExpandFiltersToggle={this.props.expandFiltersToggle}
          />
        </div>
        {warningMessage && (
          <div className="warning row text-center">{warningMessage}</div>
        )}
        <div className="filter-page-works row text-left">
          {this.props.recommendedPids.pids.length > 0 &&
            this.props.recommendedPids.pids.map(pid => (
              <WorkCard
                className="ml1 mr1"
                pid={pid}
                key={pid}
                allowFetch={true}
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
  const selectedTagIds = state.routerReducer.params.tag
    ? state.routerReducer.params.tag
        .map(id => parseInt(id, 10))
        .filter(id => filtersMapAll[id])
    : [];
  return {
    recommendedPids: getRecommendedPids(state.recommendReducer, {
      tags: selectedTagIds
    }),
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterPage);
