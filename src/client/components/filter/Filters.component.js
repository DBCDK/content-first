import React from 'react';
import Swiper from 'react-id-swiper';
import {isMobile} from 'react-device-detect';
import Button from '../base/Button';
import Heading from '../base/Heading';
import Icon from '../base/Icon';
import Slider from '../belt/Slider.component';

import './Filters.css';

const oFilters = {
  Stemning: {title: 'Stemning', image: 'img/filters/mood.jpg', expanded: false},
  Længde: {title: 'Længde', image: 'img/filters/length.jpg', expanded: false},
  Tempo: {title: 'Tempo', image: 'img/filters/speed.jpg', expanded: false},
  'Handlingens tid': {
    title: 'Handlingens tid',
    image: 'img/filters/universe.jpg',
    expanded: false
  },
  'På biblioteket': {
    title: 'På biblioteket',
    image: 'img/filters/length.jpg',
    expanded: false
  },
  Struktur: {
    title: 'Struktur',
    image: 'img/filters/length.jpg',
    expanded: false
  },
  Skrivestil: {
    title: 'Skrivestil',
    image: 'img/filters/length.jpg',
    expanded: false
  }
};

// const oFilters = {};
// aFilters.forEach(filter => (oFilters[filter.title] = filter));

const params = {
  containerClass: 'Filters__swiper-container',
  wrapperClass: 'Filters__swiper-wrapper',
  mousewheel: !isMobile,
  pagination: false,
  navigation: {
    nextEl: '.Filters__next',
    prevEl: '.Filters__prev'
  },
  renderNextButton: () => (
    <div className="Filters__next">
      <span>
        Flere<br />valg
      </span>
      <Icon name="chevron_right" />
    </div>
  ),
  renderPrevButton: () => (
    <div className="Filters__prev hidden">
      <Icon name="chevron_left" />
      <span>
        Forrige<br />valg
      </span>
    </div>
  ),
  slidesPerView: 'auto',
  slidesPerGroup: 1,
  slideToClickedSlide: isMobile,
  loopFillGroupWithBlank: isMobile
};

class FilterCard extends React.Component {
  constructor() {
    super();
    // this.state = {expanded: false};
  }

  toggleCollapsible(callback = false) {
    // this.setState({expanded: !this.state.expanded});
  }

  render() {
    const {
      filter,
      className,
      filters,
      selectedFilters,
      onFilterToggle,
      onCardClick,
      expanded
    } = this.props;

    //const expanded = this.state.expanded;
    const expandedClass = expanded ? 'FilterCard-expanded' : '';
    const ignore = [];

    return (
      <div
        className={`FilterCard__container ${className} ${expandedClass}`}
        onClick={() => {
          this.toggleCollapsible();
          setTimeout(() => {
            this.props.onCardClick();
          }, 0);
        }}
      >
        <div className={`FilterCard`}>
          <div
            className="FilterCard__cover"
            style={{backgroundImage: `url(${filter.image})`}}
          />

          <div className="FilterCard__content">
            <Heading type="title" className="FilterCard__heading mb0 mt0">
              {filter.title}
            </Heading>
            <ul className={`FilterCard__list `}>
              {!expanded &&
                filters[filter.title].map(f => {
                  if (
                    selectedFilters
                      .map(selected => selected.id)
                      .indexOf(f.id) >= 0
                  ) {
                    ignore.push(f.id);
                    return (
                      <React.Fragment>
                        <ListItem
                          key={f.id}
                          filter={f}
                          selected={
                            selectedFilters
                              .map(selected => selected.id)
                              .indexOf(f.id) >= 0
                          }
                        />
                        {!expanded && <span>{', '}</span>}
                      </React.Fragment>
                    );
                  }
                })}
              {filters[filter.title].map(f => {
                if (!ignore.includes(f.id)) {
                  return (
                    <React.Fragment>
                      <ListItem
                        key={f.id}
                        filter={f}
                        selected={
                          selectedFilters
                            .map(selected => selected.id)
                            .indexOf(f.id) >= 0
                        }
                        onFilterToggle={onFilterToggle}
                      />
                      {!expanded && <span>{', '}</span>}
                    </React.Fragment>
                  );
                }
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const ListItem = props => {
  const tagState = props.selected ? 'listItem-active' : 'listItem-inactive';
  return (
    <li
      type="tag"
      size="small"
      className={'FilterCard__listItem ' + tagState}
      onClick={() => {
        if (props.onFilterToggle) {
          props.onFilterToggle(props.filter);
        }
      }}
    >
      {props.filter.title}
    </li>
  );
};

class Filters extends React.Component {
  constructor() {
    super();
    this.state = {
      showDimmer: false,
      oFilters: {
        Stemning: {
          title: 'Stemning',
          image: 'img/filters/mood.jpg',
          expanded: false
        },
        Længde: {
          title: 'Længde',
          image: 'img/filters/length.jpg',
          expanded: false
        },
        Tempo: {
          title: 'Tempo',
          image: 'img/filters/speed.jpg',
          expanded: false
        },
        'Handlingens tid': {
          title: 'Handlingens tid',
          image: 'img/filters/universe.jpg',
          expanded: false
        },
        'På biblioteket': {
          title: 'På biblioteket',
          image: 'img/filters/length.jpg',
          expanded: false
        },
        Struktur: {
          title: 'Struktur',
          image: 'img/filters/length.jpg',
          expanded: false
        },
        Skrivestil: {
          title: 'Skrivestil',
          image: 'img/filters/length.jpg',
          expanded: false
        }
      }
    };
  }

  toggleCardExpanded(title) {
    let oFilters = this.state.oFilters;
    if (isMobile) {
      oFilters = this.changeExpandedProp(false, title);
    }
    oFilters[title].expanded = !this.state.oFilters[title].expanded;
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
    const {
      selectedFilters,
      onFilterToggle,
      filters,
      className = ''
    } = this.props;

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
          {aFilters.map(filter => (
            <FilterCard
              expanded={filter.expanded}
              onCardClick={() => this.toggleCardExpanded(filter.title)}
              filter={filter}
              {...this.props}
            />
          ))}
          <div className="FilterCard__space" />
        </Swiper>
        <div
          className={`Filters__dimmer ${dimmerClass}`}
          onClick={() => this.closeCards()}
        />
      </React.Fragment>
    );
  }
}

export default Filters;
