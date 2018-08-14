import React from 'react';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import './CardSlider.css';

class CardSlider extends React.Component {
  handleChange() {
    console.log('change');
  }

  render() {
    const {
      filter,
      filters,
      selectedFilters,
      onFilterToggle,
      expanded
    } = this.props;

    return (
      <div className={`FilterCard__slider swiper-no-swiping`}>
        <Slider
          min={0}
          max={filters[filter.title].length}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default CardSlider;
