import React from 'react';
import {connect} from 'react-redux';
import SelectedFilters from './SelectedFilters.component';
import {filtersMapAll} from '../../redux/filter.reducer';
import {HISTORY_REPLACE} from '../../redux/middleware';
import {getRecommendedPids} from '../../redux/recommend';
import {
  getTagsFromUrl,
  getIdsFromRange,
  getTagsbyIds
} from '../../redux/selectors';

import './SearchBar.css';

class SearchBar extends React.Component {
  componentDidMount() {
    this.initFilterPosition();
  }

  componentDidUpdate() {
    this.initFilterPosition();
  }

  constructor() {
    super();
    this.state = {query: '', expanded: false};
  }

  toggleFilter(filterId) {
    const {selectedTagIds, filterCards} = this.props;

    const filter = filtersMapAll[filterId] || filtersMapAll[filterId[0]];
    const parent = filtersMapAll[filter.id].parents[0];
    const range = (filterCards[parent] && filterCards[parent].range) || false;
    let urlRange = [];
    let posInSelectedTagIds = false;
    let tags = [...selectedTagIds];

    if (range) {
      /* id is part of a range */
      if (selectedTagIds.length === 0) {
        /* Add new range if non tags in curent url */
        tags = [...selectedTagIds, filterId + ',' + filterId];
      } else if (selectedTagIds.filter(t => t instanceof Array).length === 0) {
        /* if non existing arrays in URL - add*/
        tags = [...selectedTagIds, filterId + ',' + filterId];
      } else {
        /* if tag exist in url and there is an existing range */
        selectedTagIds.forEach((id, idx) => {
          let existInUrl = range.includes(id[0]) || range.includes(id);

          if (existInUrl) {
            /* if exist in url grab position in selectedTagIds array */
            posInSelectedTagIds = idx;
            urlRange = selectedTagIds[idx];

            if (JSON.stringify(filterId) === JSON.stringify(urlRange)) {
              /* If exactly same range - trigger toggle (remove tag) */
              selectedTagIds.splice(posInSelectedTagIds, 1);
            } else {
              /* if new range and existing range is different check if the
                lower or uppper range cursor should be moved by calculating
                the difference between the positions (Which range cursor is
                closest) */

              /* MAX lower and upper range */
              const rangeMin = 0;
              const rangeMax = range.length - 1;

              /* existing range in URL */
              const urlRangeMin = range.indexOf(urlRange[0] || urlRange);
              const urlRangeMax = range.indexOf(urlRange[1] || urlRange);

              /* new range from id*/
              const idRangeMin = range.indexOf(filterId[0] || filterId);
              const idRangeMax = range.indexOf(filterId[1] || filterId);

              /* Diff calcualtion */
              const urlDiffMin = Math.abs(urlRangeMin - rangeMin);
              const urlDiffMax = Math.abs(rangeMax - urlRangeMax);

              const idDiffMin = Math.abs(idRangeMin - rangeMin);
              const idDiffMax = Math.abs(rangeMax - idRangeMax);

              const diffMax = Math.abs(urlDiffMax - idDiffMax);
              const diffMin = Math.abs(urlDiffMin - idDiffMin);

              let newRange = urlRange;
              const newRangeValue = filterId[0] || filterId;

              if (diffMin === 0 || diffMax === 0) {
                /* adjust upper & lower range to same tag */
                newRange[0] = newRangeValue;
                newRange[1] = newRangeValue;
              } else if (diffMin < diffMax) {
                /* adjust lower range */
                newRange[0] = newRangeValue;
              } else if (diffMin === diffMax) {
                if (urlDiffMax - idDiffMax > 0) {
                  /* adjust upper range */
                  newRange[1] = newRangeValue;
                } else {
                  /* adjust lower range */
                  newRange[0] = newRangeValue;
                }
              } else {
                /* adjust upper range */
                newRange[1] = newRangeValue;
              }

              const newRangeMin = range.indexOf(newRange[0]);
              const newRangeMax = range.indexOf(newRange[1]);

              if (!(newRangeMin === rangeMin && newRangeMax === rangeMax)) {
                selectedTagIds[posInSelectedTagIds] = newRange;
              } else {
                selectedTagIds.splice(posInSelectedTagIds, 1);
              }
            }

            tags = [...selectedTagIds];
          } else if (
            !selectedTagIds.includes(filterId) &&
            !range.includes(filterId)
          ) {
            const newTag = filterId + ',' + filterId;
            tags = [...selectedTagIds, newTag];
          } else {
            tags = [...selectedTagIds];
          }
        });
      }
    } else {
      tags = selectedTagIds.includes(filterId)
        ? selectedTagIds.filter(id => filterId !== id)
        : [...selectedTagIds, filterId];
    }
    this.props.historyReplace('/find', {tag: tags});
    this.initFilterPosition();
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
          this.toggleFilter(filter.id || filter);
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
  const filterCards = state.filtercardReducer;
  const selectedTagIds = getTagsFromUrl(state);
  const plainSelectedTagIds = getIdsFromRange(state, selectedTagIds);

  return {
    recommendedPids: getRecommendedPids(state.recommendReducer, {
      tags: plainSelectedTagIds
    }),
    filterCards,
    selectedTagIds,
    plainSelectedTagIds,
    selectedTags: getTagsbyIds(state, selectedTagIds),
    filters: state.filterReducer.filters,
    editFilters: state.filterReducer.editFilters,
    expandedFilters: state.filterReducer.expandedFilters
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
