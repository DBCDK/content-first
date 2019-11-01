import React from 'react';
import {connect} from 'react-redux';
import request from 'superagent';
import Autosuggest from 'react-autosuggest';
import {BOOKS_PARTIAL_UPDATE} from '../../../redux/books.reducer';
import Icon from '../../base/Icon';
import T from '../../base/T';
import {HISTORY_REPLACE} from '../../../redux/middleware';

import _ from 'lodash';

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
      <span className="ml1 suggestion-subject" data-cy="cat-name">
        {category}
      </span>
    </div>
  );
};

class TagsSuggester extends React.Component {
  fetchSuggestions = async ({value}) => {
    const response = await request.get('/v1/suggester').query({query: value});
    const clientSuggestions = this.getClientSideSuggestions({value});
    let suggestions = [...clientSuggestions, ...response.body];
    /* performance optimization, updating the redux books state */
    const books = suggestions
      .filter(s => s.type === 'TITLE')
      .map(s => {
        return {
          book: {
            title: s.title,
            creator: s.authorName,
            pid: s.pid
          }
        };
      });
    this.props.updateBooks(books);
    this.setState({suggestions: this.getCombinedSuggestions(suggestions)});
  };

  getCombinedSuggestions = suggs => {
    const groupedTitles = _.groupBy(
      suggs.filter(s => s.type === 'TITLE'),
      'title'
    );

    const seen = {};
    const uniqueSuggestions = suggs
      .filter(s => {
        if (s.type === 'TITLE') {
          if (seen[s.title]) {
            return false;
          }
          seen[s.title] = true;
          return true;
        }
        return true;
      })
      .filter(s =>
        typeof this.props.filterByType === 'undefined'
          ? true
          : s.type === this.props.filterByType
      )
      .map(s => {
        if (s.type === 'TITLE') {
          const retObj = groupedTitles[s.title][0];
          if (groupedTitles[s.title].length > 1) {
            groupedTitles[s.title].forEach((p, num) => {
              if (num === 0) {
                retObj.pid = p.title + ';' + p.pid;
              } else {
                retObj.pid += ';' + p.pid;
              }
            });
          }
          return retObj;
        }
        return s;
      });

    return uniqueSuggestions;
  };

  onSuggestionsClearRequested = () => {
    this.setState({suggestions: []});
    this.props.onChange({target: {value: ''}});
  };
  toggleInputvisibility = status => {
    this.setState({inputVisible: status});
  };

  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      inputVisible: false
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.hideKeyboardOnScroll.bind(this));
    this.setFocus();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.hideKeyboardOnScroll);
  }

  hideKeyboardOnScroll() {
    const prevScrollPosiion = this.prevScrollPosition || 0;
    const difference = window.pageYOffset - prevScrollPosiion;
    if (
      !this.props.scrollableSuggestions &&
      this.searchBar &&
      this.searchBar.input &&
      (difference > 1 || difference < -1)
    ) {
      this.searchBar.input.blur();
      this.prevScrollPosition = window.pageYOffset;
    }
  }

  handleKeyPress(e) {
    if (
      e.key === 'Enter' &&
      this.searchBar &&
      this.searchBar.input &&
      // is moble device
      window.innerWidth < 500
    ) {
      this.searchBar.input.blur();
    }
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

  setFocus = () => {
    const searchField = document.getElementsByClassName(
      'suggestion-list__search_fromTopbar'
    )[0];
    if (searchField) {
      searchField.focus();
    }
    const mobileSearchField = document.getElementsByClassName(
      'suggestion-list__search_fromFilter'
    )[0];
    if (mobileSearchField) {
      mobileSearchField.focus();
    }
  };

  render() {
    const cn = 'form-control suggestion-list__search_' + this.props.origin;
    const tagsInField = this.props.tags.length > 0;
    const pholder = tagsInField
      ? ' '
      : T({component: 'filter', name: 'suggesterPlaceholder'});
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      id: 'Searchbar__inputfield',
      type: 'text',
      placeholder: pholder,
      className: cn,
      value: this.props.value || '',
      onChange: this.props.onChange,
      onFocus: this.props.onFocus,
      onKeyDown: this.props.onKeyDown,
      onBlur: () => {
        this.toggleInputvisibility(false);
      },
      'data-cy': 'search-bar-input',
      onKeyPress: this.handleKeyPress.bind(this)
    };

    return (
      <React.Fragment>
        {tagsInField && (
          <div
            style={{
              cursor: 'pointer',
              height: '0px',
              marginTop: '3px',
              marginRight: '10px'
            }}
          >
            <Icon
              name="cancel"
              className="d-md-none d-sm-inline-block"
              onClick={() => {
                this.props.historyPush(HISTORY_REPLACE, '/find');
                this.setFocus();
              }}
            />
          </div>
        )}
        <div
          className={'suggestion-list tags-suggestion-list suggestion-list'}
          ref="smallSearchBar"
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
            focusInputOnSuggestionClick={!this.props.blurInput}
            inputProps={inputProps}
            highlightFirstSuggestion={true}
            ref={c => (this.searchBar = c)}
          />
        </div>
        {!tagsInField && (
          <Icon
            name="search"
            className="d-md-none d-sm-inline-block"
            onClick={() => this.toggleInputvisibility(true)}
          />
        )}
      </React.Fragment>
    );
  }
}

export const mapDispatchToProps = dispatch => ({
  updateBooks: books => dispatch({type: BOOKS_PARTIAL_UPDATE, books}),
  historyPush: (type, path) => dispatch({type, path})
});
export default connect(
  null,
  mapDispatchToProps
)(TagsSuggester);
