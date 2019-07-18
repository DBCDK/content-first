import React from 'react';
import ReactDOM from 'react-dom';
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
    const titles = suggs
      .map((s, num) => {
        s.order = num;
        return s;
      })
      .filter(s => s.type === 'TITLE');
    const grouped = _.groupBy(titles, 'title');
    const groupedArr = Object.values(grouped)
      .filter(s => s.length > 1)
      .map(e => {
        let retObj = e[0];
        e.map((p, num) => {
          if (num === 0) {
            retObj.pid = p.title + ';' + p.pid;
          } else {
            retObj.pid += ';' + p.pid;
          }
        });
        return retObj;
      });
    const remainingSuggestions = Object.values(_.groupBy(suggs, 'title'))
      .filter(s => s.length === 1)
      .map(e => e[0]);
    return _.sortBy([...groupedArr, ...remainingSuggestions], ['order']);
  };

  onSuggestionsClearRequested = () => {
    this.setState({suggestions: []});
    this.props.onChange({target: {value: ''}});
  };
  toggleInputvisibility = status => {
    this.setState({inputVisibel: status});
  };

  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      inputVisibel: false
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.hideKeyboardOnScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.hideKeyboardOnScroll);
  }

  hideKeyboardOnScroll() {
    const prevScrollPosiion = this.prevScrollPosiion || 0;
    const difference = window.pageYOffset - prevScrollPosiion;
    if (
      this.sarchBar &&
      this.sarchBar.input &&
      (difference > 1 || difference < -1)
    ) {
      this.sarchBar.input.blur();
      this.prevScrollPosiion = window.pageYOffset;
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Enter' && this.sarchBar && this.sarchBar.input) {
      this.sarchBar.input.blur();
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

  render() {
    const tagsInField = this.props.tags.length > 0;
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
              className="md-large d-md-none d-sm-inline-block"
              onClick={() => {
                this.props.historyPush(HISTORY_REPLACE, '/find');
                const searchfield = ReactDOM.findDOMNode(
                  this.refs.smallSearchBar
                ).getElementsByClassName('suggestion-list__search')[0];
                searchfield.focus();
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
            focusInputOnSuggestionClick={true}
            inputProps={inputProps}
            highlightFirstSuggestion={true}
            ref={c => (this.sarchBar = c)}
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

export const mapDispatchToProps = dispatch => ({
  updateBooks: books => dispatch({type: BOOKS_PARTIAL_UPDATE, books}),
  historyPush: (type, path) => dispatch({type, path})
});
export default connect(
  null,
  mapDispatchToProps
)(TagsSuggester);
