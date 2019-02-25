import React from 'react';
import TagsSuggester from './TagsSuggester.component';
import Icon from '../base/Icon';
import Button from '../base/Button';
import withTagsFromUrl from '../base/AdressBar/withTagsFromUrl.hoc';
import withWork from '../base/Work/withWork.hoc';

const SelectedWork = withWork(({selected, work, onRemove}) => (
  <Button Tag="div" size="medium" type="term" className={`selected-filter`}>
    <span>{work && work.book.title}</span>
    <Icon
      className="md-small"
      name="close"
      onClick={() => onRemove(selected.match)}
    />
  </Button>
));

//TODO create withTag, because we might fetch tag from id async in the near future?
const SelectedTag = ({selected, onRemove}) => (
  <Button Tag="div" size="medium" type="term" className={`selected-filter`}>
    <span>{selected.title}</span>
    <Icon
      className="md-small"
      name="close"
      onClick={() => onRemove(selected.match)}
    />
  </Button>
);
const SelectedQuery = ({selected, onRemove}) => (
  <Button Tag="div" size="medium" type="term" className={`selected-filter`}>
    <span>{selected.query}</span>
    <Icon
      className="md-small"
      name="close"
      onClick={() => onRemove(selected.match)}
    />
  </Button>
);

class SelectedFilters extends React.Component {
  renderSelected = selected => {
    switch (selected.type) {
      case 'TAG':
        return (
          <SelectedTag
            selected={selected}
            onRemove={this.props.toggleSelected}
          />
        );
      case 'TITLE':
        return (
          <SelectedWork
            pid={selected.pid}
            selected={selected}
            onRemove={this.props.toggleSelected}
          />
        );
      case 'QUERY':
        return (
          <SelectedQuery
            selected={selected}
            onRemove={this.props.toggleSelected}
          />
        );
      default:
        return null;
    }
  };

  render() {
    return (
      <React.Fragment>
        <div
          className="selected-filters-wrap text-left"
          id="selected-filters-wrap"
          ref={this.props.filtersRef}
          onWheel={this.props.onFiltersScroll}
        >
          <TagsSuggester
            selectedFilters={this.props.selectedFilters}
            filters={this.props.filters}
            value={this.props.query}
            onKeyDown={this.props.onKeyDown}
            onFocus={this.props.onFocus}
            onChange={this.props.onQueryChange}
            onSuggestionSelected={(e, {suggestion}) =>
              this.props.onFilterToggle(suggestion)
            }
          />
          <div id="selectedFilters" className="selected-filters">
            {this.props.tags.map((filter, idx) => this.renderSelected(filter))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default withTagsFromUrl(SelectedFilters);
