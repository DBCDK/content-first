import React from 'react';
import request from 'superagent';
import Autosuggest from 'react-autosuggest';
import {isMobile} from 'react-device-detect';

import Icon from '../base/Icon';

const parseSearchRes = (query, response) => {
  const result = {};
  response
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
      <Icon name="label" className="md-small" />
      <span className="ml1 suggestion-subject">{suggestion.parents[1]}</span>
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
      tagsSuggestions: [],
      authorTitelSuggestions: [],
      inputVisibel: true
    };
  }

  async onTagsSuggestionsFetchRequested({value}) {
    const response = await request.get('/v1/tags/suggest').query({q: value});
    const result = parseSearchRes(value, response.body.data.tags);
    this.setState({tagsSuggestions: result});
  }

  async onAuthorTitelSuggestionsFetchRequested({value}) {
    value = value.toLowerCase();
    this.currentRequest = value;
    const results = JSON.parse(
      (await request.get(
        '/v1/search?q=' +
          encodeURIComponent(
            value
              .trim()
              .split(/\s+/g)
              .join(' & ') + ':*'
          )
      )).text
    ).data.map(book => ({
      title: book.title,
      suggestions: [
        {
          pid: book.pid,
          title: book.title,
          creator: book.creator,
          parents: ['', 'Forfatter el. titel']
        }
      ]
    }));

    console.log('results: ', results);

    const authorResults = results.filter(match => {
      if (match.suggestions[0].creator) {
        console.log(
          'creator index of?',
          match.suggestions[0].creator.includes(value)
        );
      }

      return (
        match.suggestions[0].creator &&
        match.suggestions[0].creator.includes(value)
      );
    });

    console.log('results2', results);

    const titelResults = results.filter(match => {
      if (match.suggestions[0].titel) {
        console.log(
          'titel index of?',
          match.suggestions[0].titel.includes(value)
        );
      }
      return (
        match.suggestions[0].titel && match.suggestions[0].titel.includes(value)
      );
    });

    console.log('author, titel: ', authorResults, titelResults);

    //const pids = results.map(work => work.book.pid);
    //this.props.fetchWorks(pids);

    if (this.currentRequest === value) {
      this.setState({
        authorSuggestions: authorResults,
        titelSuggestions: titelResults
      });
    }
  }

  onSuggestionsClearRequested() {
    this.setState({tagsSuggestions: [], authorTitelSuggestions: []});
    delete this.currentRequest;
  }

  onSuggestionSelected(e, props) {
    e.preventDefault();
    this.props.onSubmit(props.suggestion);
    this.setState({value: ''});
  }

  toggleInputvisibility(status) {
    this.setState({inputVisibel: status});

    if (status) {
      setTimeout(() => {
        document.getElementById('Searchbar__inputfield').focus();
      }, 0);
    }
  }

  render() {
    const output = 10;
    const {tagsSuggestions, authorTitelSuggestions} = this.state;

    console.log(tagsSuggestions, authorTitelSuggestions);

    //tagsSuggestions.splice(0, output - authorTitelSuggestions.length);

    const suggestions = authorTitelSuggestions.concat(tagsSuggestions);

    console.log(tagsSuggestions, authorTitelSuggestions);
    console.log('vvv', suggestions);

    const inputVisibel = this.state.inputVisibel;
    const tagsInField = this.props.selectedFilters.length === 0 ? false : true;
    const inputVisibelClass = inputVisibel || !tagsInField ? '' : '';
    const suggestionlistClass =
      inputVisibel || !tagsInField ? 'input-visible' : 'input-hidden';

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      id: 'Searchbar__inputfield',
      type: 'search',
      placeholder: 'Søg på titel, forfatter, stemning...',
      className: 'form-control suggestion-list__search ' + inputVisibelClass,
      value: this.props.value || '',
      onChange: this.props.onChange,
      onFocus: this.props.onFocus,
      onKeyDown: this.props.onKeyDown,
      onBlur: () => {
        if (isMobile) {
          this.toggleInputvisibility(false);
        }
      }
    };

    return (
      <React.Fragment>
        {isMobile &&
          tagsInField &&
          !inputVisibel && (
            <Icon
              name="search"
              className="md-large"
              onClick={() => this.toggleInputvisibility(true)}
            />
          )}
        <div
          className={
            'suggestion-list tags-suggestion-list suggestion-list ' +
            suggestionlistClass
          }
          onClick={() => this.toggleInputvisibility(true)}
        >
          <Autosuggest
            suggestions={suggestions}
            multiSection={true}
            onSuggestionsFetchRequested={e => {
              this.onTagsSuggestionsFetchRequested(e);
              this.onAuthorTitelSuggestionsFetchRequested(e);
            }}
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
            highlightFirstSuggestion={true}
            focusInputOnSuggestionClick={true}
            inputProps={inputProps}
          />
        </div>
        {isMobile &&
          !tagsInField && (
            <Icon
              name="search"
              className="md-large"
              onClick={() => this.toggleInputvisibility(true)}
            />
          )}
      </React.Fragment>
    );
  }
}

export default TagsSuggester;
