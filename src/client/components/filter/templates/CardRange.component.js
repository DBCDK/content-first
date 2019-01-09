import React from 'react';
import {connect} from 'react-redux';
import {Range} from 'rc-slider';
import {isEqual} from 'lodash';

import Heading from '../../base/Heading';
import Icon from '../../base/Icon';

import {filtersMapAll, TOGGLE_FILTER} from '../../../redux/filter.reducer';
import {getTagsFromUrl} from '../../../redux/selectors';

import 'rc-slider/assets/index.css';
import './CardRange.css';

class CardRange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [0, props.filter.range.length - 1],
      orgValue: [0, props.filter.range.length - 1]
    };
  }

  componentDidMount() {
    this.initValue();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedTagIds !== nextProps.selectedTagIds) {
      this.initValue(nextProps.selectedFilters);
    }
  }

  initValue(selectedFilters = this.props.selectedFilters) {
    const range = this.props.filter.range;

    let min = 0;
    let max = this.props.filter.range.length - 1;

    /* if value in selected filter is a range and exist in current range array */
    selectedFilters.forEach(filter => {
      if (filter instanceof Array) {
        if (range.includes(filter[0].id) && range.includes(filter[1].id)) {
          min = range.indexOf(filter[0].id);
          max = range.indexOf(filter[1].id);
        }
      }
    });

    this.setState({initValue: [min, max]});
    this.handleChange([min, max]);
  }

  getIdByValue(value = this.state.value) {
    let ids = [];
    const range = this.props.filter.range;

    ids[0] = range[value[0]];
    ids[1] = range[value[1]];
    return ids;
  }

  handleChange(value) {
    this.setState({
      value
    });
  }

  handleAfterChange(value) {
    const oldIds = this.getIdByValue(this.state.initValue);
    const ids = this.getIdByValue(value);
    if (!isEqual(oldIds, ids)) {
      this.toggleRangeFilter(ids);
    }
  }

  toggleRangeFilter(filterId) {
    this.props.toggleFilter(filterId);
    this.setState({orgValue: filterId});
  }

  render() {
    const {filter, expanded} = this.props;

    /* fetch ids by selected value in range slider */
    const ids = this.getIdByValue();

    /* help state vars */
    const equal = ids[0] === ids[1];
    const max = filter.range.length - 1;
    const widest = this.state.value[0] === 0 && this.state.value[1] === max;

    /* class' */
    const inActiveClass = widest ? 'FilterCard__rangeItem-inActive' : '';
    const equalClass = equal ? 'FilterCard__rangeItems-equal' : '';

    return (
      <div
        className={`FilterCard__range swiper-no-swiping ${equalClass} ${inActiveClass}`}
      >
        {expanded && (
          <Heading Tag="h4" type="subtitle" className="mt2 mb0">
            Vælg {filter.title}
          </Heading>
        )}

        <div className="FilterCard__rangeIconWrap text-right">
          <Icon name={filter.icon} className="md-small korn-txt" />
        </div>

        <Range
          min={0}
          max={max}
          allowCross={false}
          value={this.state.value}
          onAfterChange={value => this.handleAfterChange(value)}
          onChange={value => this.handleChange(value)}
        />

        <div className={`FilterCard__rangeItems`}>
          <span className={`FilterCard__rangeItem `}>
            {filtersMapAll[ids[0]].title}
          </span>
          {!equal && (
            <React.Fragment>
              <span className="ml1 mr1"> - </span>
              <span className={`FilterCard__rangeItem`}>
                {filtersMapAll[ids[1]].title}
              </span>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const selectedTagIds = getTagsFromUrl(state);
  return {
    selectedTagIds,
    selectedFilters: selectedTagIds.map(tag => {
      if (tag instanceof Array) {
        return tag.map(aTag => filtersMapAll[aTag]);
      }
      return filtersMapAll[tag.id || tag];
    })
  };
};
export const mapDispatchToProps = dispatch => ({
  toggleFilter: id => dispatch({type: TOGGLE_FILTER, id}),
  history: (type, path, params = {}) => {
    dispatch({type, path, params});
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardRange);
