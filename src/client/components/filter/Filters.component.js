import React from 'react';
import Swiper from 'react-id-swiper';
import Heading from '../base/Heading';
import Icon from '../base/Icon';
import T from '../base/T';
import CardList from './templates/CardList.component.js';
import CardRange from './templates/CardRange.component.js';
import withTagsFromUrl from '../base/AdressBar/withTagsFromUrl.hoc';

import './Filters.css';

const params = {
  containerClass: 'Filters__swiper-container',
  wrapperClass: 'Filters__swiper-wrapper',
  mousewheel: false,
  slidesPerView: 'auto',
  slidesPerGroup: 1,
  slideToClickedSlide: window.innerWidth < 576,
  navigation: {
    nextEl: '.Filters__next',
    prevEl: '.Filters__prev'
  },
  renderNextButton: () => (
    <div className="Filters__next">
      <span>
        <T component="filter" name="forward" />
      </span>
      <Icon name="chevron_right" />
    </div>
  ),
  renderPrevButton: () => (
    <div className="Filters__prev hidden">
      <Icon name="chevron_left" />
      <span>
        <T component="filter" name="previous" />
      </span>
    </div>
  )
};

class FilterCard extends React.Component {
  getTemplate(template) {
    switch (template) {
      case 'CardList':
        return CardList;
      case 'CardRange':
        return CardRange;
      default:
        return CardList;
    }
  }

  render() {
    const {filter, className, expanded} = this.props;
    const expandedClass = expanded ? 'FilterCard-expanded' : '';
    const Template = this.getTemplate(filter.template);

    return (
      <div
        className={`FilterCard__container ${className} ${expandedClass}`}
        data-cy={
          filter.title
            .toLowerCase()
            .split(' ')
            .join('-') || ''
        }
      >
        <div className={`FilterCard`}>
          <div
            onClick={e => this.props.onCardClick(e)}
            className="FilterCard__cover"
            style={{backgroundImage: `url(${filter.image})`}}
          >
            <Icon name="close" className="FilterCard__close" />
          </div>
          <div
            className="FilterCard__content"
            onClick={e => this.props.onCardClick(e)}
          >
            <Heading type="title" className="FilterCard__heading mb0 mt0">
              {filter.title}
            </Heading>
            {<Template {...this.props} />}
          </div>
        </div>
      </div>
    );
  }
}

class Filters extends React.Component {
  constructor(props) {
    super();
    this.state = {
      showDimmer: false,
      oFilters: props.cards
    };
  }

  componentWillUnmount() {
    this.closeCards();
  }

  toggleCardExpanded(e, title) {
    let oFilters = this.state.oFilters;
    const closeOnSelect = oFilters[title].closeOnSelect;
    const coverClick = e.target.classList.contains('FilterCard__cover');
    const closeClick = e.target.classList.contains('FilterCard__close');

    // Close other expanded
    oFilters = this.changeExpandedProp(false, title);

    if (coverClick || closeClick) {
      /* force close on cover or close click */
      oFilters[title].expanded = !this.state.oFilters[title].expanded;
    } else {
      oFilters[title].expanded = closeOnSelect
        ? !this.state.oFilters[title].expanded
        : true;
    }

    this.setState({oFilters});
  }

  closeCards() {
    const oFilters = this.changeExpandedProp(false);
    this.setState({oFilters});
  }

  changeExpandedProp(status, exclude = '') {
    let oFilters = this.state.oFilters;
    for (let key in oFilters) {
      if (oFilters.hasOwnProperty(key)) {
        if (oFilters[key] !== oFilters[exclude]) {
          oFilters[key].expanded = status;
        }
      }
    }
    return oFilters;
  }

  render() {
    const aFilters = Object.values(this.state.oFilters);
    const expandedCards = aFilters.filter(card => card.expanded);

    const dimmerClass = expandedCards.length > 0 ? 'Filters__dimmer-show' : '';

    return (
      <React.Fragment>
        <Swiper
          {...params}
          ref={node => {
            if (node) {
              this.swiper = node.swiper;
            }
          }}
        >
          {aFilters.map(filter => {
            if (filter.show) {
              return (
                <FilterCard
                  key={filter.title}
                  expanded={filter.expanded}
                  onCardClick={e => this.toggleCardExpanded(e, filter.title)}
                  filter={filter}
                  {...this.props}
                />
              );
            }
          })}
          <div className="FilterCard__space" />
        </Swiper>
        <div
          className={`Filters__dimmer ${dimmerClass}`}
          onClick={() => this.closeCards()}
          data-cy="filterDimmer"
        />
      </React.Fragment>
    );
  }
}

export default withTagsFromUrl(Filters);
