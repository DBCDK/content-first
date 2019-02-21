import React from 'react';
import request from 'superagent';
import {uniqBy} from 'lodash';
import Autosuggest from 'react-autosuggest';

import Icon from '../base/Icon';
import T from '../base/T';

const getTypeData = suggestion => {
  switch (suggestion.type) {
    case 'TITLE':
      return {icon: 'book', category: 'bog'};
    case 'AUTHOR':
      return {icon: 'account_circle', category: 'forfatter'};
    case 'TAG':
      return {icon: 'label', category: suggestion.category};
    default:
      return {};
  }
};

const addEmphasisToString = (string, pattern) => {
  const index = string.toLowerCase().indexOf(pattern.toLowerCase());
  if (index >= 0) {
    const start = index > 0 ? string.slice(0, index) : '';
    const end = string.slice(index + pattern.length);
    const match = string.slice(index, index + pattern.length);
    return (
      <span>
        {start}
        <u>{match}</u>
        {end}
      </span>
    );
  }
  return string;
};

const renderSuggestion = (suggestion, suggestionString) => {
  const text = suggestion.text ? suggestion.text : suggestion.matchedTerm;
  const {icon, category} = getTypeData(suggestion);

  return (
    <div className="suggestion-title" data-cy="suggestion-element">
      {addEmphasisToString(text, suggestionString)}
      <Icon name={icon} className="md-small" />
      <span className="ml1 suggestion-subject">{category}</span>
    </div>
  );
};

const renderSectionTitle = section => {
  return <div className="section-title">{section.title}</div>;
};

class TagsSuggester extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      inputVisibel: false
    };
  }

  getClientSideSuggestions({value}) {
    const filters = this.props.filters;
    return filters.Længde.filter(l =>
      l.title.toLowerCase().includes(value)
    ).map(l => {
      return {
        id: l.id,
        type: 'TAG',
        matchedTerm: l.title,
        parents: ['', 'Længde']
      };
    });
  }

  fetchSuggestions = async ({value}) => {
    const response = await request.get('/v1/suggester').query({query: value});
    const clientSuggestions = this.getClientSideSuggestions({value});
    let suggestions = [...clientSuggestions, ...response.body];

    this.setState({suggestions});
  };

  onSuggestionsClearRequested = () => {
    this.setState({suggestions: []});
    this.props.onChange({target: {value: ''}});
  };

  toggleInputvisibility = status => {
    this.setState({inputVisibel: status});
  };

  clearFilters() {
    let _ref = {};
    for (let i = 0; i < this.props.selectedFilters.length; i++) {
      _ref.suggestion = this.props.selectedFilters[i];
      this.props.onSuggestionSelected('e', _ref);
    }
  }

  render() {
    const tagsInField = this.props.selectedFilters.length === 0 ? false : true;
    const pholder = tagsInField
      ? ' '
      : T({component: 'filter', name: 'suggesterPlaceholder'});

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      id: 'Searchbar__inputfield',
      type: 'text',
      placeholder: pholder,
      className: 'form-control suggestion-list__search',
      value: this.props.value || '',
      onChange: this.props.onChange,
      onFocus: this.props.onFocus,
      onKeyDown: this.props.onKeyDown,
      onBlur: () => {
        this.toggleInputvisibility(false);
      },
      'data-cy': 'search-bar-input'
    };

    return (
      <React.Fragment>
        {tagsInField && (
          <div style={{height: '0px', marginTop: '3px', marginRight: '10px'}}>
            <Icon
              name="cancel"
              className="md-large d-md-none d-sm-inline-block"
              onClick={() => this.clearFilters()}
            />
          </div>
        )}
        <div
          className={'suggestion-list tags-suggestion-list suggestion-list '}
          onClick={() => this.toggleInputvisibility(true)}
        >
          <Autosuggest
            suggestions={this.state.suggestions}
            onSuggestionsFetchRequested={this.fetchSuggestions}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={suggestion => suggestion}
            renderSuggestion={suggestion =>
              renderSuggestion(suggestion, this.props.value)
            }
            onSuggestionSelected={this.props.onSuggestionSelected}
            focusInputOnSuggestionClick={true}
            inputProps={inputProps}
          />
        </div>
        {!tagsInField && (
          <Icon
            name="search"
            className="md-large d-md-none d-sm-inline-block"
            onClick={() => this.toggleInputvisibility(true)}
          />
        )}
      </React.Fragment>
    );
  }
}

export default TagsSuggester;
