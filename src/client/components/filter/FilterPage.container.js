import React from 'react';
import {connect} from 'react-redux';
import SelectedFilters from './SelectedFilters.component';
import EditFilters from './EditFilters.component';
import WorkItem from '../work/WorkItem.component';
import BootstrapDropDown from './BootstrapDropdown.component';
import {ON_SORT_OPTION_SELECT, ON_EDIT_FILTER_TOGGLE, ON_FILTER_TOGGLE, ON_RESET_FILTERS, ON_EXPAND_FILTERS_TOGGLE} from '../../redux/filter.reducer';
import {ON_BELT_REQUEST} from '../../redux/belts.reducer';
import {getLeaves} from '../../utils/filters';
import {HISTORY_PUSH, HISTORY_REPLACE} from '../../redux/middleware';
import {beltNameToPath} from '../../utils/belt';

class FilterPage extends React.Component {

  toggleFilter(filterId) {

    const allowedFilterIds = getLeaves(this.props.filterState.filters).map(f => f.id);

    // if this is not part of the allowed filters, we will not continue
    // otherwise hell is upon us (we'll end up in an endless loop)
    if (allowedFilterIds.indexOf(filterId) < 0) {
      return;
    }

    const selectedFilterIds = this.props.filterState.beltFilters[this.props.belt.name];
    const isRemoving = selectedFilterIds && selectedFilterIds.indexOf(filterId) >= 0;
    const queryParams = this.props.routerState.params;
    const isQueryParam = queryParams && queryParams.filter && queryParams.filter.indexOf(filterId) >= 0;

    // we might need to remove filter from query parameters
    if (isRemoving && isQueryParam) {
      this.props.dispatch({type: HISTORY_REPLACE,
        path: beltNameToPath(this.props.belt.name),
        params: Object.assign({}, queryParams, {filter: queryParams.filter.filter(id => id !== filterId)})
      });
    }
    this.props.dispatch({type: ON_FILTER_TOGGLE, filterId, beltName: this.props.belt.name});
    this.props.dispatch({type: ON_BELT_REQUEST, beltName: this.props.belt.name});
  }

  handleTagsFromQueryParams() {
    const selectedFilterIds = this.props.filterState.beltFilters[this.props.belt.name];
    if (this.props.routerState.params.filter) {
      this.props.routerState.params.filter.forEach(id => {
        if (selectedFilterIds.indexOf(id) < 0) {
          this.toggleFilter(id);
        }
      });
    }
  }

  componentDidMount() {
    // Fetch works for belt
    this.props.dispatch({type: ON_BELT_REQUEST, beltName: this.props.belt.name});
    this.handleTagsFromQueryParams();
  }

  componentDidUpdate() {
    this.handleTagsFromQueryParams();
  }

  render() {
    const allFilters = getLeaves(this.props.filterState.filters);
    const selectedFilters = this.props.filterState.beltFilters[this.props.belt.name].map(id => allFilters.find(filter => filter.id === id));
    let warningMessage = null;
    if (!this.props.belt.works || this.props.belt.works.length === 0) {
      warningMessage = 'De valgte filtre giver tomt resultat';
    }
    return (
      <div className='filter-page'>
        <div className='filters row'>
          <div className='filter-page-top col-xs-12'>
            <div className='filter-page-title text-left col-xs-12'>
              <span>Vis mig</span>
              <BootstrapDropDown
                id='belt-select'
                selected={this.props.belt.name}
                options={this.props.beltState.belts.map(b => b.name)}
                onChange={value => {
                  this.props.dispatch({type: HISTORY_PUSH, path: beltNameToPath(value)});
                  this.props.dispatch({type: ON_BELT_REQUEST, beltName: value});
                }}/>
              <span className='reset-filters' onClick={() => {
                this.props.dispatch({type: ON_RESET_FILTERS, beltName: this.props.belt.name});
                this.props.dispatch({type: ON_BELT_REQUEST, beltName: this.props.belt.name});
              }}>Nulstil filtre</span>
            </div>
            <SelectedFilters
              selectedFilters={selectedFilters}
              filters={this.props.filterState.filters}
              edit={this.props.filterState.editFilters}
              sortBy={this.props.filterState.sortBy}
              onEditFilterToggle={() => {
                this.props.dispatch({type: ON_EDIT_FILTER_TOGGLE});
              }}
              onFilterToggle={(filter) => {
                this.toggleFilter(filter.id);
              }}/>
            <div className='sort-options col-xs-12 text-right'>
              <span>Sortér efter</span>
              <BootstrapDropDown
                id='sort-select'
                selected={this.props.filterState.sortBy.find(o => o.selected).title}
                options={this.props.filterState.sortBy.map(s => s.title)}
                onChange={value => {
                  this.props.dispatch({type: ON_SORT_OPTION_SELECT, value});
                  this.props.dispatch({type: ON_BELT_REQUEST, beltName: this.props.belt.name});
                }}/>
            </div>
          </div>
          <EditFilters edit={this.props.filterState.editFilters}
            filters={this.props.filterState.filters}
            selectedFilters={selectedFilters}
            expandedFilters={this.props.filterState.expandedFilters}
            onFilterToggle={(filter) => {
              this.toggleFilter(filter.id);
            }}
            onEditFilterToggle={() => {
              this.props.dispatch({type: ON_EDIT_FILTER_TOGGLE});
            }}
            onExpandFiltersToggle={id => {
              this.props.dispatch({type: ON_EXPAND_FILTERS_TOGGLE, id});
            }}/>
        </div>
        {warningMessage && <div className='warning row text-center'>{warningMessage}</div>}
        <div className='filter-page-works row text-left'>
          {this.props.belt.works && this.props.belt.works.map((work, idx) => {
            return <WorkItem
              id={`work-${idx}`}
              key={work.book.pid}
              onCoverClick={(pid) => this.props.dispatch({type: HISTORY_PUSH, path: `/værk/${pid}`})}
              work={work}/>;
          })}
        </div>
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  (state) => {
    return {filterState: state.filterReducer,
      beltState: state.beltsReducer,
      routerState: state.routerReducer};
  }
)(FilterPage);
