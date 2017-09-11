import React from 'react';
import {connect} from 'react-redux';
import SelectedFilters from './SelectedFilters.component';
import EditFilters from './EditFilters.component';
import WorkItem from '../work/WorkItem.component';
import DropDown from './Dropdown.component';
import {ON_SORT_OPTION_SELECT, ON_EDIT_FILTER_TOGGLE, ON_FILTER_TOGGLE, ON_RESET_FILTERS} from '../../redux/filter.reducer';
import {getLeaves} from '../../utils/filters';
import {HISTORY_PUSH} from '../../redux/middleware';
import {beltNameToPath} from '../../utils/belt';

class FilterPage extends React.Component {

  render() {
    const allFilters = getLeaves(this.props.filterState.filters);
    const selectedFilters = this.props.filterState.beltFilters[this.props.belt.name].map(id => allFilters[id]);
    return (
      <div className='filter-page'>
        <div className='filters row'>
          <div className='filter-page-top col-xs-12'>
            <div className='filter-page-title text-left col-xs-12'>
              <span>Vis mig</span>
              <DropDown
                className='filter-page-title'
                selected={this.props.belt.name}
                options={this.props.beltState.belts.map(b => b.name)}
                margin={5}
                onChange={value => {
                  this.props.dispatch({type: HISTORY_PUSH, path: beltNameToPath(value)});
                }}/>
              <span className='reset-filters' onClick={() => {
                this.props.dispatch({type: ON_RESET_FILTERS, beltName: this.props.belt.name});
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
                this.props.dispatch({type: ON_FILTER_TOGGLE, filter, beltName: this.props.belt.name});
              }}/>
            <div className='sort-options col-xs-12 text-right'>
              <span>Sortér efter</span>
              <DropDown
                className='sort-options'
                selected={this.props.filterState.sortBy.find(o => o.selected).title}
                options={this.props.filterState.sortBy.map(s => s.title)}
                margin={2}
                onChange={value => {
                  this.props.dispatch({type: ON_SORT_OPTION_SELECT, value});
                }}/>
            </div>
          </div>
          <EditFilters edit={this.props.filterState.editFilters}
            filters={this.props.filterState.filters}
            selectedFilters={selectedFilters}
            onFilterToggle={(filter) => {
              this.props.dispatch({type: ON_FILTER_TOGGLE, filter, beltName: this.props.belt.name});
            }}
            onEditFilterToggle={() => {
              this.props.dispatch({type: ON_EDIT_FILTER_TOGGLE});
            }}/>
        </div>
        <div className='filter-page-works row text-left'>
          {this.props.filterState.works && this.props.filterState.works.map((work, idx) => {
            return <WorkItem id={`work-${idx}`} key={idx} work={work} disableShadow={false}/>;
          })}
        </div>
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  (state) => {
    return {filterState: state.filterReducer, beltState: state.beltsReducer};
  }
)(FilterPage);
