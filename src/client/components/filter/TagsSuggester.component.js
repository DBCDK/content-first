import React from 'react';
import request from 'superagent';
import Autosuggest from 'react-autosuggest';
import {getLeaves} from '../../utils/taxonomy';
const tagObjects = getLeaves();

const search = query => {
  const result = {};
  tagObjects
    .filter(tagObject => {
      if (tagObject.title.toLowerCase().search(query.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
    .splice(0, 10)
    .forEach(tagObject => {
      const nearestParent = tagObject.parents[tagObject.parents.length - 1];
      let group = result[nearestParent];
      if (!group) {
        group = {title: nearestParent, suggestions: []};
        result[nearestParent] = group;
      }
      group.suggestions.push(tagObject);
    });

  return Object.values(result);
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
  return (
    <div className="suggestion-title">
      {addEmphasisToString(suggestion.title, suggestionString)}
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
      suggestions: []
    };
  }

  onSuggestionsFetchRequested({value}) {
    const result = search(value);
    this.setState({suggestions: result});
  }

  onSuggestionsClearRequested() {
    this.setState({suggestions: []});

    delete this.currentRequest;
  }

  onSuggestionSelected(e, props) {
    e.preventDefault();
    this.props.onSubmit(props.suggestion);
    this.setState({value: ''});
  }
  render() {
    const {suggestions} = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Stemning, tempo, handling, genre, sted ...',
      className: 'form-control suggestion-list__search',
      value: this.props.value || '',
      onChange: this.props.onChange,
      onFocus: this.props.onFocus
    };

    // Finally, render it!
    return (
      <div
        className="suggestion-list tags-suggestion-list"
        style={{
          display: 'inline-block',
          width: 350,
          marginTop: 20,
          marginBottom: 0
        }}
      >
        <Autosuggest
          ref={this.props.autosuggestRef}
          suggestions={suggestions}
          multiSection={true}
          onSuggestionsFetchRequested={e => this.onSuggestionsFetchRequested(e)}
          onSuggestionsClearRequested={() => {
            this.onSuggestionsClearRequested();
            this.props.onChange({target: {value: ''}});
          }}
          onSuggestionSelected={this.props.onSuggestionSelected}
          getSuggestionValue={({title}) => title}
          getSectionSuggestions={section => {
            return section.suggestions;
          }}
          renderSuggestion={suggestion =>
            renderSuggestion(suggestion, this.props.value)
          }
          renderSectionTitle={section => renderSectionTitle(section)}
          inputProps={inputProps}
        />
      </div>
    );
  }
}

export default TagsSuggester;
