import React from 'react';
import TagsSuggester from './TagsSuggester.component';
import Kryds from '../svg/KrydsWhite.svg';

const SelectedFilter = props => {
  return (
    <div className="selected-filter">
      {props.filter.title}
      <span
        onClick={() => {
          props.onDisableFilter(props.filter);
        }}
      >
        <img style={{width: 10}} src={Kryds} alt="remove" />
      </span>
    </div>
  );
};

class SelectedFilters extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    if (this.props.selectedFilters.length === 0) {
      this.autosuggestRef.input.focus();
    }
  }

  render() {
    return (
      <div className="selected-filters text-left col-xs-12">
        {this.props.selectedFilters.map((filter, idx) => {
          return (
            <SelectedFilter
              key={idx}
              filter={filter}
              onDisableFilter={this.props.onFilterToggle}
            />
          );
        })}
        <TagsSuggester
          autosuggestRef={r => {
            this.autosuggestRef = r;
          }}
          value={this.props.query}
          onFocus={this.props.onFocus}
          onChange={this.props.onQueryChange}
          onSuggestionSelected={(e, {suggestion}) => {
            this.props.onFilterToggle(suggestion);
          }}
        />
        <hr />
      </div>
    );
  }
}
export default SelectedFilters;
