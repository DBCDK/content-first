import React from 'react';
import {connect} from 'react-redux';
import SelectedFilters from './SelectedFilters.component';
import EditFilters from './EditFilters.component';
import WorkItem from '../work/WorkItem.component';
import BootstrapDropDown from './BootstrapDropdown.component';
import AddToListModal from '../list/AddToListModal.component';
import {ON_SORT_OPTION_SELECT, ON_EDIT_FILTER_TOGGLE, ON_FILTER_TOGGLE, ON_RESET_FILTERS, ON_EXPAND_FILTERS_TOGGLE} from '../../redux/filter.reducer';
import {ON_BELT_REQUEST} from '../../redux/belts.reducer';
import {ON_SHORTLIST_TOGGLE_ELEMENT} from '../../redux/shortlist.reducer';
import {ADD_ELEMENT_TO_LIST, LIST_TOGGLE_ELEMENT, ADD_LIST} from '../../redux/list.reducer';
import {getLeaves} from '../../utils/filters';
import {HISTORY_PUSH, HISTORY_REPLACE} from '../../redux/middleware';
import {beltNameToPath} from '../../utils/belt';

class FilterPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      addToList: null
    };
  }

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
  }

  handleTagsFromQueryParams() {
    let didChange = false;
    const selectedFilterIds = this.props.filterState.beltFilters[this.props.belt.name];
    if (this.props.routerState.params.filter) {
      this.props.routerState.params.filter.forEach(id => {
        if (selectedFilterIds.indexOf(id) < 0) {
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
      this.props.dispatch({type: ON_BELT_REQUEST, beltName: this.props.belt.name});
    }
  }

  componentDidUpdate(prevProps) {
    this.handleTagsFromQueryParams();

    // Check if we need to fetch works
    if (prevProps.filterState.beltFilters[this.props.belt.name] !== this.props.filterState.beltFilters[this.props.belt.name]
      || prevProps.belt.name !== this.props.belt.name
      || prevProps.filterState.sortBy !== this.props.filterState.sortBy) {
      this.props.dispatch({type: ON_BELT_REQUEST, beltName: this.props.belt.name});
    }
  }

  render() {
    const allFilters = getLeaves(this.props.filterState.filters);
    const selectedFilters = this.props.filterState.beltFilters[this.props.belt.name].map(id => allFilters.find(filter => filter.id === id));
    const remembered = {};
    this.props.shortListState.elements.forEach(e => {
      remembered[e.book.pid] = true;
    });
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
              idx={idx}
              id={`work-${idx}`}
              key={work.book.pid}
              isLoggedIn={this.props.profileState.user.isLoggedIn}
              work={work}
              lists={this.props.listState.lists}
              onCoverClick={(pid) => this.props.dispatch({type: HISTORY_PUSH, path: `/værk/${pid}`})}
              onRememberClick={(element) => {
                this.props.dispatch({type: ON_SHORTLIST_TOGGLE_ELEMENT, element, origin: `Fra "${this.props.belt.name}"`});
              }}
              marked={remembered[work.book.pid]}
              onAddToList={list => {
                this.props.dispatch({type: LIST_TOGGLE_ELEMENT, id: list.id, element: work});
              }}
              onAddToListOpenModal={() => this.setState({addToList: work})} />;
          })}
        </div>
        <AddToListModal
          show={this.state.addToList}
          work={this.state.addToList}
          lists={this.props.listState.lists}
          onClose={() => this.setState({addToList: null})}
          onDone={(work, comment, list) => {
            this.props.dispatch({type: ADD_ELEMENT_TO_LIST, id: list.id, element: work});
            this.setState({addToList: null});
          }}
          onAddList={(listName) => this.props.dispatch({type: ADD_LIST, list: {title: listName, list: []}})}/>
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  (state) => {
    return {filterState: state.filterReducer,
      beltState: state.beltsReducer,
      routerState: state.routerReducer,
      shortListState: state.shortListReducer,
      listState: state.listReducer,
      profileState: state.profileReducer};
  }
)(FilterPage);
