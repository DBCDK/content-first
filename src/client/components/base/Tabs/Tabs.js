import React from 'react';
import Swiper from 'react-id-swiper';
import {isMobile} from 'react-device-detect';

import './Tabs.css';

//
// Default Tabs settings
//

const defaultSettings = {
  containerModifierClass: 'Tabs__container-',
  slideClass: 'swiper-slide',
  mousewheel: false,
  slidesPerView: 1,
  autoHeight: true,
  noSwiping: !isMobile,
  speed: 400,
  loop: false,
  autoplay: false,
  slidesPerGroup: 1,
  effect: 'slide',
  pagination: {
    el: '.Tabs__pagination',
    bulletClass: 'Tabs__pagination-bullet',
    bulletActiveClass: 'Tabs__pagination-bullet-active',
    type: 'bullets',
    clickable: true
  }
};

export class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {index: props.initialSlide || 0, tabHeights: {}};
  }

  componentDidMount() {
    if (this.props.swiper && this.swiper) {
      this.props.swiper(this.swiper);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.swiper) {
      this.swiper.update();
      const currentIndex = this.swiper.realIndex;
      const currentHeight = this.getCurrentHeight();
      const prevHeight = prevState.tabHeights[currentIndex];
      if (prevHeight !== currentHeight) {
        this.props.onUpdate({height: currentHeight});
      }
    }
  }

  getCurrentHeight = () => {
    return this.state.tabHeights[this.swiper.realIndex];
  };

  init = swiper => {
    if (swiper !== this.swiper) {
      this.swiper = swiper;
      swiper.on('transitionStart', this.onPageChange);
      swiper.on('transitionEnd', this.onTransitionEnd);
    }
  };
  onTransitionEnd = () => {
    // hack for avoiding scroll position to be remembered
    window.scroll(window.scrollX, window.scrollY - 1);
  };

  onPageChange = () => {
    this.setState({
      index: this.swiper.realIndex
    });
    if (this.props.onUpdate) {
      this.props.onUpdate({height: this.getCurrentHeight()});
    }

    if (this.props.onPageChange) {
      this.props.onPageChange(
        this.swiper.realIndex,
        this.state.tabHeights[this.swiper.realIndex]
      );
    }
  };

  render() {
    const {
      className = null,
      children,
      initialSlide = 0,
      pages,
      customSettings = {}
    } = this.props;

    // Swiper containerClass
    const containerClass = {
      containerClass: `swiper-container ${className}`
    };

    //
    // Merge settings
    //

    const settings = {
      ...containerClass,
      ...defaultSettings,
      pagination: {
        ...defaultSettings.pagination,
        renderBullet: function(i, swiperClass) {
          return `<span class="${swiperClass} mr-4" data-cy="${pages[i]}">
                  <Text type="body" variant="weight-semibold">
                    ${pages[i]}
                  </Text>
                </span>`;
        }
      },
      ...customSettings
    };

    return (
      <Swiper
        ref={node => {
          if (node) {
            this.init(node.swiper);
          }
        }}
        initialSlide={initialSlide}
        className={className}
        onPageChange={this.onPageChange}
        {...settings}
      >
        {children &&
          children.map((child, idx) => (
            <div
              // we wrap content in div with height set to height of content its wrapping
              // otherwise id-swiper won't detect height properly
              style={{height: this.state.tabHeights[idx]}}
              ref={node => {
                // detect height of content
                // and store it in state if it has changed
                if (node) {
                  if (this.state.tabHeights[idx] !== node.scrollHeight) {
                    const tabHeights = {
                      ...this.state.tabHeights,
                      [idx]: node.scrollHeight
                    };
                    this.setState({tabHeights});
                  }
                }
              }}
              key={idx}
            >
              {child}
            </div>
          ))}
      </Swiper>
    );
  }
}

export default Tabs;
