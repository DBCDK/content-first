import React from 'react';
import request from 'superagent';
import {uniqBy} from 'lodash';
import Autosuggest from 'react-autosuggest';

import Icon from '../base/Icon';
import T from '../base/T';

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
  const icon = suggestion.icon ? suggestion.icon : 'label';
  const text = suggestion.text ? suggestion.text : suggestion.title;

  return (
    <div className="suggestion-title" data-cy="suggestion-element">
      {addEmphasisToString(text, suggestionString)}
      <Icon name={icon} className="md-small" />
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
      tagsSuggestions: {title: 'Tags', suggestions: []},
      authorSuggestions: {title: 'Forfatterer', suggestions: []},
      titleSuggestions: {title: 'Bøger', suggestions: []},
      clientSuggestions: {title: 'Tags', suggestions: []},
      suggestions: [],
      inputVisibel: false
    };
  }

  clientsideFilters({value}) {
    const filters = this.props.filters;
    const length = filters.Længde.filter(l =>
      l.title.toLowerCase().includes(value)
    ).map(l => {
      return {
        id: l.id,
        title: l.title,
        text: l.title,
        parents: ['', 'Længde']
      };
    });

    this.setState({
      clientSuggestions: {title: 'Tags', suggestions: length}
    });
  }

  async onTagsSuggestionsFetchRequested({value}) {
    const response = await request.get('/v1/tags/suggest').query({q: value});
    let result = parseSearchRes(value, response.body.data.tags);
    const merged = [].concat.apply([], result.map(res => res.suggestions));
    this.setState({tagsSuggestions: {title: 'Tags', suggestions: merged}});
  }

  async onAuthorTitleSuggestionsFetchRequested({value}) {
    value = value
      .toLowerCase()
      .split(',')
      .join('');
    this.currentRequest = value;
    const results = JSON.parse(
      (await request.get(
        '/v1/search?q=' +
          encodeURIComponent(
            value
              .trim()
              .replace(/[^A-ZÆØÅa-zæøå0-9 ]/g, ' ')
              .split(/\s+/g)
              .join(' & ') + ':*'
          )
      )).text
    ).data.map(book => ({
      suggestions: [
        {
          title: book.title,
          creator: book.creator
        }
      ]
    }));
    let authorResults = results
      .filter(a => {
        if (!a.suggestions[0].creator.toLowerCase().includes(value)) {
          return a.suggestions[0].title
            .toLowerCase()
            .split(',')
            .join('')
            .includes(value);
        }
        return a.suggestions[0].creator.toLowerCase().includes(value);
      })
      .map(a => {
        return {
          text: a.suggestions[0].creator,
          type: 'creator',
          parents: ['', 'Forfatter'],
          icon: 'account_circle',
          title: a.suggestions[0].creator
        };
      });

    // move duplicated creators
    authorResults = uniqBy(authorResults, 'text');

    const titleResults = results
      .filter(t => {
        if (
          !t.suggestions[0].title
            .toLowerCase()
            .split(',')
            .join('')
            .includes(value)
        ) {
          return t.suggestions[0].creator.toLowerCase().includes(value);
        }
        return t.suggestions[0].title
          .toLowerCase()
          .split(',')
          .join('')
          .includes(value);
      })
      .map(t => {
        return {
          text: t.suggestions[0].title,
          type: 'title',
          parents: ['', 'Bog'],
          icon: 'book',
          title: t.suggestions[0].title
        };
      });

    if (this.currentRequest === value) {
      this.setState({
        authorSuggestions: {title: 'Forfatterer', suggestions: authorResults},
        titleSuggestions: {title: 'Bøger', suggestions: titleResults}
      });
    }
  }

  onSuggestionsClearRequested() {
    this.state = {
      tagsSuggestions: {title: 'Tags', suggestions: []},
      authorSuggestions: {title: 'Forfatterer', suggestions: []},
      titleSuggestions: {title: 'Bøger', suggestions: []}
    };
    delete this.currentRequest;
  }

  toggleInputvisibility(status) {
    this.setState({inputVisibel: status});
  }

  renderSuggestions() {
    let {
      tagsSuggestions,
      clientSuggestions,
      authorSuggestions,
      titleSuggestions
    } = this.state;

    // Add client tags to suggestion tags
    tagsSuggestions.suggestions = [
      ...tagsSuggestions.suggestions,
      ...clientSuggestions.suggestions
    ];

    // Fill suggestions with authors (Maximum 2)
    authorSuggestions = {
      suggestions: authorSuggestions.suggestions.slice(0, 2),
      title: authorSuggestions.title
    };

    // Fill suggestions with book titles (maximum 4)
    titleSuggestions = {
      suggestions: titleSuggestions.suggestions.slice(
        0,
        4 - authorSuggestions.suggestions.length
      ),
      title: titleSuggestions.title
    };

    // Fill suggestions with tags (Maximum 6)
    tagsSuggestions = {
      suggestions: tagsSuggestions.suggestions.slice(
        0,
        10 -
          (titleSuggestions.suggestions.length +
            authorSuggestions.suggestions.length)
      ),
      title: tagsSuggestions.title
    };

    // Backfill suggestions with booktitles if any
    if (tagsSuggestions.suggestions.length < 6) {
      titleSuggestions = {
        suggestions: this.state.titleSuggestions.suggestions.slice(
          0,
          10 -
            (tagsSuggestions.suggestions.length +
              authorSuggestions.suggestions.length)
        ),
        title: titleSuggestions.title
      };
    }

    const suggestions = [];
    // push tags if not empty
    if (tagsSuggestions.suggestions.length > 0) {
      suggestions.push(tagsSuggestions);
    }
    // push authors if not empty
    if (authorSuggestions.suggestions.length > 0) {
      suggestions.push(authorSuggestions);
    }
    // push titles if not empty
    if (titleSuggestions.suggestions.length > 0) {
      suggestions.push(titleSuggestions);
    }

    return suggestions;
  }

  render() {
    const inputVisibel = this.state.inputVisibel;
    const tagsInField = this.props.selectedFilters.length === 0 ? false : true;
    const inputVisibelClass = inputVisibel || !tagsInField ? '' : '';
    const suggestionlistClass =
      inputVisibel || !tagsInField ? 'input-visible' : 'input-hidden';

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      id: 'Searchbar__inputfield',
      type: 'search',
      placeholder: T({component: 'filter', name: 'suggesterPlaceholder'}),
      className: 'form-control suggestion-list__search ' + inputVisibelClass,
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
        {tagsInField &&
          !inputVisibel && (
            <Icon
              name="search"
              className="md-large d-md-none d-sm-inline-block"
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
            suggestions={this.state.suggestions}
            multiSection={true}
            highlightFirstSuggestion={true}
            onSuggestionsFetchRequested={async e => {
              await this.onTagsSuggestionsFetchRequested(e);
              await this.onAuthorTitleSuggestionsFetchRequested(e);
              this.clientsideFilters(e);
              this.setState({suggestions: this.renderSuggestions()});
            }}
            onSuggestionsClearRequested={() => {
              this.onSuggestionsClearRequested();
              this.props.onChange({target: {value: ''}});
            }}
            onSuggestionSelected={this.props.onSuggestionSelected}
            getSuggestionValue={obj => obj.text || obj.title}
            getSectionSuggestions={section => section.suggestions}
            renderSuggestion={suggestion =>
              renderSuggestion(suggestion, this.props.value)
            }
            renderSectionTitle={section => renderSectionTitle(section)}
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
