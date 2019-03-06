import React from 'react';
import TagsSuggester from './TagsSuggester.component';
import Icon from '../base/Icon';
import Button from '../base/Button';

const SelectedFilter = props => {
  let title = props.filter.title || props.filter;
  let id = props.filter;

  if (props.filter instanceof Array) {
    /* Capitalize first letter for each in range */
    const first = props.filter[0].title.replace(/^\w/, c => c.toUpperCase());
    const last = props.filter[1].title.replace(/^\w/, c => c.toUpperCase());

    title = first === last ? first : first + ' - ' + last;
    id = [props.filter[0].id, props.filter[1].id];
  }

  if (typeof props.filter === 'string' || props.filter instanceof String) {
    id = {text: props.filter, parents: ['', 'Forfatter']};
  }

  return (
    <Button Tag="div" size="medium" type="term" className={`selected-filter`}>
      <span>{title}</span>
      <Icon
        className="md-small"
        name="close"
        onClick={() => props.onDisableFilter(id)}
      />
    </Button>
  );
};

class SelectedFilters extends React.Component {
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
            {this.props.selectedFilters.map((filter, idx) => {
              return (
                <SelectedFilter
                  key={idx}
                  filter={filter}
                  onDisableFilter={this.props.onFilterToggle}
                />
              );
            })}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SelectedFilters;
