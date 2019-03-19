import React from 'react';
import {Range} from 'rc-slider';
import {isEqual} from 'lodash';

import Heading from '../../base/Heading';
import Icon from '../../base/Icon';
import withTagsFromUrl from '../../base/AdressBar/withTagsFromUrl.hoc';
import {filtersMapAll} from '../../../redux/filter.reducer';

import 'rc-slider/assets/index.css';
import './CardRange.css';

class CardRange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [0, props.filter.range.length - 1],
      initValue: [0, props.filter.range.length - 1]
    };
  }

  componentDidMount() {
    this.initValue();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tags !== nextProps.tags) {
      this.initValue(nextProps.tags);
    }
  }

  initValue(selectedFilters = this.props.tags) {
    const range = this.props.filter.range;

    let min = 0;
    let max = this.props.filter.range.length - 1;

    /* if value in selected filter is a range and exist in current range array */
    selectedFilters.forEach(filter => {
      if (
        filter.type === 'TAG_RANGE' &&
        range.includes(filter.left.id) &&
        range.includes(filter.right.id)
      ) {
        min = range.indexOf(filter.left.id);
        max = range.indexOf(filter.right.id);
      }
    });

    this.handleChange([min, max]);
    this.setState({initValue: [min, max]});
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
      this.props.addTag(ids);
    }
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
export default withTagsFromUrl(CardRange);
