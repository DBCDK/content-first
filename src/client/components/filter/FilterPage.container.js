import React from 'react';
import {connect} from 'react-redux';
import Filters from './Filters.component';
import WorkItem from '../work/WorkItem.component';
import {ON_OPTION_SELECT} from '../../redux/filter.reducer';

class FilterPage extends React.Component {

  render() {
    const enabledFilters = this.props.filterState.enabledFilters.map(id => {
      return this.props.filterState.filters[id];
    });
    return (
      <div className='filter-page'>
        <div className='row top'>
          <div className='title text-left'>
            {this.props.belt.name}
          </div>
          <Filters filters={enabledFilters} onSelect={(filterTitle, value) => {
            this.props.dispatch({type: ON_OPTION_SELECT, filterTitle, value});
          }}/>
        </div>
        <div className='works'>
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
    return {filterState: state.filterReducer};
  }
)(FilterPage);
