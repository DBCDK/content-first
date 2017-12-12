import React from 'react';
import request from 'superagent';
import Autosuggest from 'react-autosuggest';

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
    <div className="suggestion-row flex">
      <div className="image">
        <img
          src={`https://content-first.demo.dbc.dk${suggestion.links.cover}`}
          alt={suggestion.book.title}
        />
      </div>
      <div>
        <div className="suggestion-row__title">
          {addEmphasisToString(suggestion.book.title, suggestionString)}
        </div>
        <div className="suggestion-row__creator">
          {addEmphasisToString(suggestion.book.creator, suggestionString)}
        </div>
      </div>
    </div>
  );
};

class ListSuggest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
      suggestions: []
    };
  }

  findSuggestions(filter) {
    if (filter.length >= 2) {
      return this.props.books
        .filter(
          ({book}) =>
            book.title.toLowerCase().includes(filter.toLowerCase()) ||
            book.creator.toLowerCase().includes(filter.toLowerCase())
        )
        .sort((a, b) => {
          return a.book.title > b.book.title ? 1 : -1;
        });
    }

    return [];
  }

  onChange(event, {newValue}) {
    this.setState({
      value: newValue
    });
  }

  onSuggestionsFetchRequested({value}) {
    this.setState({
      suggestions: this.findSuggestions(value)
    });
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  }

  onSuggestionSelected(e, props) {
    e.preventDefault();
    this.props.onSubmit(props.suggestion);
    this.setState({value: ''});
  }
  render() {
    const {value, suggestions} = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Skriv titlen på en bog',
      className: 'form-control suggestion-list__search',
      value,
      onChange: (e, change) => this.onChange(e, change)
    };

    // Finally, render it!
    return (
      <div className="suggestion-list">
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={e => this.onSuggestionsFetchRequested(e)}
          onSuggestionsClearRequested={() => this.onSuggestionsClearRequested()}
          onSuggestionSelected={(e, props) =>
            this.onSuggestionSelected(e, props)
          }
          getSuggestionValue={({book}) => book.title}
          renderSuggestion={suggestion => renderSuggestion(suggestion, value)}
          inputProps={inputProps}
        />
      </div>
    );
  }
}

class BookSearchSuggester extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: []
    };
  }

  componentDidMount() {
    // this should be done at another place. We need a scalable solution for suggestions
    request
      .get('/v1/recommendations')
      .query({tags: [-1]})
      .end((err, res) => {
        if (err) {
          console.error(err); // eslint-disable-line
          return;
        }

        const books = res.body.data;
        this.setState({books});
      });
  }

  render() {
    return (
      <ListSuggest books={this.state.books} onSubmit={this.props.onSubmit} />
    );
  }
}

export default BookSearchSuggester;
