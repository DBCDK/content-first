import React from 'react';
import TagsSuggester from './TagsSuggester.component';
import Slider from '../belt/Slider.component';
import Icon from '../base/Icon';
import Button from '../base/Button';

const SelectedFilter = props => {
  return (
    <Button size="medium" type="tag" className="selected-filter">
      {props.filter.title}
      <Icon
        className="md-small"
        name="close"
        onClick={() => {
          props.onDisableFilter(props.filter);
        }}
      />
    </Button>
  );
};

class SelectedFilters extends React.Component {
  componentDidMount() {
    if (this.props.selectedFilters.length === 0) {
    }
    // if (this.autosuggestRef.input) {
    //   this.autosuggestRef.input.focus();
    // }
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="selected-filters-wrap text-left"
          ref={this.props.filtersRef}
          onWheel={this.props.onFiltersScroll}
        >
          <TagsSuggester
            autosuggestRef={r => {
              this.autosuggestRef = r;
            }}
            selectedFilters={this.props.selectedFilters}
            value={this.props.query}
            onFocus={this.props.onFocus}
            onChange={this.props.onQueryChange}
            onSuggestionSelected={(e, {suggestion}) =>
              this.props.onFilterToggle(suggestion)
            }
          />
          <div className="selected-filters">
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
