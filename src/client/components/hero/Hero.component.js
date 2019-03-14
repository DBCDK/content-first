import React from 'react';
import {connect} from 'react-redux';
import Swiper from 'react-id-swiper';
import {isMobile} from 'react-device-detect';

/*** templates ***/
import SearchbarTemplate from './templates/Searchbar.template.js';
import InfoTemplate from './templates/Info.template.js';

import './Hero.css';

const params = {
  mousewheel: false,
  slidesPerView: 1,
  noSwiping: !isMobile,
  speed: 1000,
  loop: true,
  // autoplay: {
  //   delay: 10000,
  //   disableOnInteraction: false
  // },
  slidesPerGroup: 1,
  effect: 'fade',
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true
  }
};

export class Hero extends React.Component {
  template(hero, idx) {
    switch (hero.template) {
      case 'searchbar': {
        return (
          <SearchbarTemplate
            className="swiper-slide"
            key={`${hero.title}-${idx}`}
            hero={hero}
          />
        );
      }
      case 'info': {
        return (
          <InfoTemplate
            className="swiper-slide"
            key={`${hero.title}-${idx}`}
            hero={hero}
          />
        );
      }

      default:
        return <div>{'unknown template'}</div>;
    }
  }

  render() {
    const {
      heroes,
      animate,
      heroesIsLoading,
      startAnimation,
      redirect
    } = this.props;

    return (
      <div className="Hero mb-5">
        <Swiper {...params}>
          {!heroesIsLoading &&
            heroes.map((hero, idx) => {
              if (!hero.disabled) {
                return this.template(hero, idx);
              }
              return null;
            })}
        </Swiper>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    heroes: state.heroReducer.heroes,
    heroesIsLoading: state.heroReducer.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hero);
