import React from 'react';
import {connect} from 'react-redux';
import SelectedFilters from './SelectedFilters.component';
import {filtersMapAll} from '../../redux/filter.reducer';
import {HISTORY_REPLACE} from '../../redux/middleware';
import {getRecommendedPids} from '../../redux/recommend';
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
    const {selectedTagIds} = this.props;
    const tags = selectedTagIds.includes(filterId)
      ? selectedTagIds.filter(id => filterId !== id)
      : [...selectedTagIds, filterId];
    this.props.historyReplace('/find', {tag: tags});

    setTimeout(() => {
      this.initFilterPosition();
    }, 0);
  }

  onFiltersMouseWheelScrool(e) {
    e.preventDefault();
    const scrollSpeed = 40;
    e.deltaY > 0
      ? (this.filtersRef.scrollLeft += scrollSpeed)
      : (this.filtersRef.scrollLeft -= scrollSpeed);
  }

  initFilterPosition() {
    //this.filtersRef.scrollLeft = 99999999;
  }

  render() {
    return (
      <SelectedFilters
        filtersRef={r => {
          this.filtersRef = r;
        }}
        onFiltersScroll={e => this.onFiltersMouseWheelScrool(e)}
        selectedFilters={this.props.selectedTags}
        filters={this.props.filters}
        edit={this.state.expanded}
        onEditFilterToggle={this.props.editFilterToggle}
        query={this.state.query}
        onQueryChange={e => this.setState({query: e.target.value})}
        onFilterToggle={filter => {
          this.toggleFilter(filter.id);
        }}
        onFocus={() => {
          this.setState({expanded: true});
          this.initFilterPosition();
        }}
      />
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
    filters: state.filterReducer.filters
  };
};
export const mapDispatchToProps = dispatch => ({
  historyReplace: (path, params) => {
    dispatch({
      type: HISTORY_REPLACE,
      path,
      params
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
