import React from 'react';
import {isMobile} from 'react-device-detect';
import TagsSuggester from './TagsSuggester.component';
import Icon from '../../base/Icon';
import Button from '../../base/Button';
import {withTagsFromUrl} from '../../hoc/AdressBar';
import withPermissions from '../../hoc/Permissions';
import {withWork} from '../../hoc/Work';
import './SearchBar.css';
import {getReqState} from '../../hoc/AdressBar/withTagsFromUrl.hoc';

const SelectedWork = withWork(({selected, work, onRemove}) => {
  return (
    <Button Tag="div" size="medium" type="term" className={`selected-filter`}>
      <span>{work && work.book.title}</span>
      <Icon
        className="md-small"
        name="close"
        onClick={() => onRemove(selected.match)}
      />
    </Button>
  );
});
const SelectedTitles = ({selected, onRemove}) => {
  let comboTitle = selected.pid.split(';').shift();
  return (
    <Button Tag="div" size="medium" type="term" className={`selected-filter`}>
      <span>{comboTitle}</span>
      <Icon
        className="md-small"
        name="close"
        onClick={() => onRemove(selected.match)}
      />
    </Button>
  );
};

const SelectedTag = withPermissions(
  ({selected, onRemove, toggleReq, reqState, onClick}) => (
    <Button
      Tag="div"
      size="medium"
      type="term"
      className={`selected-filter`}
      data-cy={`selected-filter-${selected.title}`}
    >
      <span
        onClick={e => (onClick ? onClick(e) : toggleReq(selected.match))}
        style={{textDecoration: reqState}}
      >
        {selected.title}
      </span>
      <Icon
        className={'md-small' + (isMobile ? ' increase-touch-area-xsmall' : '')}
        name="close"
        onClick={() => onRemove(selected.match)}
      />
    </Button>
  ),
  {
    name: 'SelectedTag',
    modals: {
      login: {
        context: {
          title: 'Avanceret filtrering',
          reason:
            'Log ind for at finde ud af om dit bibliotek abonnerer på Læsekompas.dk - og dermed giver mulighed for avanceret filtrering'
        }
      },
      premium: {
        context: {
          title: 'Avanceret filtrering',
          reason:
            'Dit bibliotek abonnerer desværre ikke på Læsekompas.dk og du har derfor ikke adgang til avenceret filtrering'
        }
      }
    }
  }
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
  <Button
    Tag="div"
    size="medium"
    type="term"
    className={`selected-filter`}
    key={selected}
  >
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
            reqState={getReqState(selected, this.props.plus, this.props.minus)}
            key={selected.match}
            selected={selected}
            onRemove={this.props.removeTag}
            toggleReq={this.props.toggleReq}
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
      case 'TITLES':
        return (
          <SelectedTitles
            key={selected.match}
            pids={selected.pids}
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
    // e.preventDefault(); suppress run-time warning - see https://dbcjira.atlassian.net/browse/CF-1160
    let scrollSpeed = 40;
    /* eslint-disable no-unused-expressions */
    e.deltaY > 0
      ? (this.filtersRef.scrollLeft += scrollSpeed)
      : (this.filtersRef.scrollLeft -= scrollSpeed);
    /* eslint-enable no-unused-expressions */
  };

  componentDidMount() {
    this.initFilterPosition();
  }

  toggleFilter(filterId) {
    this.props.toggleFilter(filterId);
  }

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
            origin={this.props.origin}
            blurInput={this.props.blurInput}
            tags={this.props.tags}
            filters={this.props.filters}
            scrollableSuggestions={this.props.scrollableSuggestions}
            filterByType={this.props.filterByType}
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
