import React from 'react';
import TagsSuggester from './TagsSuggester.component';
import Icon from '../base/Icon';
import Button from '../base/Button';
import withTagsFromUrl from '../base/AdressBar/withTagsFromUrl.hoc';
import withWork from '../base/Work/withWork.hoc';
import './SearchBar.css';

const SelectedWork = withWork(({selected, work, onRemove}) => (
  <Button Tag="div" size="medium" type="term" className={`selected-filter`}>
    <span>{work && work.book.title}</span>
    <Icon
      className="md-small"
      name="close"
      onClick={() => onRemove(selected.match)}
    />
  </Button>
));
const SelectedTag = ({selected, onRemove}) => (
  <Button Tag="div" size="medium" type="term" className={`selected-filter`}>
    <span>{selected.title}</span>
    <Icon
      className="md-small"
      name="close"
      onClick={() => onRemove(selected.match)}
    />
  </Button>
);
const SelectedTagRange = ({selected, onRemove}) => (
  <Button Tag="div" size="medium" type="term" className={`selected-filter`}>
    {selected.left.id === selected.right.id ? (
      <span>{selected.left.title}</span>
    ) : (
      <span>
        {selected.left.title} - {selected.right.title}
      </span>
    )}
    <Icon
      className="md-small"
      name="close"
      onClick={() => onRemove(selected.match)}
    />
  </Button>
);
const SelectedQuery = ({selected, onRemove}) => (
  <Button Tag="div" size="medium" type="term" className={`selected-filter`}>
    <span>{selected.query}</span>
    <Icon
      className="md-small"
      name="close"
      onClick={() => onRemove(selected.match)}
    />
  </Button>
);

class SearchBar extends React.Component {
  constructor() {
    super();
    this.state = {query: '', expanded: false};
  }

  renderSelected = selected => {
    switch (selected.type) {
      case 'TAG':
        return (
          <SelectedTag
            key={selected.match}
            selected={selected}
            onRemove={this.props.removeTag}
          />
        );
      case 'TAG_RANGE':
        return (
          <SelectedTagRange
            key={selected.match}
            selected={selected}
            onRemove={this.props.removeTag}
          />
        );
      case 'TITLE':
        return (
          <SelectedWork
            key={selected.match}
            pid={selected.pid}
            selected={selected}
            onRemove={this.props.removeTag}
          />
        );
      case 'QUERY':
        return (
          <SelectedQuery
            key={selected.match}
            selected={selected}
            onRemove={this.props.removeTag}
          />
        );
      default:
        return null;
    }
  };

  handleOnKeyDown = e => {
    /* handle backspace */
    const {tags} = this.props;
    const query = this.state.query;
    if (tags.length > 0 && e.keyCode === 8 && query === '') {
      this.props.removeTag(tags[tags.length - 1].match);
    }
  };

  initFilterPosition = () => {
    if (this.filtersRef) {
      this.filtersRef.scrollLeft = 99999999;
    }
  };

  onFiltersMouseWheelScrool = e => {
    e.preventDefault();
    let scrollSpeed = 40;
    /* eslint-disable no-unused-expressions */
    e.deltaY > 0
      ? (this.filtersRef.scrollLeft += scrollSpeed)
      : (this.filtersRef.scrollLeft -= scrollSpeed);
    /* eslint-enable no-unused-expressions */
  };

  render() {
    return (
      <React.Fragment>
        <div
          className="selected-filters-wrap text-left"
          id="selected-filters-wrap"
          ref={r => {
            this.filtersRef = r;
          }}
          onWheel={this.onFiltersMouseWheelScrool}
        >
          <TagsSuggester
            tags={this.props.tags}
            filters={this.props.filters}
            value={this.state.query}
            onKeyDown={this.handleOnKeyDown}
            onFocus={() => {
              this.setState({expanded: true});
              this.initFilterPosition();
            }}
            onChange={e => this.setState({query: e.target.value})}
            onSuggestionSelected={(e, {suggestion}) => {
              switch (suggestion.type) {
                case 'TAG':
                  this.props.addTag(suggestion.id);
                  break;
                case 'AUTHOR':
                  this.props.addTag(suggestion.authorName);
                  break;
                case 'TITLE':
                  this.props.addTag(suggestion.pid);
                  break;
                default:
                  break;
              }
            }}
          />
          <div id="selectedFilters" className="selected-filters">
            {this.props.tags.map(filter => this.renderSelected(filter))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default withTagsFromUrl(SearchBar);
