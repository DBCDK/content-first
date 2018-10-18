import React from 'react';
import {connect} from 'react-redux';
import Swiper from 'react-id-swiper';
import {Parallax, Background} from 'react-parallax';

import Icon from '../base/Icon';
import Title from '../base/Title';
import Button from '../base/Button';
import Link from '../general/Link.component';

import {getLeavesMap} from '../../utils/taxonomy';

import './hero.css';

const leavesMap = getLeavesMap();

const params = {
  mousewheel: false,
  slidesPerView: 1,
  noSwiping: true,
  // autoplay: {
  //   delay: 5000,
  //   disableOnInteraction: false
  // },
  slidesPerGroup: 1,
  navigation: false,
  effect: 'fade',
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true
  }
};

export class Hero extends React.Component {
  buildUrl(tags) {
    const aCards = this.props.aCards;
    let url = '/find?';

    tags.forEach(tag => {
      let inRange = false;

      aCards.forEach(card => {
        if (card.range && card.range.includes(tag)) {
          inRange = true;
          return;
        }
      });

      url += `tag=${inRange ? tag + ',' + tag : tag}&`;
    });
    return url.slice(0, -1);
  }

  render() {
    const {heroes, heroesIsLoading} = this.props;

    return (
      <div className="Hero">
        <Swiper {...params}>
          {!heroesIsLoading &&
            heroes.map(hero => {
              if (!hero.disabled) {
                const styles = {
                  backgroundImage: `url(${hero.img})`
                };
                const shadow =
                  hero.color === 'white' ? 'black-shadow' : 'white-shadow';
                const url = this.buildUrl(hero.tags);

                return (
                  <Parallax strength={200}>
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

                      <div className="col-12 col-md-8 col-xl-6 text-left mr-auto ml-auto pt-5">
                        <Title
                          Tag="h3"
                          type="title3"
                          className="mb-4"
                          variant={
                            hero.color !== 'petrolium'
                              ? `color-${hero.color}`
                              : null
                          }
                        >
                          {hero.text}
                        </Title>

                        <div className="searchbar p-2 d-flex justify-content-between">
                          <div className="d-inline h-100">
                            <Icon
                              name="search"
                              className="md-xlarge align-middle mr-3 ml-2"
                            />
                            {hero.tags.map(tag => {
                              return (
                                <Link href={'/find?tag=' + tag}>
                                  <Button
                                    size="large"
                                    type="term"
                                    className="h-100 mr-3"
                                  >
                                    {leavesMap[tag].title}
                                  </Button>
                                </Link>
                              );
                            })}
                          </div>
                          <Link href={url}>
                            <Button
                              type="primary"
                              size="large"
                              className="h-100"
                              variant={`bgcolor-${hero.btnColor}--color-${
                                hero.btnTextColor
                              }`}
                            >
                              {hero.btnText}
                            </Button>
                          </Link>
                        </div>
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
    aCards: Object.values(state.filtercardReducer)
  };
};

export default connect(mapStateToProps)(Hero);
