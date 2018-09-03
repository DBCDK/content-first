import React from 'react';
import {connect} from 'react-redux';
import request from 'superagent';
import Autosuggest from 'react-autosuggest';
import BookCover from '../general/BookCover.component';

import {BOOKS_REQUEST} from '../../redux/books.reducer';

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
      <div className="image small">
        <BookCover book={suggestion.book} />
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

class BookSearchSuggester extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
      suggestions: []
    };
  }

  onChange(event, {newValue}) {
    this.setState({
      value: newValue
    });
  }

  async onSuggestionsFetchRequested({value}) {
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
    )
      .data.map(book => ({links: {}, book}))
      .slice(0, 5);

    const pids = results.map(work => work.book.pid);
    this.props.fetchWorks(pids);

    console.log('ddd', results);

    if (this.currentRequest === value) {
      this.setState({suggestions: results});
    }
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
    const {value, suggestions} = this.state;

    console.log('suggestions!!!', suggestions);

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Skriv titel eller forfatter',
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

const mapStateToProps = () => {
  return {};
};

export const mapDispatchToProps = dispatch => ({
  fetchWorks: pids =>
    dispatch({
      type: BOOKS_REQUEST,
      pids: pids
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookSearchSuggester);
