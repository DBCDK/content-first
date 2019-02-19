import React from 'react';
import {connect} from 'react-redux';
import Swiper from 'react-id-swiper';
import {isMobile} from 'react-device-detect';
import {Parallax, Background} from 'react-parallax';

import Icon from '../base/Icon';
import Title from '../base/Title';
import Button from '../base/Button';
import Animate from '../base/Animate';
import Link from '../general/Link.component';

import {getLeavesMap, tagsToUrlParams} from '../../utils/taxonomy';

import {startAnimate} from '../../redux/animate.reducer';
import {HISTORY_PUSH} from '../../redux/middleware';

import './Hero.css';

const leavesMap = getLeavesMap();

const params = {
  mousewheel: false,
  slidesPerView: 1,
  noSwiping: !isMobile,
  speed: 1000,
  loop: true,
  autoplay: {
    delay: 10000,
    disableOnInteraction: false
  },
  slidesPerGroup: 1,
  effect: 'fade',
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true
  }
};

export class Hero extends React.Component {
  inRange(tag) {
    const aCards = Object.values(this.props.aCards);
    let inRange = false;
    aCards.forEach(card => {
      if (card.range && card.range.includes(tag)) {
        inRange = true;
        return;
      }
    });
    return inRange;
  }

  buildUrl(tags) {
    return `/find?tags=${tagsToUrlParams(tags)}`;
  }

  buildTags(tags) {
    return tags.map(tag => {
      return (
        <span
          key={tag}
          ref={e => (this[tag] = e)}
          className="searchbar-tags mt-2 mt-lg-0 d-inline-block"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();

            this.toggleSearchbar('open');
            this.resetSearchbarPlaceholder();

            this.props.startAnimation({
              name: 'tagAnimation',
              component: this.buildAnimationTags([tag]),
              from: this.getPosition(this[tag]),
              to: this.getPosition(document.getElementById('selectedFilters')),
              onEnd: () => this.props.redirect(this.buildUrl([tag]))
            });
          }}
        >
          <Button size="large" type="term" className="mr-3 h-100">
            {leavesMap[tag].title}
          </Button>
        </span>
      );
    });
  }

  buildAnimationTags(tags) {
    return tags.map(tag => {
      return (
        <span
          key={tag}
          className="searchbar-tags searchbar-tags-animate mt-2 mt-lg-0 d-inline-block"
        >
          <Button size="large" type="term" className="mr-3 h-100">
            {leavesMap[tag].title}
            <Icon className="md-small" name="close" />
          </Button>
        </span>
      );
    });
  }

  toggleSearchbar(status) {
    const searchbar = document.getElementById('topbar');
    if (status === 'open') {
      searchbar.classList.remove('searchBar-closed');
    } else if (status === 'close') {
      searchbar.classList.add('searchBar-closed');
    } else {
      return;
    }
  }

  resetSearchbarPlaceholder() {
    document.getElementById('Searchbar__inputfield').placeholder = '';
  }

  getPosition(element) {
    return {
      top: element.getBoundingClientRect().top,
      left: element.getBoundingClientRect().left
    };
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
                const styles = {
                  backgroundImage: `url(${hero.img})`
                };

                const shadow =
                  hero.color === 'white' ? 'black-shadow' : 'white-shadow';

                const filter =
                  hero.color === 'white' ? 'darkFilter' : 'lightFilter';

                const url = this.buildUrl(hero.tags);

                const hideTagsClass =
                  animate['tagsAnimation'] && animate['tagsAnimation'].animating
                    ? 'searchbarTags-hidden'
                    : '';

                return (
                  <Parallax
                    key={`${hero.title}-${idx}`}
                    strength={250}
                    renderLayer={() => (
                      <div className={`hero-filter ${filter}`} />
                    )}
                  >
                    <Background>
                      <div style={styles} className={`hero-bg-image`} />
                    </Background>
                    <div className={`text-center position-relative`}>
                      <Title
                        Tag="h1"
                        type="title1"
                        variant={
                          hero.color !== 'white' ? `color-${hero.color}` : null
                        }
                        className={`${shadow}`}
                      >
                        {hero.title}
                      </Title>

                      <div className="col-12 col-md-10 col-lg-10 col-xl-8 text-left mr-auto ml-auto pt-3 pt-sm-5">
                        <Title
                          Tag="h3"
                          type="title3"
                          className={`${shadow} mb-4`}
                          variant={
                            hero.color !== 'petroleum'
                              ? `color-${hero.color}`
                              : null
                          }
                        >
                          {hero.text}
                        </Title>
                        <span
                          className="searchbar-link"
                          onClick={() => {
                            this.toggleSearchbar('open');
                            this.resetSearchbarPlaceholder();

                            startAnimation({
                              name: 'tagsAnimation',
                              component: this.buildAnimationTags(hero.tags),
                              from: this.getPosition(this.searchbar),
                              to: this.getPosition(
                                document.getElementById('selectedFilters')
                              ),
                              onEnd: () => redirect(url)
                            });
                          }}
                        >
                          <div className="searchbar p-0 p-sm-2 d-inline-flex d-lg-flex flex-column flex-lg-row justify-content-between">
                            <div
                              className={`${hideTagsClass} searchbar-innerWrap d-inline-flex flex-column flex-lg-row d h-100`}
                            >
                              <Icon
                                name="search"
                                className="md-xlarge align-self-center d-none d-lg-inline-block mr-3 ml-2"
                              />
                              <span ref={e => (this.searchbar = e)}>
                                {this.buildTags(hero.tags)}
                              </span>
                            </div>
                            <Button
                              type="primary"
                              size="large"
                              className="searchbar-button mt-4 mt-lg-0 align-self-start"
                              variant={`bgcolor-${hero.btnColor}--color-${
                                hero.btnTextColor
                              }`}
                            >
                              {hero.btnText}
                            </Button>
                          </div>
                        </span>
                      </div>
                    </div>
                  </Parallax>
                );
              }
            })}
        </Swiper>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    heroes: state.heroReducer.heroes,
    heroesIsLoading: state.heroReducer.isLoading,
    aCards: state.filtercardReducer,
    animate: state.animateReducer
  };
};

const mapDispatchToProps = dispatch => ({
  startAnimation: obj => dispatch(startAnimate(obj)),
  redirect: path => dispatch({type: 'HISTORY_PUSH', path})
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hero);
