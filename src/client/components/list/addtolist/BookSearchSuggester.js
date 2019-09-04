import React from 'react';
import {connect} from 'react-redux';
import request from 'superagent';
import Autosuggest from 'react-autosuggest';
import BookCover from '../../general/BookCover/BookCover.component';
import Text from '../../base/Text';
import T from '../../base/T';
import Icon from '../../base/Icon';

import {BOOKS_REQUEST} from '../../../redux/books.reducer';

import './BookSearchSuggester.css';

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
    <div
      className="suggestion-row d-flex p-2"
      data-cy={`suggestion-row-${suggestion.book.title}`}
    >
      <BookCover book={suggestion.book} style={{width: 25}} />
      <div className="ml-3">
        <Text type="body" variant="weight-semibold" className="mb0">
          {addEmphasisToString(suggestion.book.title, suggestionString)}
        </Text>
        <Text type="small" className="mb0">
          {addEmphasisToString(suggestion.book.creator, suggestionString)}
        </Text>
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
  focus = () => {
    this.refs.autosuggest.input.focus();
  };

  async onSuggestionsFetchRequested({value}) {
    value = value.toLowerCase();
    this.currentRequest = value;
    // Suggester request
    const response = await request.get('/v1/suggester').query({query: value});
    // Handle suggester result
    const books = response.body
      .filter(s => s.type === 'TITLE')
      .map(s => {
        return {
          book: {
            title: s.title,
            creator: s.authorName,
            pid: s.pid
          }
        };
      })
      .slice(0, 5);

    const pids = books.map(work => work.book.pid);
    this.props.fetchWorks(pids);

    if (this.currentRequest === value) {
      this.setState({suggestions: books});
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
    const {className, style, suggesterRef} = this.props;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: T({component: 'list', name: 'placeholderBookSuggester'}),
      className: 'w-100 suggestion-list__search',
      value,
      onChange: (e, change) => this.onChange(e, change),
      'data-cy': 'listview-add-element-input'
    };

    // Finally, render it!
    return (
      <div
        className={
          'd-flex position-relative booksearch-suggester suggestion-list ' +
          className
        }
        style={style}
      >
        <Icon name="search" className="align-self-center pl-2 pr-2" />
        <Autosuggest
          ref={suggesterRef}
          suggestions={suggestions}
          onSuggestionsFetchRequested={e => this.onSuggestionsFetchRequested(e)}
          onSuggestionsClearRequested={() => this.onSuggestionsClearRequested()}
          onSuggestionSelected={(e, props) =>
            this.onSuggestionSelected(e, props)
          }
          getSuggestionValue={({book}) => book.title}
          renderSuggestion={suggestion => renderSuggestion(suggestion, value)}
          inputProps={inputProps}
          highlightFirstSuggestion={true}
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
