import React from 'react';
import {connect} from 'react-redux';
import {Parallax, Background} from 'react-parallax';

import Icon from '../../base/Icon';
import Title from '../../base/Title';
import Button from '../../base/Button';

import Explorer from '../explorer/explorer.component.js';

import {getLeavesMap, tagsToUrlParams} from '../../../utils/taxonomy';
import {startAnimate} from '../../../redux/animate.reducer';

import '../Hero.css';
import './Searchbar.css';

const leavesMap = getLeavesMap();

export class SearchbarTemplate extends React.Component {
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
      const cur = this.props.animate[`tag-${tag}`];
      const hideTags = cur && cur.animating ? 'tags-hidden' : '';

      return (
        <span
          key={tag}
          ref={e => (this[tag] = e)}
          className="searchbar-tags mt-2 mt-lg-0 d-inline-block"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();

            if (window.innerWidth < 992) {
              this.props.redirect(this.buildUrl([tag]));
              return;
            }

            this.toggleSearchbar('open');
            this.resetSearchbarPlaceholder();

            this.props.startAnimation({
              name: `tag-${tag}`,
              component: this.buildAnimationTags([tag]),
              from: this.getPosition(this[tag]),
              to: this.getPosition(document.getElementById('selectedFilters')),
              onEnd: () => this.props.redirect(this.buildUrl([tag]))
            });
          }}
        >
          <Button size="large" type="term" className={`${hideTags} mr-3 h-100`}>
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
            <span>{leavesMap[tag].title}</span>
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
    const searchbar = document.getElementById('Searchbar__inputfield');
    if (searchbar) {
      searchbar.placeholder = '';
    }
  }

  getPosition(element) {
    return {
      top: element.getBoundingClientRect().top,
      left: element.getBoundingClientRect().left
    };
  }

  render() {
    const {
      hero,
      className,
      animate,
      heroesIsLoading,
      startAnimation,
      redirect
    } = this.props;

    const shadow = hero.color === 'white' ? 'black-shadow' : 'white-shadow';

    const url = this.buildUrl(hero.tags);

    const hideTags =
      animate.tagsAnimation && animate.tagsAnimation.animating
        ? 'tags-hidden'
        : '';

    return (
      <Parallax
        strength={250}
        className={className}
        renderLayer={() => (
          <div
            className={`swiper-slide hero-filter ${
              hero.color === 'white' ? 'darkFilter' : 'lightFilter'
            }`}
          />
        )}
      >
        <Background>
          <div
            style={{backgroundImage: `url(${hero.img})`}}
            className={`hero-bg-image`}
          />
        </Background>
        <div className={`text-center position-relative`}>
          <Title
            Tag="h1"
            type="title1"
            variant={hero.color !== 'white' ? `color-${hero.color}` : null}
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
                hero.color !== 'petroleum' ? `color-${hero.color}` : null
              }
            >
              {hero.text}
            </Title>
            <span
              className="searchbar-link"
              onClick={() => {
                if (window.innerWidth < 992) {
                  redirect(url);
                  return;
                }

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
                <div className={'searchbar-innerWrap d-inline-flex'}>
                  <Icon
                    name="search"
                    className="md-xlarge align-self-center d-none d-lg-inline-block mr-3 ml-2"
                  />
                  <span
                    className={`${hideTags} d-inline-flex flex-column flex-md-row h-100`}
                    ref={e => (this.searchbar = e)}
                  >
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
        <Explorer />
      </Parallax>
    );
  }
}

const mapStateToProps = state => {
  return {
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
)(SearchbarTemplate);
